import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import axios from "axios";
import { useEffect, useState } from "react";

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/transactions/andamento")
      .then((res) => {
        const raw = res.data;

        // Costruzione serie
        const serieSaldo = {
          id: "Saldo",
          color: tokens("dark").greenAccent[500],
          data: raw.map((r) => ({ x: r.mese, y: parseFloat(r.saldo) })),
        };

        const serieEntrate = {
          id: "Entrate",
          color: tokens("dark").blueAccent[300],
          data: raw.map((r) => ({ x: r.mese, y: parseFloat(r.entrate) })),
        };

        const serieUscite = {
          id: "Uscite",
          color: tokens("dark").redAccent[200],
          data: raw.map((r) => ({ x: r.mese, y: parseFloat(r.uscite) })),
        };

        setData([serieSaldo, serieEntrate, serieUscite]);
      })
      .catch((err) => console.error("Errore andamento:", err));
  }, []);

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.gray[100] } },
          legend: { text: { fill: colors.gray[100] } },
          ticks: {
            line: { stroke: colors.gray[100], strokeWidth: 1 },
            text: { fill: colors.gray[100] },
          },
        },
        legends: { text: { fill: colors.gray[100] } },
        tooltip: { container: { color: colors.primary[500] } },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: true }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        legend: isDashboard ? undefined : "Mese",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        legend: isDashboard ? undefined : "€",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default LineChart;
