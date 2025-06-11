import express from "express";
import {
  getAllTransactions,
  getSpesePerPaese,
  getLastTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/spese-paese", getSpesePerPaese);
router.get("/spese-recenti", getLastTransactions);

export default router;
