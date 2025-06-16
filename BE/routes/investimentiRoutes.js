import express from "express";
import {
  getInvestimentiUtente,
  aggiungiInvestimento,
  getCryptoChart,
} from "../controllers/investimentiController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protegge solo le rotte sensibili
router.post("/", verifyToken, aggiungiInvestimento);
router.get("/:utenteId", verifyToken, getInvestimentiUtente);

// Rotta pubblica per i dati delle criptovalute
router.get("/crypto", getCryptoChart);

export default router;
