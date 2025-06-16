import express from "express";
import { getCryptoNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getCryptoNews);

export default router;
