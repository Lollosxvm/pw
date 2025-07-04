import { db } from "../config/db.js";
import axios from "axios";

export const aggiungiInvestimento = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  const { asset, operazione, quantita, prezzo_unitario } = req.body;
  const utente = req.utente.id;

  // 400 - campi obbligatori
  if (!asset || !operazione || !quantita || !prezzo_unitario) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO investimenti (utente, asset, operazione, quantita, prezzo_unitario)
       VALUES (?, ?, ?, ?, ?)`,
      [utente, asset, operazione, quantita, prezzo_unitario]
    );

    const importo = quantita * prezzo_unitario;
    const tipo = operazione === "acquisto" ? "Uscita" : "Entrata";

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

    const [[{ saldoTransazioni }]] = await conn.query(
      `SELECT SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE -importo END) AS saldoTransazioni
       FROM transazioni WHERE stato = 'Completato' AND utente = ?`,
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
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  const utente = req.utente.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM investimenti WHERE utente = ? ORDER BY data_operazione DESC`,
      [utente]
    );

    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessun investimento trovato per questo utente" });
    }

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
      console.warn("[CoinGecko] Risposta anomala:", response.data);
      return res
        .status(502)
        .json({ error: "Dati non validi ricevuti da CoinGecko." });
    }

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    switch (status) {
      case 400:
        console.warn("[CoinGecko] Errore 400 – richiesta malformata");
        return res.status(400).json({
          error:
            "Richiesta non valida. Verifica i parametri 'asset', 'days' o 'vs_currency'.",
        });

      case 403:
        console.warn("[CoinGecko] Errore 403 – accesso negato all'endpoint");
        return res.status(403).json({
          error:
            "Accesso negato da CoinGecko. Verifica se l'endpoint richiede autorizzazione.",
        });

      case 404:
        console.warn(`[CoinGecko] Errore 404 – asset '${asset}' non trovato`);
        return res.status(404).json({
          error: `Asset '${asset}' non trovato su CoinGecko.`,
        });

      case 429:
        console.warn("[CoinGecko] Errore 429 – troppe richieste");
        return res.status(429).json({
          error:
            "Hai superato il limite di richieste a CoinGecko. Riprova tra qualche istante.",
        });

      case 500:
        console.error("[CoinGecko] Errore 500 – problema interno CoinGecko");
        return res.status(502).json({
          error:
            "Errore interno da CoinGecko. Servizio momentaneamente non disponibile.",
        });

      default:
        console.error("[CoinGecko] Errore generico:", message);
        return res.status(500).json({
          error: `Errore imprevisto durante il recupero dei dati: ${message}`,
        });
    }
  }
};

export const getAndamentoInvestimenti = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  try {
    const utenteId = req.utente.id;

    const [attuale] = await db.query(
      `SELECT SUM(quantita * prezzo_unitario) AS totale FROM investimenti WHERE utente = ? AND MONTH(data_operazione) = MONTH(CURDATE()) AND YEAR(data_operazione) = YEAR(CURDATE())`,
      [utenteId]
    );

    const [precedente] = await db.query(
      `SELECT SUM(quantita * prezzo_unitario) AS totale FROM investimenti WHERE utente = ? AND MONTH(data_operazione) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(data_operazione) = YEAR(CURDATE() - INTERVAL 1 MONTH)`,
      [utenteId]
    );

    const valoreAttuale = Number(attuale[0].totale) || 0;
    const valorePrecedente = Number(precedente[0].totale) || 0;

    if (valoreAttuale === 0 && valorePrecedente === 0) {
      return res
        .status(404)
        .json({ message: "Nessun investimento per i periodi richiesti" });
    }

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
      .json({ message: "Errore nel calcolo andamento investimenti." });
  }
};

export const getComposizioneInvestimenti = async (req, res) => {
  if (!req.utente || !req.utente.id) {
    return res.status(401).json({ message: "Token non valido o mancante" });
  }

  try {
    const utente = req.utente.id;

    const [[result]] = await db.query(
      `SELECT
        SUM(CASE WHEN asset = 'bitcoin' THEN quantita * prezzo_unitario ELSE 0 END) AS btc,
        SUM(CASE WHEN asset IN ('ethereum', 'solana') THEN quantita * prezzo_unitario ELSE 0 END) AS altri
      FROM investimenti
      WHERE utente = ?`,
      [utente]
    );

    const btc = Number(result.btc) || 0;
    const altri = Number(result.altri) || 0;
    const totale = btc + altri;

    if (totale === 0) {
      return res
        .status(404)
        .json({ message: "Nessun investimento trovato per questo utente" });
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
