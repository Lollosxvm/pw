import { db } from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM transazioni WHERE utente = ? ORDER BY data desc",
      [utente]
    );
    res.json(rows);
  } catch (error) {
    console.error("Errore durante il recupero delle transazioni:", error);
    res.status(500).json({ message: "Errore nel recupero delle transazioni" });
  }
};

export const getSpesePerPaese = async (req, res) => {
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `
      SELECT paese AS id, SUM(importo) AS value
      FROM transazioni
      WHERE stato = 'Completato' AND utente = ?
      GROUP BY paese
    `,
      [utente]
    );
    res.json(rows);
  } catch (err) {
    console.error("Errore nel calcolo spese per paese:", err);
    res.status(500).json({ message: "Errore server" });
  }
};

export const getLastTransactions = async (req, res) => {
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `
      SELECT categoria, indirizzo, data, importo, stato, metodo
      FROM transazioni
      WHERE stato = 'Completato' AND utente = ?
      ORDER BY data DESC
      LIMIT 10
    `,
      [utente]
    );
    res.json(rows);
  } catch (error) {
    console.error("Errore nel recupero delle transazioni recenti:", error);
    res.status(500).json({ message: "Errore nel server" });
  }
};

export const getSpesePerCategoria = async (req, res) => {
  const { from, to } = req.query;
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        DATE_FORMAT(data, '%Y-%m') as mese,
        categoria,
        SUM(importo) as totale
      FROM transazioni
      WHERE stato = 'Completato' AND data BETWEEN ? AND ? AND utente = ?
      GROUP BY mese, categoria
      ORDER BY mese ASC;
    `,
      [from, to, utente]
    );

    res.json(rows);
  } catch (err) {
    console.error("Errore nel recupero delle spese:", err);
    res.status(500).json({ message: "Errore nel recupero delle spese" });
  }
};

export const getAndamentiMensili = async (req, res) => {
  const { from, to } = req.query;
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `
      SELECT
        DATE_FORMAT(data, '%Y-%m') AS mese,
        SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE 0 END) AS entrate,
        SUM(CASE WHEN tipo != 'Entrata' THEN -importo ELSE 0 END) AS uscite,
        SUM(importo) AS saldo
      FROM transazioni
      WHERE stato = 'Completato' AND data BETWEEN ? AND ? AND utente = ?
      GROUP BY mese
      ORDER BY mese ASC
    `,
      [from, to, utente]
    );

    res.json(rows);
  } catch (err) {
    console.error("Errore nel recupero degli andamenti mensili:", err);
    res.status(500).json({
      message: "Errore nel recupero degli andamenti mensili",
    });
  }
};
