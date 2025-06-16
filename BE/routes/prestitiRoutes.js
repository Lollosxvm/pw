import express from "express";
import { getSituazionePrestito } from "../controllers/prestitiController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/prestiti/situazione", verifyToken, getSituazionePrestito);

export default router;
