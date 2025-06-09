/* eslint-disable react/prop-types */
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0.75, size = 40, x, y }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  const circle = (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );

  const showTooltip = x !== undefined && y !== undefined;

  const tooltipContent = (
    <Box>
      <Typography variant="caption">{x}%: parte primaria</Typography>
      <Typography variant="caption">{y}%: parte secondaria</Typography>
    </Box>
  );

  return showTooltip ? (
    <Tooltip title={tooltipContent} arrow>
      <Box>{circle}</Box>
    </Tooltip>
  ) : (
    circle
  );
};

export default ProgressCircle;
