import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../theme";

const InvestmentsTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "data_operazione",
      headerName: "Data",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("it-IT"),
    },
    {
      field: "asset",
      headerName: "Asset",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="bold">
          {params.row.asset.toUpperCase()}
        </Typography>
      ),
    },
    {
      field: "operazione",
      headerName: "Operazione",
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.value === "acquisto" ? "green" : "red"}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "quantita",
      headerName: "Quantità",
      flex: 1,
      valueFormatter: (params) => parseFloat(params.value).toFixed(4),
    },
    {
      field: "prezzo_unitario",
      headerName: "Prezzo Unitario (€)",
      flex: 1,
      valueFormatter: (params) => `€${parseFloat(params.value).toFixed(2)}`,
    },
    {
      field: "totale",
      headerName: "Totale (€)",
      flex: 1,
      valueGetter: (params) => params.row.quantita * params.row.prezzo_unitario,
      valueFormatter: (params) => `€${parseFloat(params.value).toFixed(2)}`,
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/investimenti/1")
      .then((res) => {
        setRows(
          res.data.map((row, index) => ({
            ...row,
            id: index + 1, // necessario per DataGrid
          }))
        );
      })
      .catch((err) => {
        console.error("Errore nel caricamento investimenti:", err);
      });
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Storico Operazioni
      </Typography>

      <Box
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #333",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: colors.blueAccent[700],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default InvestmentsTable;
