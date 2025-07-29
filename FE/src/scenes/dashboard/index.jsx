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
  ProgressCircle,
  BarChart,
  GeographyChart,
} from "../../components";
import LineChartWithFilter from "../../scenes/LineChartWithFilter";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMutuo,
  fetchPrestito,
  fetchTransazioni,
} from "../../redux/slices/dashboardSlice";
import { aggiornaSaldo } from "../../redux/slices/authSlice";
import { fetchAndamentoInvestimenti } from "../../redux/slices/investimentiSlice";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import axiosPrivate from "../../api/axiosPrivate";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const saldo = useSelector((state) => state.auth.saldo);
  const [composizione, setComposizione] = useState(null);
  const dispatch = useDispatch();
  const mutuoData = useSelector((state) => state.dashboard.mutuo);
  const prestitoData = useSelector((state) => state.dashboard.prestito);
  const { andamento, loadingAndamento } = useSelector(
    (state) => state.investimenti
  );
  const recentTransactions = useSelector(
    (state) => state.dashboard.transazioni
  );
  const iconeCategoria = {
    Alimentari: <RestaurantMenuOutlinedIcon />,
    Affitto: <HomeOutlinedIcon />,
    Trasporti: <DirectionsCarFilledOutlinedIcon />,
    Svago: <SportsEsportsOutlinedIcon />,
    Utenze: <ElectricBoltOutlinedIcon />,
    Assicurazioni: <SecurityOutlinedIcon />,
    Mutuo: <AccountBalanceOutlinedIcon />,
  };

  const oggi = new Date();
  const to = oggi.toISOString().split("T")[0];

  const quattordiciGiorniFa = new Date();
  quattordiciGiorniFa.setDate(oggi.getDate() - 14);
  const from = quattordiciGiorniFa.toISOString().split("T")[0];
  const [progressCircle, setProgressCircle] = useState(0);
  const [entrate, setEntrate] = useState(0);
  const [uscite, setUscite] = useState(0);

  const fetchAndamento = async () => {
    try {
      const res = await axiosPrivate.get(
        `/transazioni/andamento-trimestrale?from=${from}&to=${to}`
      );

      let entrateTotali = 0;
      let usciteTotali = 0;
      let progress = 0;

      if (res.data && res.data.length > 0) {
        res.data.forEach(({ entrate, uscite }) => {
          entrateTotali += parseFloat(entrate) || 0;
          usciteTotali += Math.abs(parseFloat(uscite)) || 0;
        });

        const totale = entrateTotali + usciteTotali;
        progress = totale > 0 ? entrateTotali / totale : 0;

        setEntrate(entrateTotali);
        setUscite(usciteTotali);
        setProgressCircle(progress);
      } else {
        setEntrate(0);
        setUscite(0);
        setProgressCircle(0);
      }
    } catch (error) {
      console.error("Errore nel fetch andamento:", error);
    }
  };

  useEffect(() => {
    fetchAndamento();
  }, []);

  useEffect(() => {}, [progressCircle]);

  useEffect(() => {
    const fetchComposizione = async () => {
      const res = await axiosPrivate.get("/investimenti/composizione");
      setComposizione(res.data);
    };

    fetchComposizione();
  }, []);

  useEffect(() => {
    const fetchComposizione = async () => {
      const res = await axiosPrivate.get("/investimenti/composizione");
      setComposizione(res.data);
    };

    fetchComposizione();
  }, []);

  useEffect(() => {
    dispatch(fetchAndamentoInvestimenti());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMutuo());
    dispatch(fetchPrestito());
    dispatch(fetchTransazioni());
  }, [dispatch]);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await axiosPrivate.get("/saldo");
        dispatch(aggiornaSaldo(res.data.saldo));
      } catch (err) {
        console.error("Errore nel recupero del saldo:", err);
      }
    };

    fetchSaldo();
  }, [dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Situazione economica"
          subtitle={`Dati aggiornati al ${new Date().toLocaleDateString(
            "it-IT"
          )}`}
        />
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
          {!loadingAndamento && andamento && composizione && (
            <StatBox
              title={`€${andamento.valoreAttuale.toFixed(2)}`}
              subtitle="Valore asset"
              progress={
                andamento.variazione === null
                  ? 0
                  : Math.min(Math.abs(andamento.variazione) / 100, 1)
              }
              increase={
                andamento.variazione === null ? (
                  "N/A"
                ) : (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {andamento.variazione > 0 ? (
                      <ArrowDropUpOutlinedIcon
                        sx={{ color: colors.greenAccent[500] }}
                      />
                    ) : (
                      <ArrowDropDownOutlinedIcon
                        sx={{ color: theme.palette.error.main }}
                      />
                    )}
                    <Typography
                      component="span"
                      color={
                        andamento.variazione > 0
                          ? colors.greenAccent[500]
                          : theme.palette.error.main
                      }
                      fontWeight="bold"
                    >
                      {`${andamento.variazione > 0 ? "+" : ""}${
                        andamento.variazione
                      }%`}
                    </Typography>
                  </Box>
                )
              }
              x={parseInt(composizione.x)}
              y={parseInt(composizione.y)}
              labelX={composizione.labelX}
              labelY={composizione.labelY}
              icon={
                <TrendingUpOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {mutuoData && (
            <StatBox
              title={`€${(
                mutuoData.in_scadenza.totale + mutuoData.da_pagare.totale
              ).toLocaleString()}`}
              subtitle="Mutuo residuo"
              progress={
                mutuoData.pagata.count /
                (mutuoData.pagata.count +
                  mutuoData.in_scadenza.count +
                  mutuoData.da_pagare.count)
              }
              increase={`${
                mutuoData.in_scadenza.count + mutuoData.da_pagare.count
              } rate residue`}
              labelX={`Pagato (${Math.round(
                (mutuoData.pagata.count /
                  (mutuoData.pagata.count +
                    mutuoData.in_scadenza.count +
                    mutuoData.da_pagare.count)) *
                  100
              )}%)`}
              labelY={`Residuo (${Math.round(
                ((mutuoData.in_scadenza.count + mutuoData.da_pagare.count) /
                  (mutuoData.pagata.count +
                    mutuoData.in_scadenza.count +
                    mutuoData.da_pagare.count)) *
                  100
              )}%)`}
              icon={
                <HomeOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {prestitoData && (
            <StatBox
              title={`€${(
                prestitoData.in_scadenza.totale + prestitoData.da_pagare.totale
              ).toLocaleString()}`}
              subtitle="Prestito residuo"
              progress={
                prestitoData.pagata.count /
                (prestitoData.pagata.count +
                  prestitoData.in_scadenza.count +
                  prestitoData.da_pagare.count)
              }
              increase={`${
                prestitoData.in_scadenza.count + prestitoData.da_pagare.count
              } rate residue`}
              labelX={`Pagato (${Math.round(
                (prestitoData.pagata.count /
                  (prestitoData.pagata.count +
                    prestitoData.in_scadenza.count +
                    prestitoData.da_pagare.count)) *
                  100
              )}%)`}
              labelY={`Residuo (${Math.round(
                ((prestitoData.in_scadenza.count +
                  prestitoData.da_pagare.count) /
                  (prestitoData.pagata.count +
                    prestitoData.in_scadenza.count +
                    prestitoData.da_pagare.count)) *
                  100
              )}%)`}
              icon={
                <PaymentsOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          )}
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
          p={2}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="600" color={colors.gray[100]}>
              Andamento ultimi 3 mesi
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              Saldo €
              {saldo?.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Box height="250px" mt="-20px">
            <LineChartWithFilter isDashboard={true} />
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
            Overview ultimi 14 giorni
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle
              progress={progressCircle}
              size={125}
              x={Math.round(progressCircle * 100)}
              y={100 - Math.round(progressCircle * 100)}
              labelX="Entrate"
              labelY="Uscite"
            />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              €{(entrate + uscite).toFixed(2)} movimentati
            </Typography>
            <Typography textAlign="center">% entrate vs uscite</Typography>
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
            Uscite ultimi 30 giorni
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
