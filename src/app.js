import express from "express";
import cookiePaser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookiePaser());

app.get("/", (req, res) => {
  console.log("this route test");
  res.status(200).json({ message: "hello world" });
});

app.use(errorHandler);

export { app };
