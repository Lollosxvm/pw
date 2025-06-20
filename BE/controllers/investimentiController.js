import { db } from "../config/db.js";
import axios from "axios";

export const aggiungiInvestimento = async (req, res) => {
  const { asset, operazione, quantita, prezzo_unitario } = req.body;
  const utente = req.utente.id;

  const conn = await db.getConnection(); // se usi pool di mysql2

  try {
    await conn.beginTransaction();

    // 1. Inserimento in investimenti
    await conn.query(
      `INSERT INTO investimenti (utente, asset, operazione, quantita, prezzo_unitario)
       VALUES (?, ?, ?, ?, ?)`,
      [utente, asset, operazione, quantita, prezzo_unitario]
    );

    // 2. Calcolo importo totale
    const importo = quantita * prezzo_unitario;
    const tipo = operazione === "acquisto" ? "Uscita" : "Entrata";

    // 3. Inserimento in transazioni
    await conn.query(
      `INSERT INTO transazioni (utente, tipo, importo, categoria, data, indirizzo, metodo, stato, paese)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, 'Completato', ?)`,
      [
        utente,
        tipo,
        importo,
        "Investimenti",
        "Operazione asset",
        "Criptovaluta",
        "INT",
      ]
    );

    // 4. Calcolo nuovo saldo SOLO da transazioni
    const [[{ saldoTransazioni }]] = await conn.query(
      `
      SELECT 
        SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE -importo END) AS saldoTransazioni
      FROM transazioni 
      WHERE stato = 'Completato' AND utente = ?
    `,
      [utente]
    );

    const saldo = Number(saldoTransazioni) || 0;

    await conn.commit();

    res.status(201).json({
      message: "Operazione registrata con successo",
      saldoAggiornato: saldo,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Errore inserimento investimento:", err);
    res.status(500).json({ message: "Errore lato server" });
  } finally {
    conn.release();
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

export const getAndamentoInvestimenti = async (req, res) => {
  try {
    const utenteId = req.utente.id;

    const [attuale] = await db.query(
      `
      SELECT SUM(quantita * prezzo_unitario) AS totale
      FROM investimenti
      WHERE utente = ? 
        AND MONTH(data_operazione) = MONTH(CURDATE())
        AND YEAR(data_operazione) = YEAR(CURDATE())
    `,
      [utenteId]
    );

    const [precedente] = await db.query(
      `
      SELECT SUM(quantita * prezzo_unitario) AS totale
      FROM investimenti
      WHERE utente = ? 
        AND MONTH(data_operazione) = MONTH(CURDATE() - INTERVAL 1 MONTH)
        AND YEAR(data_operazione) = YEAR(CURDATE() - INTERVAL 1 MONTH)
    `,
      [utenteId]
    );

    const valoreAttuale = Number(attuale[0].totale) || 0;
    const valorePrecedente = Number(precedente[0].totale) || 0;

    const variazione =
      valorePrecedente === 0
        ? null
        : (
            ((valoreAttuale - valorePrecedente) / valorePrecedente) *
            100
          ).toFixed(2);

    res.json({
      valoreAttuale,
      valorePrecedente,
      variazione,
    });
  } catch (error) {
    console.error("Errore nel calcolo andamento investimenti:", error);
    res
      .status(500)
      .json({ messaggio: "Errore nel calcolo andamento investimenti." });
  }
};

export const getComposizioneInvestimenti = async (req, res) => {
  try {
    const utente = req.utente.id;

    const [[result]] = await db.query(
      `
      SELECT
        SUM(CASE WHEN asset = 'bitcoin' THEN quantita * prezzo_unitario ELSE 0 END) AS btc,
        SUM(CASE WHEN asset IN ('ethereum', 'solana') THEN quantita * prezzo_unitario ELSE 0 END) AS altri
      FROM investimenti
      WHERE utente = ?
    `,
      [utente]
    );

    const btc = Number(result.btc) || 0;
    const altri = Number(result.altri) || 0;
    const totale = btc + altri;

    if (totale === 0) {
      return res.json({
        x: 0,
        y: 0,
        labelX: "Bitcoin",
        labelY: "Altri asset",
      });
    }

    res.json({
      x: ((btc / totale) * 100).toFixed(0),
      y: ((altri / totale) * 100).toFixed(0),
      labelX: "Bitcoin",
      labelY: "Altri asset",
    });
  } catch (error) {
    console.error("Errore composizione investimenti:", error);
    res.status(500).json({ message: "Errore lato server" });
  }
};
