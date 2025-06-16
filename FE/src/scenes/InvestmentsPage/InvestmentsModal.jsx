import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAsset } from "../../context/AssetContext";
import useAuth from "../../hooks/useAuth";

const InvestmentsModal = ({
  open,
  onClose,
  asset,
  type,
  defaultPrice,
  disabled,
  onSuccess,
}) => {
  const [importo, setImporto] = useState("");
  const [loading, setLoading] = useState(false);
  const [esito, setEsito] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { currentPrice } = useAsset();
  const [prezzo, setPrezzo] = useState("");
  const [prezzoRaw, setPrezzoRaw] = useState(null);
  const quantitaCalcolata =
    importo && prezzoRaw ? (parseFloat(importo) / prezzoRaw).toFixed(8) : "";
  const { auth } = useAuth();

  useEffect(() => {
    if (open && currentPrice) {
      const prezzoFormattato = new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(currentPrice);

      setPrezzo(prezzoFormattato); // visivo
      setPrezzoRaw(currentPrice); // numerico reale
    }
  }, [open, currentPrice]);

  const handleSubmit = async () => {
    setLoading(true);
    setEsito(null);
    try {
      const quantitaCalcolata = parseFloat(importo) / prezzoRaw;

      await axiosPrivate.post("/investimenti", {
        asset,
        operazione: type,
        quantita: quantitaCalcolata,
        prezzo_unitario: prezzoRaw,
      });

      setEsito({
        tipo: "success",
        messaggio: `Operazione di ${type} registrata`,
      });

      setImporto("");
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    } catch (err) {
      setEsito({ tipo: "error", messaggio: "Errore durante l'invio" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setImporto("");
      setEsito(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          height: "55%",
          maxWidth: "30%",
          borderRadius: 3,
          px: 2,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", mb: 3 }}>
        {type === "acquisto" ? `Acquista ${asset}` : `Vendi ${asset}`}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          px: 4,
          py: 3,
        }}
      >
        {/* Prezzo unitario */}
        <TextField
          label="Prezzo unitario"
          type="text"
          value={prezzo}
          fullWidth
          InputProps={{ readOnly: true }}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
        />

        {/* Quantità calcolata */}
        <TextField
          label="Quantità"
          type="text"
          fullWidth
          value={quantitaCalcolata}
          InputProps={{ readOnly: true }}
        />

        {/* Importo in euro */}
        <TextField
          label="Totale in euro"
          type="number"
          value={importo}
          inputProps={{ min: 0, step: 1 }}
          fullWidth
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (val >= 0 || e.target.value === "") setImporto(e.target.value);
          }}
        />

        {/* Messaggio esito */}
        {esito && <Alert severity={esito.tipo}>{esito.messaggio}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            disabled ||
            !importo ||
            parseFloat(importo) === 0 ||
            !prezzoRaw
          }
        >
          {loading ? <CircularProgress size={24} /> : "Conferma"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestmentsModal;
