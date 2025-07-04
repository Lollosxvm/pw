import express from "express";
import {
  getInvestimentiUtente,
  aggiungiInvestimento,
  getCryptoChart,
  getAndamentoInvestimenti,
  getComposizioneInvestimenti,
} from "../controllers/investimentiController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protegge solo le rotte sensibili
router.post("/", verifyToken, aggiungiInvestimento);
router.get("/", verifyToken, getInvestimentiUtente);
router.get("/andamento", verifyToken, getAndamentoInvestimenti);
router.get("/composizione", verifyToken, getComposizioneInvestimenti);

// Rotta pubblica per i dati delle criptovalute
router.get("/crypto", getCryptoChart);

export default router;
