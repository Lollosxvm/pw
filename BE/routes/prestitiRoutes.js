import express from "express";
import { getSituazionePrestito } from "../controllers/prestitiController.js";

const router = express.Router();

router.get("/prestiti/situazione", getSituazionePrestito);

export default router;
