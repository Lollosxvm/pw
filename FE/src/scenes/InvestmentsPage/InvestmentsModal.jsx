import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aggiornaSaldo } from "../../redux/slices/authSlice";
import axiosPrivate from "../../api/axiosPrivate";
import { tokens } from "../../theme";

const InvestmentsModal = ({
  open,
  onClose,
  asset,
  type,
  defaultPrice,
  disabled,
  onSuccess,
  quantitaPosseduta = 0,
}) => {
  const [importo, setImporto] = useState("");
  const [loading, setLoading] = useState(false);
  const [esito, setEsito] = useState(null);
  const [prezzo, setPrezzo] = useState("");
  const [prezzoRaw, setPrezzoRaw] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const saldo = useSelector((state) => state.auth.saldo);
  const saldoDisponibile = saldo != null ? Math.floor(saldo * 100) / 100 : null;
  const currentPrice = useSelector((state) => state.asset.currentPrice);

  const quantitaCalcolata =
    importo && prezzoRaw ? (parseFloat(importo) / prezzoRaw).toFixed(8) : "";

  useEffect(() => {
    if (open && currentPrice) {
      const prezzoFormattato = new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(currentPrice);

      setPrezzo(prezzoFormattato);
      setPrezzoRaw(currentPrice);
    }
  }, [open, currentPrice]);

  useEffect(() => {
    if (open) {
      setImporto("");
      setEsito(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    setEsito(null);

    try {
      const quantita = parseFloat(importo) / prezzoRaw;

      const res = await axiosPrivate.post("/investimenti", {
        asset,
        operazione: type,
        quantita,
        prezzo_unitario: prezzoRaw,
      });

      dispatch(aggiornaSaldo(res.data.saldoAggiornato));

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
      setEsito({
        tipo: "error",
        messaggio: "Errore durante l'invio",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: "40%",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        {type === "acquisto" ? `Acquista ${asset}` : `Vendi ${asset}`}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          px: 4,
          py: 3,
          paddingTop: "5px !important",
        }}
      >
        <TextField
          label="Prezzo unitario"
          type="tel"
          value={prezzo}
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
              "& input": {
                cursor: "not-allowed",
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
          helperText="Valore di mercato attuale"
        />

        <TextField
          label="Quantità"
          type="tel"
          value={quantitaCalcolata}
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: colors.primary[400],
              color: colors.gray[100],
              "& input": {
                cursor: "not-allowed",
              },
            },
          }}
          helperText="Calcolato automaticamente"
        />

        <TextField
          label="Totale in euro"
          type="number"
          value={importo}
          error={
            (type === "acquisto" && parseFloat(importo) > saldoDisponibile) ||
            (type === "vendita" &&
              parseFloat(quantitaCalcolata) > quantitaPosseduta)
          }
          inputProps={{
            min: 0,
            step: 1,
            max:
              type === "acquisto" ? saldoDisponibile ?? undefined : undefined,
          }}
          onChange={(e) => {
            const valore = e.target.value;
            const val = parseFloat(valore);
            if (valore === "" || (!isNaN(val) && val >= 0)) {
              setImporto(valore);
            }
          }}
          helperText={
            type === "acquisto" && parseFloat(importo) > saldoDisponibile
              ? `Importo massimo disponibile: €${saldoDisponibile?.toFixed(2)}`
              : type === "vendita" &&
                parseFloat(quantitaCalcolata) > quantitaPosseduta
              ? `Quantità posseduta: ${quantitaPosseduta.toFixed(8)}`
              : "Inserisci l'importo desiderato"
          }
        />

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
            !prezzoRaw ||
            (type === "acquisto" && parseFloat(importo) > saldoDisponibile) ||
            (type === "vendita" &&
              parseFloat(quantitaCalcolata) > quantitaPosseduta)
          }
        >
          {loading ? <CircularProgress size={24} /> : "Conferma"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestmentsModal;
