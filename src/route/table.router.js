import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { addTables } from "../controller/table.controller.js";

const router = Router();
router.route("/addTable").post(verifyToken, addTables);

export default router;
