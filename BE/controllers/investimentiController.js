import { db } from "../config/db.js";

export const aggiungiInvestimento = async (req, res) => {
  const { utente_id, asset, operazione, quantita, prezzo_unitario } = req.body;

  try {
    await db.query(
      `INSERT INTO investimenti (utente_id, asset, operazione, quantita, prezzo_unitario)
       VALUES (?, ?, ?, ?, ?)`,
      [utente_id, asset, operazione, quantita, prezzo_unitario]
    );

    res.status(201).json({ message: "Operazione registrata con successo" });
  } catch (err) {
    console.error("Errore inserimento investimento:", err);
    res.status(500).json({ message: "Errore lato server" });
  }
};

export const getInvestimentiUtente = async (req, res) => {
  const { utenteId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM investimenti WHERE utente_id = ? ORDER BY data_operazione DESC`,
      [utenteId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Errore recupero investimenti:", err);
    res.status(500).json({ message: "Errore lato server" });
  }
};
