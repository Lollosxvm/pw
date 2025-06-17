import { db } from "../config/db.js";

export const aggiornaRateMutuo = async () => {
  try {
    const now = new Date();
    const meseProssimo = new Date(now.setMonth(now.getMonth() + 1))
      .toISOString()
      .slice(0, 7);

    let aggiornamenti = {
      date: 0,
      pagate: 0,
      inScadenza: 0,
    };

    // 1. Aggiungi data_pagamento se mancante
    const [updateDate] = await db.query(`
      UPDATE rate_mutuo
      SET data_pagamento = CURDATE()
      WHERE stato_pagamento = 'pagata'
        AND data_pagamento IS NULL
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
    `);
    aggiornamenti.date = updateDate.affectedRows;

    // 2. Paga le rate scadute
    const [updatePagate] = await db.query(`
      UPDATE rate_mutuo
      SET stato_pagamento = 'pagata', data_pagamento = CURDATE()
      WHERE stato_pagamento IN ('da_pagare', 'in_scadenza')
        AND data_scadenza <= CURDATE()
    `);
    aggiornamenti.pagate = updatePagate.affectedRows;

    // 3. Imposta in scadenza la rata del mese prossimo
    const [updateScadenza] = await db.query(
      `
      UPDATE rate_mutuo
      SET stato_pagamento = 'in_scadenza'
      WHERE stato_pagamento = 'da_pagare'
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = ?
    `,
      [meseProssimo]
    );
    aggiornamenti.inScadenza = updateScadenza.affectedRows;

    // LOG finale riassuntivo
    const azioni = [];
    if (aggiornamenti.date > 0)
      azioni.push(`${aggiornamenti.date} data_pagamento`);
    if (aggiornamenti.pagate > 0)
      azioni.push(`${aggiornamenti.pagate} rata pagata`);
    if (aggiornamenti.inScadenza > 0)
      azioni.push(`${aggiornamenti.inScadenza} in scadenza`);

    if (azioni.length > 0) {
      console.log(`[Mutuo] Aggiornate: ${azioni.join(" | ")}`);
    } else {
      console.log("[Mutuo] Nessun aggiornamento eseguito, tutto ok!");
    }
  } catch (err) {
    console.error("[Mutuo] Errore aggiornamento automatico:", err);
  }
};
