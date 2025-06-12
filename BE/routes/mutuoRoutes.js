import express from "express";
import { getSituazioneMutuo } from "../controllers/mutuoController.js";

const router = express.Router();

router.get("/situazione", getSituazioneMutuo);

export default router;
