export function setupServerEvents(db) {
  db.on("connection", (conn) => {
    console.log("[DB] Nuova connessione aperta con ID:", conn.threadId);
  });

  process.on("SIGINT", async () => {
    console.log("\n[DB] Arresto del server... chiusura connessioni MySQL");

    try {
      await db.end();
      console.log("[DB] Connessioni MySQL chiuse correttamente.");
    } catch (err) {
      console.error("[DB] Errore durante la chiusura del pool:", err);
    }

    process.exit(0);
  });

  process.on("uncaughtException", (err) => {
    console.error("[DB] Errore non gestito:", err);
    process.exit(1);
  });
}
