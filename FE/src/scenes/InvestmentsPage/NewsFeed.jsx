import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const NewsFeed = ({ asset }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/news?asset=${asset}`
        );
        const json = await res.json();

        if (Array.isArray(json)) {
          setNews(json);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Errore caricamento news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [asset]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notizie su {asset.toUpperCase()}
      </Typography>

      {loading ? (
        <Typography variant="body2" color="textSecondary">
          Caricamento notizie in corso...
        </Typography>
      ) : news.length === 0 ? (
        <ListItem>
          <ListItemText primary="Nessuna notizia trovata" />
        </ListItem>
      ) : (
        <List dense>
          {news.map((item, index) => (
            <ListItem key={index} divider>
              {item.title ? (
                <ListItemText
                  primary={
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        color: colors.blueAccent[500],
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </Link>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ color: colors.gray[500], fontSize: "12px" }}
                    >
                      {new Date(item.published_at).toLocaleDateString("it-IT")}
                      <br />
                      {item.description}
                    </Typography>
                  }
                />
              ) : (
                <ListItemText primary="(Titolo non disponibile)" />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NewsFeed;
