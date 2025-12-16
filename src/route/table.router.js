import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addTables,
  getTables,
  updateTable,
} from "../controller/table.controller.js";

const router = Router();
router.route("/addTable").post(verifyToken, addTables);
router.route("/getTables").get(verifyToken, getTables);
router.route("/tableUpdate/:id").put(verifyToken, updateTable);

export default router;
