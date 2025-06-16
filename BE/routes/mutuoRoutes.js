import express from "express";
import { getSituazioneMutuo } from "../controllers/mutuoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/situazione", verifyToken, getSituazioneMutuo);

export default router;
