import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

const InvestmentsModal = ({
  open,
  onClose,
  asset,
  type,
  defaultPrice,
  disabled,
  onSuccess,
}) => {
  const [quantita, setQuantita] = useState("");
  const [prezzo, setPrezzo] = useState(defaultPrice || "");
  const [loading, setLoading] = useState(false);
  const [esito, setEsito] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setEsito(null);
    try {
      await axios.post("http://localhost:3000/api/investimenti", {
        utente_id: 1,
        asset,
        operazione: type,
        quantita: parseFloat(quantita),
        prezzo_unitario: parseFloat(prezzo),
      });
      setEsito({
        tipo: "success",
        messaggio: `Operazione di ${type} registrata`,
      });
      setQuantita("");
      setPrezzo(defaultPrice || "");
      if (onSuccess) onSuccess();
    } catch (err) {
      setEsito({ tipo: "error", messaggio: "Errore durante l'invio" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {type === "acquisto" ? `Acquista ${asset}` : `Vendi ${asset}`}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Quantità"
          type="number"
          value={quantita}
          onChange={(e) => setQuantita(e.target.value)}
          fullWidth
        />
        <TextField
          label="Prezzo unitario"
          type="number"
          value={prezzo}
          onChange={(e) => setPrezzo(e.target.value)}
          fullWidth
        />
        {esito && <Alert severity={esito.tipo}>{esito.messaggio}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || disabled || !quantita || !prezzo}
        >
          {loading ? <CircularProgress size={24} /> : "Conferma"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestmentsModal;
