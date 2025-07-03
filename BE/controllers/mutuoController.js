import { db } from "../config/db.js";

export const getSituazioneMutuo = async (req, res) => {
  // 1. Controllo autenticazione (gestito solitamente da middleware, ma meglio essere sicuri)
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  const utente = req.utente.id;

  try {
    // 2. Query al DB
    const [rows] = await db.query(
      `
      SELECT stato, COUNT(*) as count, SUM(importo) as totale
      FROM rate_mutuo
      WHERE utente = ?
      GROUP BY stato
      `,
      [utente]
    );

    // 3. Nessuna rata trovata (errore 404)
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna rata mutuo trovata per questo utente" });
    }

    // 4. Calcolo situazione
    const situazione = {
      pagata: { count: 0, totale: 0 },
      in_scadenza: { count: 0, totale: 0 },
      da_pagare: { count: 0, totale: 0 },
    };

    rows.forEach((row) => {
      // Eventuale controllo per sicurezza sui valori attesi
      if (situazione.hasOwnProperty(row.stato)) {
        situazione[row.stato] = {
          count: row.count,
          totale: parseFloat(row.totale),
        };
      }
    });

    // 5. Risposta OK (200)
    res.json(situazione);
  } catch (err) {
    console.error("Errore nel recupero situazione mutuo:", err);
    res.status(500).json({ message: "Errore nel server" });
  }
};
