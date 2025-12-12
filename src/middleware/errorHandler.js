import { NODE_ENV } from "../constant.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || {};
  const errorCode = err.errorCode || "";
  const stack = NODE_ENV === "development" ? err.stack : "";

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    errorCode,
    stack,
  });
};

export default errorHandler;
