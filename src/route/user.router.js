import { Router } from "express";
import {
  generateNewAccessToken,
  logIn,
  logOut,
  signUp,
} from "../controller/user.controller.js";
import { multerAvaterUpload } from "../middleware/fileUpload.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();
router
  .route("/signup")
  .post(multerAvaterUpload.single("restaurantAvater"), signUp);
router.route("/login").post(logIn);

router.route("/refreshTokn").post(generateNewAccessToken);
router.route("/logOut").post(verifyToken, logOut);

export default router;
