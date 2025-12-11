import express from "express";
import cookiePaser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookiePaser());

app.get("/", (res, req) => {
  res.json({ message: "hello world" });
});

export { app };
