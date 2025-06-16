import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const NewsFeed = ({ asset }) => {
  const news = [
    {
      title: `Il prezzo di ${asset} in aumento del 5%`,
      date: "13/06/2025",
    },
    {
      title: `${asset.toUpperCase()} considerato un rifugio sicuro dagli investitori`,
      date: "12/06/2025",
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notizie su {asset.toUpperCase()}
      </Typography>
      <List dense>
        {news.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={item.title} secondary={item.date} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NewsFeed;
