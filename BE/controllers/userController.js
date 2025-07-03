import { db } from "../config/db.js";

// GET profilo utente
export const getProfiloUtente = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
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

// PUT aggiorna profilo utente
export const aggiornaProfiloUtente = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }
  const id = req.utente.id;
  const { nome, cognome, email, telefono, indirizzo1, indirizzo2, citta } =
    req.body;

  // Controllo base dati richiesti
  if (!nome || !cognome || !email) {
    return res.status(400).json({ message: "Campi obbligatori mancanti" });
  }

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
