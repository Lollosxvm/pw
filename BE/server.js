import express from "express";
import cors from "cors";
import { db } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel DB" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
