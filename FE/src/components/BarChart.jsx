import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";
import axios from "axios";
import { subMonths, format } from "date-fns";

const BarChart = ({ isDashboard = false, data = null }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dati, setDati] = useState([]);

  useEffect(() => {
    if (data) {
      setDati(data);
      return;
    }

    // Fetch solo se non viene passato `data` da fuori (es. Dashboard)
    const today = new Date();
    const fromDate = subMonths(today, 1);
    const from = format(fromDate, "yyyy-MM-dd");
    const to = format(today, "yyyy-MM-dd");

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
        setDati(Object.values(aggregati));
      })
      .catch((err) => console.error("Errore nel caricamento:", err));
  }, [data]);

  return (
    <ResponsiveBar
      data={dati}
      keys={[
        "Affitto",
        "Alimentari",
        "Trasporti",
        "Svago",
        "Assicurazioni",
        "Utenze",
        "Mutuo",
      ]}
      indexBy="mese"
      theme={{
        tooltip: {
          container: {
            background: "#fff",
            color: colors.gray[900],
            fontSize: "13px",
          },
        },
        axis: {
          domain: {
            line: { stroke: colors.gray[100] },
          },
          legend: { text: { fill: colors.gray[100] } },
          ticks: {
            line: { stroke: colors.gray[100] },
            text: { fill: colors.gray[100] },
          },
        },
        legends: { text: { fill: colors.gray[100] } },
      }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        legend: isDashboard ? undefined : "Mese",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: isDashboard ? undefined : "Spese (€)",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{ on: "hover", style: { itemOpacity: 1 } }],
        },
      ]}
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
    />
  );
};

export default BarChart;
