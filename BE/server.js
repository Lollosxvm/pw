import express from "express";
import cors from "cors";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import mutuoRoutes from "./routes/mutuoRoutes.js";
import prestitiRoutes from "./routes/prestitiRoutes.js";
import { aggiornaRateMutuo } from "./utils/aggiornaRateMutuo.js";
import { aggiornaRatePrestiti } from "./utils/aggiornaRatePrestiti.js";
import investimentiRoutes from "./routes/investimentiRoutes.js";
import "././utils/aggiornaRateMutuo.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRoutes);
app.use("/api/mutuo", mutuoRoutes);
app.use("/api", prestitiRoutes);
app.use("/api/investimenti", investimentiRoutes);

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT} \n`);
  aggiornaRateMutuo();
  aggiornaRatePrestiti();
});
