import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createRestaurant } from "../controller/restaurant.controller.js";
import { singleFileUpload } from "../middleware/fileUpload.js";

const router = Router();
router
  .route("/restaurantCreate")
  .post(
    verifyToken,
    singleFileUpload.single("restaurantLogo"),
    createRestaurant
  );

export default router;
