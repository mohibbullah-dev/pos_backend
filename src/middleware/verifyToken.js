import { ACCESS_TOKEN_SECRET } from "../constant.js";
import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new apiError(401, "accessToken is not found");

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id);
    if (!user) throw new apiError(404, "user not found");
    req.user = user;
    req.restaurant = user?.restaurantId;
    next();
  } catch (error) {
    throw new apiError(401, "invalid or exipred accessToken");
  }
};

export default verifyToken;
