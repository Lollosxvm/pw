import { db } from "../config/db.js";
import axios from "axios";

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
export const getCryptoChart = async (req, res) => {
  console.log("✅ Entrato in getCryptoChart"); // <-- IMPORTANTE
  const { asset = "bitcoin", days = "90", vs_currency = "usd" } = req.query;

  try {
    console.log("🔄 Chiamo CoinGecko con:", { asset, days, vs_currency });

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${asset}/market_chart`,
      {
        params: { vs_currency, days },
      }
    );

    console.log("✅ Risposta CoinGecko:", data?.prices?.length);
    res.json(data);
  } catch (error) {
    console.error("❌ Errore CoinGecko:", error.message);
    res.status(500).json({ error: "Errore interno dal backend" });
  }
};
