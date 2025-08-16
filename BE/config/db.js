import mysql from "mysql2/promise";
import dotenv from "dotenv";
import dns from "dns/promises";

dotenv.config();

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 15000,
});
(async () => {
  try {
    const { address } = await dns.lookup(host);
    console.log("[DB cfg]", host, port, "->", address, database, user);
    const conn = await db.getConnection();
    const [r] = await conn.query("SELECT 1");
    conn.release();
    console.log("[DB] pronto", Array.isArray(r) ? "ok" : "ko");
  } catch (e) {
    console.error("[DB] errore iniziale", e.code || e.message);
  }
})();
