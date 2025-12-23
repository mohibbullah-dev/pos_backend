import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { menuCreate } from "../controller/menu.controller.js";

const router = Router();

router.route("/createMenu").post(verifyToken, menuCreate);

export default router;
