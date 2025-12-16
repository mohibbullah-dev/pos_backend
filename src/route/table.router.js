import { Router } from "express";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.route("/addTable").post(verifyToken, addTable);
export default router;
