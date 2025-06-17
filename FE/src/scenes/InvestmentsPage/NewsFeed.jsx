import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const NewsFeed = ({ asset }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get("/news", {
          params: { asset },
        });

        const newsData = res.data;

        if (Array.isArray(newsData)) {
          const withId = newsData.map((n, i) => ({
            ...n,
            id: `${n.link}-${i}`,
          }));
          setNews(withId);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Errore news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [asset]);

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
          rows={news}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default NewsFeed;
