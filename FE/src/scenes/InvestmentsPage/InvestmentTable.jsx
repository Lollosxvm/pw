import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosPrivate from "../../api/axiosPrivate";
import { tokens } from "../../theme";

const InvestmentsTable = forwardRef((props, ref) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const fetchInvestimenti = () => {
    axiosPrivate
      .get("/investimenti")
      .then((res) => {
        setRows(
          res.data.map((row, index) => ({
            ...row,
            id: index + 1,
          }))
        );
      })
      .catch((err) => {
        console.error("Errore nel caricamento investimenti:", err);
      });
  };

  useImperativeHandle(ref, () => ({
    refresh: () => fetchInvestimenti(),
  }));

  useEffect(() => {
    fetchInvestimenti();
  }, []);

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
        <Typography
          fontWeight="bold"
          color={
            params.value === "acquisto"
              ? colors.greenAccent[500]
              : colors.redAccent[500]
          }
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "quantita",
      headerName: "Quantità",
      flex: 1,
      valueFormatter: (params) =>
        parseFloat(params.value).toLocaleString("it-IT", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },

    {
      field: "prezzo_unitario",
      headerName: "Prezzo Unitario (€)",
      flex: 1,
      valueFormatter: (params) =>
        parseFloat(params.value).toLocaleString("it-IT", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }),
    },
    {
      field: "totale",
      headerName: "Totale (€)",
      flex: 1,
      valueGetter: (params) =>
        parseFloat(params.row.quantita) *
        parseFloat(params.row.prezzo_unitario),
      valueFormatter: (params) =>
        parseFloat(params.value).toLocaleString("it-IT", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }),
    },
  ];

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
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
});

export default InvestmentsTable;
