import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ isDashboard = false, data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveLine
      data={
        Array.isArray(data)
          ? data.filter((serie) => serie && Array.isArray(serie.data))
          : []
      }
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
        tooltip: {
          container: {
            color: "#000000",
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Mese",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Importo (€)",
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
      useMesh
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemsSpacing: 0,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
