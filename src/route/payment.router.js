import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createChekOut,
  getPaymentPublic,
} from "../controller/payment.controller.js";

const router = Router();

router.route("/checkout/:orderId").post(verifyToken, createChekOut);
router.route("/public/:paymentId").get(verifyToken, getPaymentPublic);

export default router;
