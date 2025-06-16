import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import LineChart from "../../components/LineChart";

const assetMap = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
};

const currencyMap = {
  usd: "USD",
  eur: "EUR",
};

const periodMap = {
  1: "24H",
  7: "7G",
  30: "1M",
};

const AssetChart = ({ asset, onAssetChange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7");
  const [currency, setCurrency] = useState("usd");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const assetColors = {
    bitcoin: colors.redAccent[400],
    ethereum: colors.blueAccent[400],
    solana: colors.greenAccent[400],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/investimenti/crypto?asset=${asset}&days=${period}&vs_currency=${currency}`
        );
        const json = await res.json();

        if (res.status === 429) {
          setErrorMessage(
            "Hai effettuato troppe richieste. Attendi qualche secondo e riprova."
          );
          setSnackbarOpen(true);
          setChartData([]);
          return;
        }

        if (!json.prices) {
          setErrorMessage("Dati non disponibili per questo asset.");
          setSnackbarOpen(true);
          setChartData([]);
          return;
        }

        const data = json.prices.map(([timestamp, price]) => ({
          x: new Date(timestamp).toLocaleDateString("it-IT"),
          y: price,
        }));

        setChartData([
          {
            id: assetMap[asset],
            data,
            color: assetColors[asset] || "#888888",
          },
        ]);
        setErrorMessage("");
      } catch (err) {
        console.error("Errore nel fetch dal backend:", err);
        setErrorMessage("Errore nel caricamento dei dati. Riprova più tardi.");
        setSnackbarOpen(true);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [asset, period, currency, theme.palette.mode]);

  return (
    <Box>
      {/* Header con selettori */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color={colors.greenAccent[500]}>
          Andamento {assetMap[asset]} ({currency.toUpperCase()}) - Ultimi{" "}
          {periodMap[period]}
        </Typography>

        <Box display="flex" gap={2}>
          <Select
            value={asset}
            onChange={(e) => onAssetChange(e.target.value)}
            size="small"
          >
            {Object.entries(assetMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>

          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(e, newPeriod) => newPeriod && setPeriod(newPeriod)}
            size="small"
          >
            {Object.entries(periodMap).map(([value, label]) => (
              <ToggleButton key={value} value={value}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            size="small"
          >
            {Object.entries(currencyMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Chart area */}
      <Box height="300px">
        {loading ? (
          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress style={{ color: colors.greenAccent[500] }} />
          </Box>
        ) : chartData.length === 0 ? (
          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body2" color="textSecondary">
              Nessun dato disponibile per il periodo selezionato.
            </Typography>
          </Box>
        ) : (
          <LineChart isDashboard={true} data={chartData} />
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssetChart;
