import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { addOrder } from "../controller/order.contorller.js";

const router = Router();

router.route("/addOrder").post(verifyToken, addOrder);
