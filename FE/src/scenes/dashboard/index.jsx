import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
  GeographyChart,
} from "../../components";
import { DownloadOutlined } from "@mui/icons-material";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";

import { Tooltip } from "@mui/material";

import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const iconeCategoria = {
    Alimentari: <RestaurantMenuOutlinedIcon />,
    Affitto: <HomeOutlinedIcon />,
    Trasporti: <DirectionsCarFilledOutlinedIcon />,
    Svago: <SportsEsportsOutlinedIcon />,
    Utenze: <ElectricBoltOutlinedIcon />,
    Assicurazioni: <SecurityOutlinedIcon />,
    Mutuo: <AccountBalanceOutlinedIcon />,
  };

  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/transactions/spese-recenti")
      .then((res) => setRecentTransactions(res.data))
      .catch((err) => console.error("Errore nel caricamento:", err));
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Situazione economica"
          subtitle={`Dati aggiornati al ${new Date().toLocaleDateString(
            "it-IT"
          )}`}
        />
        {!isXsDevices && (
          <Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: colors.blueAccent[700],
                color: "#fcfcfc",
                fontSize: isMdDevices ? "14px" : "10px",
                fontWeight: "bold",
                p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: colors.blueAccent[800],
                },
              }}
              startIcon={<DownloadOutlined />}
            >
              DOWNLOAD REPORTS
            </Button>
          </Box>
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          bgcolor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="€48.352"
            subtitle="Portafoglio investimenti"
            progress={0.4}
            increase="+4.2% YTD"
            x={60}
            y={40}
            labelX="Azioni"
            labelY="Obbligazioni"
            icon={
              <TrendingUpOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="€86.000"
            subtitle="Mutuo residuo"
            progress={0.68}
            increase="32 rate residue"
            x={68}
            y={32}
            labelX="Importo già pagato"
            labelY="Rimanente"
            icon={
              <HomeOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="€2.700"
            subtitle="Prestito rimanente"
            progress={0.75}
            increase="25% da saldare"
            x={75}
            y={25}
            labelX="Rimborsato"
            labelY="Da rimborsare"
            icon={
              <CreditCardOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="67%"
            subtitle="Stabilità finanziaria"
            progress={0.67}
            increase="entrate > spese"
            x={67}
            y={33}
            labelX="Entrate"
            labelY="Spese"
            icon={
              <SecurityOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ---------------- Row 2 ---------------- */}

        {/* Line Chart */}
        <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.gray[100]}
              >
                Conto Corrente 012456789012334
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Saldo $59,342.32
              </Typography>
            </Box>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/*  Transazioni recenti */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
        >
          <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
              Transazioni recenti
            </Typography>
          </Box>

          {recentTransactions.map((tx, i) => {
            const luogo = tx.indirizzo.split(",").pop().trim();
            const dataFormattata = new Date(tx.data).toLocaleDateString(
              "it-IT"
            );

            return (
              <Box
                key={i}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                gap={2}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Tooltip
                    title={`${tx.categoria} - ${luogo}`}
                    arrow
                    placement="top"
                  >
                    <Box color={colors.greenAccent[500]}>
                      {iconeCategoria[tx.categoria] || <LocalOfferOutlined />}
                    </Box>
                  </Tooltip>
                </Box>

                <Box flex="1" textAlign="center">
                  <Typography color={colors.gray[100]}>
                    {dataFormattata}
                  </Typography>
                </Box>

                <Box flex="1" textAlign="center">
                  <Typography color={colors.gray[100]}>{tx.metodo}</Typography>
                </Box>
                <Box
                  bgcolor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                  minWidth="80px"
                  textAlign="center"
                >
                  €{tx.importo}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Revenue Details */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Suddivisione attuale del portafoglio
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle
              progress={0.6}
              size={125}
              x={55}
              y={45}
              labelX="Azioni"
              labelY="ETF"
            />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              €48.352 investiti
            </Typography>
            <Typography textAlign="center">% per categoria</Typography>
          </Box>
        </Box>

        {/*  Distribuzione delle spese per categoria */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Spese mensili per categoria
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="250px"
            mt="-20px"
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* Distribuzione delle spese per area geografica */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Area Geografica transazioni
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
          >
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
