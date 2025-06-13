import { Box, Typography, Grid, Button } from "@mui/material";
import { useState } from "react";
//import AssetChart from "./AssetChart";
import InvestmentsModal from "./InvestmentsModal";
// import AiSuggestionBox from "./AiSuggestionBox";
// import NewsFeed from "./NewsFeed";

const InvestmentsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(0); // da API future
  const [haAsset, setHaAsset] = useState(true); // oppure in base a investimenti

  return (
    <Box m={2}>
      <Typography variant="h4" mb={2}>
        Investimenti
      </Typography>

      <Grid container spacing={2}>
        {/* Sezione sinistra - grafico + bottoni */}
        <Grid item xs={12} md={8}>
          {/* <AssetChart asset={selectedAsset} onAssetChange={setSelectedAsset} /> */}
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setBuyOpen(true)}
            >
              Acquista {selectedAsset}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setSellOpen(true)}
            >
              Vendi {selectedAsset}
            </Button>
          </Box>
        </Grid>

        {/* Sezione destra - AI + notizie */}
        <Grid item xs={12} md={4}>
          {/* <AiSuggestionBox asset={selectedAsset} /> */}
          <Box mt={2}>{/* {<NewsFeed asset={selectedAsset} />} */}</Box>
        </Grid>
      </Grid>

      <InvestmentsModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        asset={selectedAsset}
        type="acquisto"
        onSuccess={() => setBuyOpen(false)}
      />
      <InvestmentsModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
        asset={selectedAsset}
        type="vendita"
        defaultPrice={currentPrice}
        disabled={!haAsset} // lo definisci a seconda della logica futura
        onSuccess={() => setSellOpen(false)}
      />
    </Box>
  );
};

export default InvestmentsPage;
