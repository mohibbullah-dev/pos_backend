import { Router } from "express";
import { logIn, signUp } from "../controller/user.controller.js";
import { multerAvaterUpload } from "../middleware/fileUpload.js";

const router = Router();
router
  .route("/signup")
  .post(multerAvaterUpload.single("restaurantAvater"), signUp);
router.route("/login").post(logIn);

export default router;
