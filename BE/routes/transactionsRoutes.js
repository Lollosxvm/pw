import express from "express";
import { getAllTransactions } from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/", getAllTransactions);

export default router;
