import { Router } from "express";
import { signUp } from "../controller/user.controller.js";

const router = Router();
router.route("/signup").post(signUp);

export default router;
