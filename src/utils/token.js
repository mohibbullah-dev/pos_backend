import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKNE_SECRET,
} from "../constant";

const generateJwtToken = async (userId) => {
  return await jwt.sign({ id: userId }, JWT_TOKEN_SECRET, {
    expiresIn: JWT_TOKEN_EXPIRES_IN,
  });
};

const generateAccessToken = async (userId) => {
  return await jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = async (userId) => {
  return await jwt.sign({ id: userId }, REFRESH_TOKNE_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

const hashToken = async (token) => {
  return await bcrypt.hash(token, 10);
};
const conpareHashToken = async (newToken, oldToken) => {
  return await bcrypt.compare(newToken, oldToken);
};

export {
  generateAccessToken,
  generateJwtToken,
  generateRefreshToken,
  hashToken,
  conpareHashToken,
};
