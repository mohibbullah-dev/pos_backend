import { Router } from "express";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.route("/addTable").post(verifyToken, addTable);
router.route("/gettable").get(verifyToken, getTable);
router.route("/updateTable").put(verifyToken, updateTable);

export default router;
