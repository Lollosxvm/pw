import { db } from "../config/db.js";

export const getSituazionePrestito = async (req, res) => {
  // 1. Controllo autenticazione (utile se il middleware non è perfetto)
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  const utente = req.utente.id;

  try {
    // 2. Query DB
    const [rows] = await db.query(
      `
      SELECT stato, COUNT(*) as count, SUM(importo) as totale
      FROM rate_prestito
      WHERE utente = ?
      GROUP BY stato
      `,
      [utente]
    );

    // 3. Nessuna rata trovata (404)
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna rata prestito trovata per questo utente" });
    }

    // 4. Composizione risposta
    const situazione = {
      pagata: { count: 0, totale: 0 },
      in_scadenza: { count: 0, totale: 0 },
      da_pagare: { count: 0, totale: 0 },
    };

    rows.forEach((row) => {
      if (situazione.hasOwnProperty(row.stato)) {
        situazione[row.stato] = {
          count: row.count,
          totale: parseFloat(row.totale),
        };
      }
    });

    // 5. Risposta OK
    res.json(situazione);
  } catch (err) {
    console.error("Errore nel recupero situazione prestito:", err);
    res.status(500).json({ message: "Errore nel server" });
  }
};
