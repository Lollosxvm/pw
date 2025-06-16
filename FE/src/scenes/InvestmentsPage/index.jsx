import { Box, Typography, Grid, Button } from "@mui/material";
import { useState, useEffect } from "react";
import AssetChart from "./AssetChart";
import InvestmentsModal from "./InvestmentsModal";
import NewsFeed from "./NewsFeed";
import InvestmentsTable from "./InvestmentTable";
const InvestmentsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [haAsset, setHaAsset] = useState(false);
  const [assetDisponibili, setAssetDisponibili] = useState({});

  // Carica investimenti utente una sola volta
  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/investimenti/1"); // TODO: sostituire ID con utente loggato
        const data = await res.json();

        const mappa = {};

        data.forEach((item) => {
          const assetKey = item.asset.toLowerCase();
          const quantita = parseFloat(item.quantita);

          if (item.operazione === "acquisto") {
            mappa[assetKey] = (mappa[assetKey] || 0) + quantita;
          } else if (item.operazione === "vendita") {
            mappa[assetKey] = (mappa[assetKey] || 0) - quantita;
          }
        });

        setAssetDisponibili(mappa);
      } catch (err) {
        console.error("Errore nel caricamento degli investimenti:", err);
        setAssetDisponibili({});
      }
    };

    fetchUserAssets();
  }, []);

  // Aggiorna lo stato haAsset ogni volta che cambia asset selezionato o disponibilità
  useEffect(() => {
    const quantitaPosseduta = assetDisponibili[selectedAsset] || 0;
    setHaAsset(quantitaPosseduta > 0);
  }, [selectedAsset, assetDisponibili]);

  return (
    <Box m={2}>
      <Typography variant="h4" mb={2}>
        Investimenti
      </Typography>

      {/* GRAFICO in alto */}
      <Box mb={4}>
        <AssetChart asset={selectedAsset} onAssetChange={setSelectedAsset} />
        <Box mt={3} display="flex" gap={2}>
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
            disabled={!haAsset}
          >
            Vendi {selectedAsset}
          </Button>
        </Box>
      </Box>

      {/* SEZIONE BASSA: Tabella + Notizie */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InvestmentsTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <NewsFeed asset={selectedAsset} />
        </Grid>
      </Grid>

      {/* Modali */}
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
        disabled={!haAsset}
        onSuccess={() => setSellOpen(false)}
      />
    </Box>
  );
};

export default InvestmentsPage;
