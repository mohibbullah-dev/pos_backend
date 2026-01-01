import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { creatPaymenConfig } from "../controller/paymentConfig.controller.js";

const router = Router();
router.post("/payment-config", verifyToken, creatPaymenConfig);
export default router;
