import { db } from "../config/db.js";

export const aggiornaProfiloUtente = async (req, res) => {
  const id = req.utente.id;
  const { nome, cognome, email, telefono, indirizzo1, indirizzo2, citta } =
    req.body;

  try {
    await db.query(
      `UPDATE utenti 
       SET nome = ?, cognome = ?, email = ?, telefono = ?, indirizzo1 = ?, indirizzo2 = ?, citta = ?
       WHERE id = ?`,
      [nome, cognome, email, telefono, indirizzo1, indirizzo2, citta, id]
    );

    res.status(200).json({ message: "Profilo aggiornato con successo" });
  } catch (error) {
    console.error("Errore aggiornamento profilo:", error);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento del profilo" });
  }
};

export const getProfiloUtente = async (req, res) => {
  const id = req.utente.id;

  try {
    const [rows] = await db.query(
      `SELECT nome, cognome, email, telefono, indirizzo1, indirizzo2, citta FROM utenti WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Errore recupero profilo:", error);
    res.status(500).json({ message: "Errore durante il recupero del profilo" });
  }
};
