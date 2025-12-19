import { Router } from "express";
import {
  generateNewAccessToken,
  logIn,
  logOut,
  me,
  signUp,
} from "../controller/user.controller.js";
import { multerAvaterUpload } from "../middleware/fileUpload.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();
router.route("/signup").post(multerAvaterUpload.single("avatar"), signUp);
router.route("/login").post(logIn);
router.route("/logOut").post(verifyToken, logOut);
router.route("/refreshTokn").post(generateNewAccessToken);
router.route("/me").get(verifyToken, me);

export default router;
