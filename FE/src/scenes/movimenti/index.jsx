import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../theme";

const Movimenti = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "tipo", headerName: "Tipo", flex: 1 },
    {
      field: "importo",
      headerName: "Importo",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          €{params.row.importo}
        </Typography>
      ),
    },
    { field: "stato", headerName: "Stato", flex: 1 },
    { field: "metodo", headerName: "Metodo di Pagamento", flex: 1 },
    { field: "data", headerName: "Data", flex: 1 },
    { field: "indirizzo", headerName: "Indirizzo", flex: 1 },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/transactions")
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.error("Errore nel recupero dati:", err);
      });
  }, []);

  return (
    <Box m="20px">
      <Header title="Movimenti" subtitle="Lista ultime 20 transazioni" />
      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Movimenti;
