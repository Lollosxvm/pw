# 📡 Backend – PW Bank 

Questo backend, sviluppato con Node.js e Express, gestisce l'autenticazione, la logica finanziaria, la persistenza dei dati e le integrazioni con servizi esterni come CoinGecko e CryptoPanic.

## 📂 Struttura del progetto

```
BE/
├── config/                  # Connessione al database MySQL
├── controllers/             # Logica delle API
├── routes/                  # Definizione endpoint REST
├── utils/                   # Funzioni di utilità (aggiornamento rate, eventi DB)
├── server.js                # Entrypoint del server Express
└── package.json             # Dipendenze e script
```

## ⚙️ Dipendenze principali

- **express** – Framework per API REST
- **mysql2** – Driver per connessione al database
- **dotenv** – Gestione delle variabili ambiente
- **jsonwebtoken** – Autenticazione sicura via JWT
- **bcrypt** – Hashing sicuro delle password
- **axios** – Richieste HTTP verso API esterne
- **cors**, **helmet** – Sicurezza HTTP

## 🔐 Autenticazione

- Login sicuro con password hashata (`bcrypt`) e token JWT
- Middleware `verifyToken` per proteggere le rotte private
- I token scadono automaticamente dopo 8 ore

## 🔄 Aggiornamento automatico delle rate

All'avvio del server vengono eseguite:

- `aggiornaRateMutuo()` – aggiorna le rate mutuo in base alla data
- `aggiornaRatePrestiti()` – aggiorna le rate prestito allo stesso modo

Il log delle operazioni viene stampato in console per ogni boot.

## 🌐 API principali

| Endpoint                        | Descrizione                              |
|---------------------------------|------------------------------------------|
| `POST /api/login`               | Login utente (email + password)          |
| `GET /api/transazioni`         | Recupera movimenti utente                |
| `GET /api/mutuo`               | Restituisce rate mutuo                   |
| `GET /api/prestiti`            | Restituisce rate prestito                |
| `GET /api/investimenti`        | Lista investimenti                       |
| `GET /api/investimenti/andamento` | Storico valore asset via CoinGecko   |
| `GET /api/news`               | Notizie finanziarie da CryptoPanic       |
| `GET /api/situazione-economica`| Cruscotto completo (mutui, prestiti, asset) |

## 🧪 Ambiente di sviluppo

Creato un file `.env` nella root con:

```
PORT=3001
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...
JWT_SECRET=...
CRYPTOPANIC_API_KEY=...
```

## 🚀 Avvio del server

Per avviare il backend sono disponibili due opzioni:

### ▶️ 1. Avvio automatico da VS Code

Se usi **Visual Studio Code**, puoi semplicemente cliccare su:

```text
🎡 Run BE
```

oppure aprire la paletta comandi (Ctrl+Shift+P) e selezionare **"Tasks: Run Task"**, quindi scegliere `🎡 Run BE` dall’elenco.

### 🖥️ 2. Avvio manuale da terminale

```bash
npm install
npm run dev
```

Il server sarà disponibile su `http://localhost:3001`.

---

*Autore: Lorenzo Sijinardi – Corso di Laurea L-31 – Pegaso*
