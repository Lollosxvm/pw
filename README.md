# 💼 Project Work — Dashboard Amministrativa

Questo repository contiene un'applicazione full-stack suddivisa in due moduli distinti:

- **`FE/` (Frontend)** – Interfaccia utente per la visualizzazione e gestione dei dati.
- **`BE/` (Backend)** – API server per la gestione e persistenza dei dati (in fase di sviluppo).

---

## 📁 Struttura del progetto

```
PW/
│
├── FE/            # Frontend React + MUI
│   ├── public/
│   ├── src/
│   │   ├── components/   # Componenti riutilizzabili (Header, Sidebar, ecc.)
│   │   ├── pages/        # Schermate principali (Movimenti, Contatti, ecc.)
│   │   ├── data/         # Dati fittizi (mock) per sviluppo
│   │   └── theme.js      # Tema personalizzato (light/dark)
│   └── package.json
│
├── BE/            # Backend Node.js / Express (in costruzione)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
│
└── README.md
```

---

## 🧠 Obiettivo del progetto

Creare una **dashboard amministrativa moderna**, responsive e accessibile, con funzionalità tipiche di un gestionale:

- Visualizzazione movimenti/transazioni
- Filtri, ricerca e esportazione dati
- Modalità chiaro/scuro
- Struttura scalabile per una futura integrazione con API REST reali

---

## 🧪 Tecnologie e librerie utilizzate

### 🔷 Frontend (React)

- **React + Vite** – Setup veloce e ottimizzato per SPA moderne
- **MUI (Material UI)** – UI kit completo per componenti reattivi e accessibili
  - `@mui/material` – Componenti di base
  - `@mui/icons-material` – Icone moderne
  - `@mui/x-data-grid` – DataGrid con sorting, filtering, esportazione e paginazione
- **React Router DOM** – Navigazione client-side
- **Context API** – Gestione globale del tema (light/dark)
- **CSS-in-JS (sx/styled)** – Stile flessibile e dinamico

🟩 Il tema (palette, colori, font) è definito in `theme.js`, adattivo a light/dark mode e orientato all'accessibilità.

### 🔷 Backend (Node.js / Express)

> In fase di sviluppo – predisposto per collegare il frontend a un’API REST con CRUD, autenticazione e validazione.

---

## 📈 Funzionalità implementate

- Sidebar dinamica con routing e icone
- Header contestuale per ogni pagina
- Pagine: **Movimenti**, **Contatti**, ecc.
- Tabella interattiva con:
  - Filtro per colonna
  - Esportazione CSV
  - Ricerca rapida
  - Selezione multipla
- Tema chiaro/scuro con toggle integrato

---

## 🛠️ Setup locale

1. Clona il repository:

   ```bash
   git clone https://github.com/<tuo-username>/pw.git
   ```

2. Avvia il frontend:

   ```bash
   cd FE
   npm install
   npm run dev
   ```

3. (Facoltativo) Avvia il backend:

   ```bash
   cd ../BE
   npm install
   npm run dev
   ```

---

## 📌 Note finali

- Attualmente i dati sono mockati (`mockData.js`)
- La struttura è pronta per integrazione con database e autenticazione
- L'interfaccia è modulare e facilmente estendibile
