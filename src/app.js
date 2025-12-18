import express from "express";
import cookiePaser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookiePaser());

// route start from here

import userRoute from "./route/user.router.js";
import orderRoute from "./route/order.router.js";
import tableRoute from "./route/table.router.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/tables", tableRoute);

app.use(errorHandler);
export { app };
