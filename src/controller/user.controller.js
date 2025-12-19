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
  conpareHashToken,
} from "../utils/token.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { REFRESH_TOKNE_SECRET } from "../constant.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  // path: "/renewAccessToken",
  maxAge: 10 * 24 * 60 * 60 * 1000,
};

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const localPath = req.file.path;
  console.log("name :", name);
  console.log("email :", email);
  console.log("password :", password);
  console.log("role :", role);
  console.log("phone :", phone);
  console.log("localPath :", localPath);
  console.log("req.boy from frontend :", req.body)

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

  const user = await User.findOne({ email }).select("+password");
  // .select("-password");
  if (!user) throw new apiError(404, "user not found");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new apiError(400, "invalid credentials");
  const jti = crypto.randomUUID(); // node.js built-in library to make auto hash

  const accesstoken = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, jti);

  const userAgent = req.get("user-agent");

  const hash_Token = await hashToken(refreshToken);

  if (!accesstoken || !refreshToken)
    throw new apiError(400, "token generation failed");

  await RefreshSession.create({
    userId: user._id,
    tokenHash: hash_Token,
    jti,
    userAgent: userAgent,
    ip: req.ip,
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  // delete password
  const userObj = user.toObject();
  delete userObj.password;

  return res
    .status(200)
    .json(new apiSuccess(200, "login successful", { accesstoken, userObj }));
});

const logOut = asyncHandler(async (req, res) => {
  const refreToken = req.cookies?.refreshToken;
  console.log("refreToken :", refreToken);
  console.log("refreToken :", refreToken);

  if (!refreToken) throw new apiError(400, "refreshToken not found");

  const payload = await jwt.verify(refreToken, REFRESH_TOKNE_SECRET);
  console.log("payload :", payload);

  if (!payload?.id)
    throw new apiError(400, "refreshToken dosen't contain valid info");

  const session = await RefreshSession.findOne({
    userId: payload?.id,
    currentStatus: "logedIn",
  });
  if (!session) throw new apiError(400, "session not found");

  const isMatchHashedToken = await conpareHashToken(
    refreToken,
    session.tokenHash
  );
  if (!isMatchHashedToken) throw new apiError(400, "tokenHash no match");
  session.tokenHash = null;
  session.revokedAt = new Date();
  session.currentStatus = "logedOut";
  await session.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken", cookieOptions);
  return res.status(200).json(new apiSuccess(200, "logOut successfully"));
});

const generateNewAccessToken = asyncHandler(async (req, res) => {
  const refreToken = req.cookies?.refreshToken;
  if (!refreToken) throw new apiError(400, "refreToken not found");

  const payload = await jwt.verify(refreToken, REFRESH_TOKNE_SECRET);

  if (!payload?.id)
    throw new apiError(400, "refreshToken dosen't contain valid info");

  const session = await RefreshSession.findOne({
    userId: payload?.id,
    currentStatus: "logedIn",
  });

  if (!session) throw new apiError(400, "session not found");

  const newRefreshToken = await generateRefreshToken(payload?.id);
  const newAccessToken = await generateAccessToken(payload?.id);

  // const jti = crypto.randomUUID();
  // const userAgent = req.get("user-agent");

  // if (!sessions.length === 0) throw new apiError(400, "no refreshToken");
  const isMatch = await conpareHashToken(refreToken, session?.tokenHash);
  if (!isMatch) throw new apiError(400, "tokenHashed no match");
  const newHashToken = await hashToken(newRefreshToken);

  session.tokenHash = newHashToken;
  session.currentStatus = "logedIn";

  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  return res.status(200).json(
    new apiSuccess(200, "regenerated accessToken successfully", {
      newAccessToken,
    })
  );
});

const me = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findById(userId).select("-password");
  if (!user) throw new apiError(404, "user not found");

  return res.status(200).json(new apiSuccess(200, "fetched my info", user));
});

export { signUp, logIn, generateNewAccessToken, logOut, me };
