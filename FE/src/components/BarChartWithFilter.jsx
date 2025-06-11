import { Box, Typography, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { it } from "date-fns/locale";
import { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";

const BarChartWithFilter = ({ isDashboard = false }) => {
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("3mesi");
  const [da, setDa] = useState(null);
  const [a, setA] = useState(null);

  useEffect(() => {
    const oggi = new Date();
    let fromDate;

    switch (filtro) {
      case "1mese":
        fromDate = new Date(oggi);
        fromDate.setMonth(fromDate.getMonth() - 1);
        break;
      case "3mesi":
        fromDate = new Date(oggi);
        fromDate.setMonth(fromDate.getMonth() - 3);
        break;
      case "6mesi":
        fromDate = new Date(oggi);
        fromDate.setMonth(fromDate.getMonth() - 6);
        break;
      case "12mesi":
        fromDate = new Date(oggi);
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        break;
      case "personalizzato":
        if (!da || !a) return;
        fromDate = da;
        oggi.setTime(a.getTime());
        break;
      default:
        return;
    }

    const from = fromDate.toISOString().split("T")[0];
    const to = oggi.toISOString().split("T")[0];

    axios
      .get("http://localhost:3000/api/transactions/spese-categorie", {
        params: { from, to },
      })
      .then((res) => {
        const aggregati = {};
        res.data.forEach(({ mese, categoria, totale }) => {
          if (!aggregati[mese]) aggregati[mese] = { mese };
          aggregati[mese][categoria] = parseFloat(totale);
        });

        const datiBar = Object.values(aggregati);
        setData(datiBar);
      })
      .catch((err) => console.error("Errore API:", err));
  }, [filtro, da, a]);

  return (
    <Box height="100%" p={isDashboard ? "0 30px" : 2}>
      {!isDashboard && (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6">Filtro:</Typography>
          <Select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <MenuItem value="1mese">Ultimi 30 giorni</MenuItem>
            <MenuItem value="3mesi">Ultimi 3 mesi</MenuItem>
            <MenuItem value="6mesi">Ultimi 6 mesi</MenuItem>
            <MenuItem value="12mesi">Ultimo anno</MenuItem>
            <MenuItem value="personalizzato">Personalizzato</MenuItem>
          </Select>

          {filtro === "personalizzato" && (
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={it}
            >
              <DatePicker label="Da" value={da} onChange={setDa} />
              <DatePicker label="A" value={a} onChange={setA} />
            </LocalizationProvider>
          )}
        </Box>
      )}

      <BarChart isDashboard={isDashboard} data={data} />
    </Box>
  );
};

export default BarChartWithFilter;
