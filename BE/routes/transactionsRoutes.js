import express from "express";
import {
  getAllTransactions,
  getSpesePerPaese,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/spese-paese", getSpesePerPaese);

export default router;
