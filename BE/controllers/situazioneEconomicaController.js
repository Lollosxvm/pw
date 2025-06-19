import { db } from "../config/db.js";

export const getSaldoAggiornato = async (req, res) => {
  try {
    const utenteId = req.utente.id;

    const [[{ saldoTransazioni }]] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE -importo END) AS saldoTransazioni
      FROM transazioni
      WHERE stato = 'Completato' AND utente = ?
    `,
      [utenteId]
    );

    const saldo = parseFloat(Number(saldoTransazioni || 0).toFixed(2));

    res.json({ saldo });
  } catch (err) {
    console.error("Errore saldo:", err);
    res.status(500).json({ message: "Errore durante il calcolo del saldo" });
  }
};
