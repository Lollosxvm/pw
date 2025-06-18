import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import mutuoRoutes from "./routes/mutuoRoutes.js";
import prestitiRoutes from "./routes/prestitiRoutes.js";
import { aggiornaRateMutuo } from "./utils/aggiornaRateMutuo.js";
import { aggiornaRatePrestiti } from "./utils/aggiornaRatePrestiti.js";
import { setupServerEvents } from "./utils/statoDB.js";
import { db } from "./config/db.js";
import investimentiRoutes from "./routes/investimentiRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3001;
dotenv.config();

app.use(
  cors({
    origin: (origin, callback) => {
      const ALLOWED_ORIGINS = ["http://localhost:5173"];
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/transazioni", transactionsRoutes);
app.use("/api/mutuo", mutuoRoutes);
app.use("/api", prestitiRoutes);
app.use("/api/investimenti", investimentiRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", authRoutes);

app.listen(PORT, async () => {
  console.log(`Server attivo su http://localhost:${PORT} \n`);

  setupServerEvents(db);

  try {
    await aggiornaRateMutuo();
  } catch (error) {
    console.error("[Mutuo] Errore aggiornamento automatico:", error.message);
  }

  try {
    await aggiornaRatePrestiti();
  } catch (error) {
    console.error("[Prestiti] Errore aggiornamento automatico:", error.message);
  }
});
