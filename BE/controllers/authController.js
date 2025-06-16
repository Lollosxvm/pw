import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM utenti WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email non registrata" });
    }

    const utente = rows[0];

    const match = await bcrypt.compare(password.trim(), utente.password);

    if (!match) {
      return res.status(401).json({ message: "Password errata" });
    }

    const token = jwt.sign({ id: utente.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
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
    console.error("Errore login:", err);
    res.status(500).json({ message: "Errore server" });
  }
};
