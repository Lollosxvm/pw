export const getSaldoAggiornato = async (req, res) => {
  try {
    const utenteId = req.user.id;

    const [[{ saldoTransazioni }]] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN tipo = 'Entrata' THEN importo ELSE -importo END) AS saldoTransazioni
      FROM transazioni
      WHERE stato = 'Completato' AND utente = ?
    `,
      [utenteId]
    );

    const [[{ saldoInvestimenti }]] = await db.query(
      `
      SELECT 
        SUM(CASE 
          WHEN operazione = 'acquisto' THEN -quantita * prezzo_unitario
          WHEN operazione = 'vendita' THEN  quantita * prezzo_unitario
          ELSE 0
        END) AS saldoInvestimenti
      FROM investimenti
      WHERE utente = ?
    `,
      [utenteId]
    );

    const saldo = parseFloat(
      ((saldoTransazioni || 0) + (saldoInvestimenti || 0)).toFixed(2)
    );

    res.json({ saldo });
  } catch (err) {
    console.error("Errore saldo:", err);
    res.status(500).json({ message: "Errore durante il calcolo del saldo" });
  }
};
