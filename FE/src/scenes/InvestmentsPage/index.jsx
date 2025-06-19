import { Box, Typography, Grid, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import AssetChart from "./AssetChart";
import InvestmentsModal from "./InvestmentsModal";
import NewsFeed from "./NewsFeed";
import InvestmentsTable from "./InvestmentTable";
import axiosPrivate from "../../api/axiosPrivate";

const InvestmentsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [haAsset, setHaAsset] = useState(false);
  const [assetDisponibili, setAssetDisponibili] = useState({});
  const tableRef = useRef();

  const fetchUserAssets = async () => {
    try {
      const res = await axiosPrivate.get("/investimenti");
      const data = res.data;

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

  useEffect(() => {
    fetchUserAssets();
  }, []);

  useEffect(() => {
    const quantitaPosseduta =
      assetDisponibili[selectedAsset.toLowerCase()] || 0;
    setHaAsset(quantitaPosseduta > 0);
  }, [selectedAsset, assetDisponibili]);

  const handleOperazioneSuccess = () => {
    setBuyOpen(false);
    setSellOpen(false);
    fetchUserAssets();
    tableRef.current?.refresh();
  };

  return (
    <Box m={2}>
      <Typography variant="h4" mb={2}>
        Investimenti
      </Typography>

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

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InvestmentsTable ref={tableRef} />
        </Grid>
        <Grid item xs={12} md={6}>
          <NewsFeed asset={selectedAsset} />
        </Grid>
      </Grid>

      <InvestmentsModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        asset={selectedAsset}
        type="acquisto"
        onSuccess={handleOperazioneSuccess}
      />

      <InvestmentsModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
        asset={selectedAsset}
        type="vendita"
        defaultPrice={currentPrice}
        disabled={!haAsset}
        onSuccess={handleOperazioneSuccess}
      />
    </Box>
  );
};

export default InvestmentsPage;
