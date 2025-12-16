import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../controller/order.contorller.js";

const router = Router();

router.route("/addOrder").post(verifyToken, addOrder);
router.route("/getOrder/:id").post(verifyToken, getOrder);
router.route("/getOrders").post(verifyToken, getOrders);
router.route("/updateOrder/:id").put(verifyToken, updateOrder);

export default router;
