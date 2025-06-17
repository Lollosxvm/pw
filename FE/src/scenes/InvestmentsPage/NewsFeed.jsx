import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../redux/slices/newsSlice";

const NewsFeed = ({ asset }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();
  const news = useSelector((state) => state.news.cache[asset] || []);
  const loading = useSelector((state) => state.news.loading);

  useEffect(() => {
    dispatch(fetchNews(asset));
  }, [asset, dispatch]);

  const columns = [
    {
      field: "title",
      headerName: "Titolo",
      flex: 3,
      renderCell: (params) => (
        <a
          href={params.row.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: colors.greenAccent[300] }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "published_at",
      headerName: "Data",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("it-IT"),
    },
  ];

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Notizie su {asset.toUpperCase()}
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
          rows={news.map((n, i) => ({ ...n, id: `${n.link}-${i}` }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default NewsFeed;
