import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
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
  30: "1M",
  90: "3M",
  365: "1Y",
  max: "MAX",
};

const AssetChart = ({ asset, onAssetChange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("90");
  const [currency, setCurrency] = useState("usd");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const assetColors = {
    bitcoin: colors.redAccent[400],
    ethereum: colors.blueAccent[400],
    solana: colors.greenAccent[400],
  };

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/investimenti/crypto?asset=${asset}&days=${period}&vs_currency=${currency}`
        );

        const json = await res.json();

        if (!json.prices) {
          console.warn("⚠️ Nessun dato ricevuto:", json);
          setChartData([]);
          return;
        }

        const data = json.prices.map(([timestamp, price]) => ({
          x: new Date(timestamp).toISOString().split("T")[0],
          y: price,
        }));

        setChartData([
          {
            id: assetMap[asset],
            data,
            color: assetColors[asset] || "#888888",
          },
        ]);
      } catch (err) {
        console.error("Errore nel fetch dal backend:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    timeoutId = setTimeout(fetchData, 300);

    return () => clearTimeout(timeoutId);
  }, [asset, period, currency]);

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
          Andamento {assetMap[asset]} ({currency.toUpperCase()})
        </Typography>

        <Box display="flex" gap={2}>
          {/* Asset select */}
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

          {/* Period toggle */}
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

          {/* Currency select */}
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

      {/* Chart / Spinner */}
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
        ) : (
          <LineChart isDashboard={true} data={chartData} />
        )}
      </Box>
    </Box>
  );
};

export default AssetChart;
