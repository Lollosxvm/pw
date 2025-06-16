import express from "express";
import {
  getAllTransactions,
  getSpesePerPaese,
  getLastTransactions,
  getSpesePerCategoria,
  getAndamentiMensili,
} from "../controllers/transactionsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getAllTransactions);
router.get("/spese-per-paese", getSpesePerPaese);
router.get("/spese-recenti", getLastTransactions);
router.get("/spese-per-categorie", getSpesePerCategoria);
router.get("/andamento-trimestrale", getAndamentiMensili);

export default router;
