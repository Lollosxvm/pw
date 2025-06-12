import { db } from "../config/db.js";

export const aggiornaRateMutuo = async () => {
  try {
    const today = new Date();
    const meseCorrente = today.toISOString().slice(0, 7);
    const meseProssimo = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .slice(0, 7);

    console.group(
      `[Mutuo] Avvio aggiornamento automatico ${new Date().toLocaleString()}`
    );

    //Controllo rate pagata senza data_pagamento
    const [righe] = await db.query(`
      SELECT * FROM rate_mutuo
      WHERE stato = 'pagata'
        AND data_pagamento IS NULL
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
    `);

    if (righe.length > 0) {
      console.log(
        `${righe.length} rata/e pagata/e senza data_pagamento trovata/e (${meseCorrente})`
      );
    } else {
      console.log(`Nessuna rata senza data_pagamento per ${meseCorrente}`);
    }

    const [checkMissingDate] = await db.query(`
      UPDATE rate_mutuo
      SET data_pagamento = CURDATE()
      WHERE stato = 'pagata'
        AND data_pagamento IS NULL
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
    `);
    console.log(
      checkMissingDate.affectedRows > 0
        ? `Aggiunta data_pagamento a ${checkMissingDate.affectedRows} rata/e (${meseCorrente})`
        : `Nessuna data_pagamento da aggiornare`
    );

    //Aggiorno rata del mese corrente a "pagata"
    const [pagataOra] = await db.query(
      `
      UPDATE rate_mutuo
      SET stato = 'pagata',
          data_pagamento = CURDATE()
      WHERE stato = 'da pagare'
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = ?
    `,
      [meseCorrente]
    );
    console.log(
      pagataOra.affectedRows > 0
        ? `Pagata rata ${meseCorrente} (aggiornate ${pagataOra.affectedRows})`
        : `Nessuna rata da pagare per ${meseCorrente}`
    );

    //Imposto "in scadenza" rata del mese prossimo
    const [inScadenza] = await db.query(
      `
      UPDATE rate_mutuo
      SET stato = 'in scadenza'
      WHERE stato = 'da pagare'
        AND DATE_FORMAT(data_scadenza, '%Y-%m') = ?
    `,
      [meseProssimo]
    );
    console.log(
      inScadenza.affectedRows > 0
        ? `Impostata in scadenza rata ${meseProssimo}`
        : `Nessuna rata impostata in scadenza per ${meseProssimo}`
    );

    console.groupEnd();
  } catch (err) {
    console.error("Errore aggiornamento automatico rate mutuo:", err);
  }
};
