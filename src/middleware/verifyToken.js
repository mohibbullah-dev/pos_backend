import { ACCESS_TOKEN_SECRET } from "../constant.js";
import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = res.data?.data?.accesstoken;
  if (!token) throw new apiError(400, "accessToken is not found");

  let decodedToken;

  try {
    decodedToken = await jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (decodedToken?.id) {
      const user = await User.findById(decodedToken?.id).select("-password");
      if (!user) throw new apiError(404, "user not found");
      req.user = user._id;
      next();
    }
  } catch (error) {
    throw new apiError(400, "invalid access token");
  }
};

export default verifyToken;
