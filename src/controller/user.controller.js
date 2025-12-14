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
  path: "/renewAccessToken",
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

  const user = await User.findOne({ email });
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

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/renewAccessToken",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  await RefreshSession.create({
    userId: user._id,
    tokenHash: hash_Token,
    jti,
    userAgent: userAgent,
    ip: req.ip,
    expiredAt: new Date(Date.now()) + 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res
    .status(200)
    .json(new apiSuccess(200, "login successful", { accesstoken }));
});

const logOut = asyncHandler(async (req, res) => {
  const refreToken = req.cookies?.refreshToken;

  if (refreToken) {
    const payload = await jwt.verify(refreToken, REFRESH_TOKNE_SECRET);
    const sessions = await RefreshSession.find({
      userId: payload.id,
      revokedAt: null,
    });
    console.log("sessions :", sessions);
    if (!sessions.length === 0) {
      for (s of sessions) {
        const ok = await conpareHashToken(refreToken, s.tokenHash);
        if (ok) {
          s.revokedAt = new Date();
          await s.save({ validateBeforeSave: false });
          break;
        }
      }
    }
  }

  res.clearCookie("refreshToken", cookieOptions);
  return res.status(200).json(new apiSuccess(200, "logOut successfully"));
});

const generateNewAccessToken = asyncHandler(async (req, res) => {
  const incomeingRefreshToken = req.cookies?.accessToken;
  if (!incomeingRefreshToken) throw new apiError(400, "token not found");
  let payload;

  try {
    payload = await bcrypt.verify(incomeingRefreshToken, REFRESH_TOKNE_SECRET);
  } catch (error) {
    throw new apiError(400, "invalid refreshToken");
  }
  const session = await RefreshSession.findOne({
    userId: payload?.id,
    revokedAt: null,
  });
  if (!session) throw new apiError("404", "refreshToken not found");

  const jti = crypto.randomUUID(); // node.js built-in library to make auto hash
  const userAgent = req.get("user-agent");

  const isMatch = await conpareHashToken(
    incomeingRefreshToken,
    session?.tokenHash
  );
  if (!isMatch) throw new apiError(400, "refreshToke dosen't match");

  const newAccessToken = await generateRefreshToken(session.id);

  const hashToken = await hashToken(newAccessToken);

  session.revokedAt = new Date();
  session.replaceByTokenHash = newHash;
  await session.save({ validateBeforeSave: true });

  await RefreshSession.create({
    userId: payload._id,
    tokenHash: hashToken,
    jti,
    userAgent: userAgent,
    ip: req.ip,
    expiredAt: new Date(Date.now()) + 30 * 24 * 60 * 60 * 1000,
  });
});

export { signUp, logIn, generateNewAccessToken, logOut };
