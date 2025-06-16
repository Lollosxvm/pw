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
router.get("/spese-paese", getSpesePerPaese);
router.get("/spese-recenti", getLastTransactions);
router.get("/spese-categorie", getSpesePerCategoria);
router.get("/andamento", getAndamentiMensili);

export default router;
