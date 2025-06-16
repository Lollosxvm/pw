import { Box, Typography, Paper } from "@mui/material";

const AiSuggestionBox = ({ asset }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Suggerimento AI
      </Typography>
      <Typography variant="body2">
        In base all’analisi recente del mercato e delle notizie su{" "}
        <strong>{asset.toUpperCase()}</strong>, il nostro algoritmo suggerisce
        di <strong>acquistare</strong> nei prossimi giorni a causa del momentum
        positivo.
      </Typography>
    </Paper>
  );
};

export default AiSuggestionBox;
