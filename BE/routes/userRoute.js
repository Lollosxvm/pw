import express from "express";
import {
  aggiornaProfiloUtente,
  getProfiloUtente,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/update", verifyToken, aggiornaProfiloUtente);
router.get("/me", verifyToken, getProfiloUtente);

export default router;
