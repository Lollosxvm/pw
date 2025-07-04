# 🖥️ Frontend – Fintech Dashboard

Il frontend è sviluppato con React e Material UI, e fornisce un’interfaccia interattiva e reattiva per la gestione personale finanziaria, inclusi grafici, tabelle e moduli robusti.

## 📂 Struttura del progetto

```
FE/
├── public/                   # Assets statici (image, favicon)
├── src/
│   ├── components/           # Componenti UI riutilizzabili
│   ├── scenes/               # Pagine principali (dashboard, investimenti, ecc.)
│   ├── redux/                # Slice Redux, store centralizzato
│   ├── theme/                # Setup tema scuro/chiaro
│   ├── utils/                # Funzioni helper (es. formattazione)
│   └── index.jsx             # Entrypoint React
└── package.json              # Dipendenze e script
```

## ⚙️ Dipendenze principali

- **react 18** – Single-page application
- **@mui/material**, **@mui/icons-material** – componenti e icone Material UI
- **@reduxjs/toolkit**, **react-redux**, **redux-persist** – gestione dello stato globale e persistenza token
- **react-router-dom** – navigazione nelle pagine
- **axios** – chiamate HTTP verso il backend
- **@nivo/line**, **@mui/x-data-grid** – grafici e tabelle interattive
- **formik**, **yup** – gestione e validazione dei form
- **react-tooltip**, **react-toastify** – notifiche, tooltip, feedback utente

## 🎨 Tema e layout

- Tema scuro/chiaro basato su Material UI, gestito centralmente
- Componente `Sidebar` responsive con toggle, punta al routing core
- Design focalizzato su **accessibilità**, **readability** e UX moderna

## 📡 Integrazione con il backend

- Le pagine usano Axios per chiamare il backend:
  - `/transazioni`, `/investimenti`, `/mutuo`, `/prestiti`, `/news`, `/utente`, `/situazione-economica`
- I token JWT vengono mantenuti tramite Redux Persist e aggiunti a tutte le richieste di autenticazione


## 🌐 Avvio del frontend

Per avviare il frontend sono disponibili due opzioni:

### 🚀 1. Avvio automatico da VS Code

Se usi **Visual Studio Code**, puoi semplicemente cliccare su:

```text
🚀 Run Dev FE
```

oppure aprire la paletta comandi (Ctrl+Shift+P) e selezionare **"Tasks: Run Task"**, quindi scegliere `🚀 Run Dev FE` dall’elenco.

### 🖥️ 2. Avvio manuale

```bash
cd FE
npm install
npm run dev
```

L’app sarà visibile su `http://localhost:5173`.

---

_Autore: Lorenzo Sijinardi – Corso di Laurea L-31 – Pegaso_
