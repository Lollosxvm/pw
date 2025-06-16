import { Box, Typography, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { it } from "date-fns/locale";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LineChart from "../../components/LineChart";
import { TextField } from "@mui/material";

const LineChartWithFilter = ({ isDashboard = false }) => {
  const [data, setData] = useState([]);
  const [filtro, setFiltro] = useState("3mesi");
  const [da, setDa] = useState(null);
  const [a, setA] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const oggi = new Date();
    let fromDate = null;

    switch (filtro) {
      case "30giorni":
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        break;
      case "3mesi":
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 3);
        break;
      case "6mesi":
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 6);
        break;
      case "12mesi":
        fromDate = new Date();
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

    axiosPrivate
      .get("/transactions/andamento", {
        params: { from, to },
      })
      .then((res) => {
        const formatted = {
          Saldo: [],
          Entrate: [],
          Uscite: [],
        };

        res.data.forEach((row) => {
          formatted.Saldo.push({ x: row.mese, y: parseFloat(row.saldo) });
          formatted.Entrate.push({ x: row.mese, y: parseFloat(row.entrate) });
          formatted.Uscite.push({
            x: row.mese,
            y: Math.abs(parseFloat(row.uscite)),
          });
        });

        setData([
          {
            id: "Saldo",
            data: formatted.Saldo,
            color: "#43f5b0",
          },
          {
            id: "Entrate",
            data: formatted.Entrate,
            color: "#437ff5",
          },
          {
            id: "Uscite",
            data: formatted.Uscite,
            color: "#f56f43",
          },
        ]);
      })
      .catch((err) => console.error("Errore API andamento:", err));
  }, [filtro, da, a]);

  return (
    <Box height="100%" p={isDashboard ? "0 30px" : 2}>
      {!isDashboard && (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6">Filtro:</Typography>
          <Select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <MenuItem value="30giorni">Ultimi 30 giorni</MenuItem>
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
              <DatePicker
                label="Da"
                value={da}
                onChange={(newValue) => setDa(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="A"
                value={a}
                onChange={(newValue) => setA(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          )}
        </Box>
      )}

      <LineChart isDashboard={isDashboard} data={data} />
    </Box>
  );
};

export default LineChartWithFilter;
