import { db } from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM transactions");
    res.json(rows);
  } catch (error) {
    console.error("Errore durante il recupero delle transazioni:", error);
    res.status(500).json({ message: "Errore nel recupero delle transazioni" });
  }
};
