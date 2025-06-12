import { Box } from "@mui/material";
import { Header, LineChart } from "../../components";
import LineChartWithFilter from "../../scenes/LineChartWithFilter";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="entrate vs uscite" />
      <Box height="75vh">
        <LineChartWithFilter />
      </Box>
    </Box>
  );
};

export default Line;
