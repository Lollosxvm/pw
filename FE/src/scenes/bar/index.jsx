import { Box } from "@mui/material";
import { Header, BarChartWithFilter } from "../../components";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Spese mensili per categoria" />
      <Box height="75vh">
        <BarChartWithFilter />
      </Box>
    </Box>
  );
};

export default Bar;
