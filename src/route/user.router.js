import { Router } from "express";
import { signUp } from "../controller/user.controller.js";
import { multerAvaterUpload } from "../middleware/fileUpload.js";

const router = Router();
router
  .route("/signup")
  .post(multerAvaterUpload.single("restaurantAvater"), signUp);

export default router;
