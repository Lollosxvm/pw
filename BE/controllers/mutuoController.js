import { db } from "../config/db.js";

export const getSituazioneMutuo = async (req, res) => {
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `
      SELECT stato, COUNT(*) as count, SUM(importo) as totale
      FROM rate_mutuo
      WHERE utente = ?
      GROUP BY stato
    `,
      [utente]
    );

    const situazione = {
      pagata: { count: 0, totale: 0 },
      in_scadenza: { count: 0, totale: 0 },
      da_pagare: { count: 0, totale: 0 },
    };

    rows.forEach((row) => {
      situazione[row.stato] = {
        count: row.count,
        totale: parseFloat(row.totale),
      };
    });

    res.json(situazione);
  } catch (err) {
    console.error("Errore nel recupero situazione mutuo:", err);
    res.status(500).json({ message: "Errore nel server" });
  }
};
