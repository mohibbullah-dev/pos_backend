import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { addTables, getTables } from "../controller/table.controller.js";

const router = Router();
router.route("/addTable").post(verifyToken, addTables);
router.route("/getTables").get(verifyToken, getTables);

export default router;
