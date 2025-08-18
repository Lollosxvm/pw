import { db } from "../config/db.js";

// Lista completa delle transazioni
export const getAllTransactions = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const utente = req.utente.id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM transazioni WHERE utente = ? ORDER BY data desc",
      [utente]
    );
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna transazione trovata per questo utente" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Errore durante il recupero delle transazioni:", error);
    res.status(500).json({ message: "Errore nel recupero delle transazioni" });
  }
};

// Spese per paese
export const getSpesePerPaese = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const utente = req.utente.id;
  try {
    const [rows] = await db.query(
      `SELECT paese AS id, SUM(importo) AS value
       FROM transazioni
       WHERE stato = 'Completato' AND utente = ?
       GROUP BY paese`,
      [utente]
    );
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna spesa trovata per paese per questo utente" });
    }
    res.json(rows);
  } catch (err) {
    console.error("Errore nel calcolo spese per paese:", err);
    res.status(500).json({ message: "Errore server" });
  }
};

// Transazioni recenti (ultime 10)
export const getLastTransactions = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const utente = req.utente.id;
  try {
    const [rows] = await db.query(
      `SELECT categoria, indirizzo, data, importo, stato, metodo
       FROM transazioni
       WHERE stato = 'Completato' AND utente = ?
       ORDER BY data DESC
       LIMIT 10`,
      [utente]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Nessuna transazione recente trovata per questo utente",
      });
    }
    res.json(rows);
  } catch (error) {
    console.error("Errore nel recupero delle transazioni recenti:", error);
    res.status(500).json({ message: "Errore nel server" });
  }
};

// Spese per categoria e mese (range date richiesto)
export const getSpesePerCategoria = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const { from, to } = req.query;
  const utente = req.utente.id;
  // Controllo 400 (parametri obbligatori)
  if (!from || !to) {
    return res
      .status(400)
      .json({ message: "Parametri 'from' e 'to' obbligatori" });
  }
  try {
    const [rows] = await db.query(
      `SELECT 
        DATE_FORMAT(data, '%Y-%m') as mese,
        categoria,
        SUM(importo) as totale
       FROM transazioni
       WHERE stato = 'Completato' AND data BETWEEN ? AND ? AND utente = ?
       GROUP BY mese, categoria
       ORDER BY mese ASC;`,
      [from, to, utente]
    );
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna spesa trovata per questo intervallo" });
    }
    res.json(rows);
  } catch (err) {
    console.error("Errore nel recupero delle spese:", err);
    res.status(500).json({ message: "Errore nel recupero delle spese" });
  }
};

// Andamenti mensili (range date richiesto)
export const getAndamentiMensili = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const { from, to } = req.query;
  const utente = req.utente.id;
  // Controllo 400 (parametri obbligatori)
  if (!from || !to) {
    return res
      .status(400)
      .json({ message: "Parametri 'from' e 'to' obbligatori" });
  }
  try {
    const [rows] = await db.query(
      `SELECT
         DATE_FORMAT(data, '%Y-%m') AS mese,
         SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE 0 END) AS entrate,
         SUM(CASE WHEN tipo != 'Entrata' THEN -importo ELSE 0 END) AS uscite,
         SUM(importo) AS saldo
       FROM transazioni
       WHERE stato = 'Completato' AND data BETWEEN ? AND ? AND utente = ?
       GROUP BY mese
       ORDER BY mese ASC`,
      [from, to, utente]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Nessun andamento mensile trovato per questo intervallo",
      });
    }
    res.json(rows);
  } catch (err) {
    console.error("Errore nel recupero degli andamenti mensili:", err);
    res.status(500).json({
      message: "Errore nel recupero degli andamenti mensili",
    });
  }
};
