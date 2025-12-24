import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createRestaurant } from "../controller/restaurant.controller.js";

const router = Router();
router.route("/restaurantCreate").post(verifyToken, createRestaurant);

export default router;
