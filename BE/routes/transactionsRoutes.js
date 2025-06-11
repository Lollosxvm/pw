import express from "express";
import {
  getAllTransactions,
  getSpesePerPaese,
  getLastTransactions,
  getSpesePerCategoria,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/spese-paese", getSpesePerPaese);
router.get("/spese-recenti", getLastTransactions);
router.get("/spese-categorie", getSpesePerCategoria);

export default router;
