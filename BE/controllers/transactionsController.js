import { db } from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM transazioni ORDER BY data desc"
    );
    res.json(rows);
  } catch (error) {
    console.error("Errore durante il recupero delle transazioni:", error);
    res.status(500).json({ message: "Errore nel recupero delle transazioni" });
  }
};

export const getSpesePerPaese = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT paese AS id, SUM(importo) AS value
      FROM transazioni
      WHERE stato = 'Completato'
      GROUP BY paese
    `);
    res.json(rows);
  } catch (err) {
    console.error("Errore nel calcolo spese per paese:", err);
    res.status(500).json({ message: "Errore server" });
  }
};

export const getLastTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT categoria, indirizzo, data, importo, stato, metodo
      FROM transazioni
      WHERE stato = 'Completato'
      ORDER BY data DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error("Errore nel recupero delle transazioni recenti:", error);
    res.status(500).json({ message: "Errore nel server" });
  }
};
