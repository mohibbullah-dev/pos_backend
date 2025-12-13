import { RefreshSession } from "../model/refreshSession.model.js";
import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinaryImageUpload } from "../utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.js";
import crypto from "crypto";
const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const localPath = req.file.path;
  console.log("name :", name);
  console.log("email :", email);
  console.log("password :", password);
  console.log("role :", role);
  console.log("phone :", phone);
  console.log("localPath :", localPath);

  if (!name || !email || !password || !role || !phone || !localPath)
    throw new apiError(400, "all fields are required");

  const exist = await User.findOne({ email });
  if (exist) throw new apiError(400, "user already exists");

  const cloudinaryRes = await cloudinaryImageUpload(localPath, {
    folder: "restaurantAvatar",
    use_filenames: true,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { width: 300, height: 300, crop: "fill", gravity: "face" },
      { radius: "max" },
    ],
    public_id: Date.now(),
  });

  console.log("cloudinaryRes :", cloudinaryRes);

  if (cloudinaryRes.secure_url && cloudinaryRes.public_id) {
    const createUser = await User.create({
      name,
      email,
      phone,
      password,
      role,
      avatar: {
        url: cloudinaryRes.secure_url,
        public_id: cloudinaryRes.public_id,
      },
    });

    if (!createUser)
      throw new apiError(500, " something went wrong when user creating");

    console.log("createUser :", createUser);

    return res
      .status(201)
      .json(new apiSuccess(201, "user created successfully", createUser));
  }
});

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new apiError(400, "email & appword are required");

  const user = await User.findOne({ email });
  // .select("-password");
  if (!user) throw new apiError(404, "user not found");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new apiError(400, "invalid credentials");

  const accesstoken = await generateAccessToken(user._id);

  const jti = crypto.randomUUID(); // node.js built-in library to make auto hash

  const userAgent = req.get("user-agent");

  const refreToken = await generateRefreshToken(user._id, jti);

  const hash_Token = await hashToken(refreToken);

  if (!accesstoken || !refreToken)
    throw new apiError(400, "token generation failed");

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/renewAccessToken",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  await RefreshSession.create({
    userId: user._id,
    tokekHash: hash_Token,
    jti,
    userAgent: userAgent,
    ip: req.ip,
    expiredAt: new Date(Date.now()) + 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", refreToken, cookieOptions);

  return res
    .status(200)
    .json(new apiSuccess(200, "login successful", { accesstoken }));
});

export { signUp, logIn };
