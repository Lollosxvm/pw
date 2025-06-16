import { db } from "../config/db.js";
import axios from "axios";

export const aggiungiInvestimento = async (req, res) => {
  const { asset, operazione, quantita, prezzo_unitario } = req.body;
  const utente = req.utente.id;

  try {
    await db.query(
      `INSERT INTO investimenti (utente, asset, operazione, quantita, prezzo_unitario)
       VALUES (?, ?, ?, ?, ?)`,
      [utente, asset, operazione, quantita, prezzo_unitario]
    );

    res.status(201).json({ message: "Operazione registrata con successo" });
  } catch (err) {
    console.error("Errore inserimento investimento:", err);
    res.status(500).json({ message: "Errore lato server" });
  }
};

export const getInvestimentiUtente = async (req, res) => {
  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM investimenti WHERE utente = ? ORDER BY data_operazione DESC`,
      [utente]
    );
    res.json(rows);
  } catch (err) {
    console.error("Errore recupero investimenti:", err);
    res.status(500).json({ message: "Errore lato server" });
  }
};

export const getCryptoChart = async (req, res) => {
  const { asset = "bitcoin", days = "90", vs_currency = "usd" } = req.query;
  const endpoint = `https://api.coingecko.com/api/v3/coins/${asset}/market_chart`;

  try {
    const response = await axios.get(endpoint, {
      params: { vs_currency, days },
    });

    const prices = response.data?.prices;

    if (!Array.isArray(prices)) {
      console.warn("Risposta CoinGecko anomala:", response.data);
      return res.status(502).json({ error: "Dati non validi da CoinGecko" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Errore CoinGecko:", error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Troppe richieste a CoinGecko. Riprova tra qualche secondo.",
      });
    }

    return res.status(500).json({ error: "Errore interno dal backend" });
  }
};
