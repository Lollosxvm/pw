import express from "express";
import {
  getInvestimentiUtente,
  aggiungiInvestimento,
} from "../controllers/investimentiController.js";

const router = express.Router();

router.get("/:utenteId", getInvestimentiUtente);
router.post("/", aggiungiInvestimento);

export default router;
