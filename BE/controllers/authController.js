import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Controllo campi obbligatori (400 Bad Request)
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email e password sono obbligatorie" });
  }

  try {
    // 2. Query utente
    const [rows] = await db.query("SELECT * FROM utenti WHERE email = ?", [
      email,
    ]);

    // 3. Utenza non riconosciuta: email e/o password errate (401 Unauthorized)
    if (rows.length === 0) {
      return res.status(401).json({
        message: "Utenza non riconosciuta: email e/o password errate",
      });
    }

    const utente = rows[0];

    // 4. Password errata (401 Unauthorized)
    const match = await bcrypt.compare(password.trim(), utente.password);
    if (!match) {
      return res.status(401).json({ message: "Password errata" });
    }

    // 5. Successo (200 OK)
    const token = jwt.sign({ id: utente.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      utente: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
      },
    });
  } catch (err) {
    const dbDown = [
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENETUNREACH",
      "EHOSTUNREACH",
      "PROTOCOL_CONNECTION_LOST",
    ].includes(err.code);
    if (dbDown) {
      return res
        .status(503)
        .json({ message: "Database non raggiungibile", code: "DB_DOWN" });
    }
    console.error("Errore login:", err);
    res.status(500).json({ message: "Errore server" });
  }
};
