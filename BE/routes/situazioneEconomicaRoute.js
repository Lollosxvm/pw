import express from "express";
import { getSaldoAggiornato } from "../controllers/situazioneEconomicaController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/saldo", verifyToken, getSaldoAggiornato);

export default router;
