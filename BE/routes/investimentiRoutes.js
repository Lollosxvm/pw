import express from "express";
import {
  getInvestimentiUtente,
  aggiungiInvestimento,
  getCryptoChart,
} from "../controllers/investimentiController.js";

const router = express.Router();

router.post("/", aggiungiInvestimento);
router.get("/crypto", getCryptoChart);
router.get("/:utenteId", getInvestimentiUtente);

export default router;
