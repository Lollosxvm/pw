import axios from "axios";

export const getCryptoNews = async (req, res) => {
  const { asset = "bitcoin" } = req.query;

  const symbolMap = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
  };

  const symbol = symbolMap[asset] || "BTC";

  try {
    const response = await axios.get("https://cryptopanic.com/api/v1/posts/", {
      params: {
        auth_token: process.env.CRYPTOPANIC_API_KEY,
        currencies: symbol,
        kind: "news", // opzionale: news, media, all
        public: true,
      },
    });

    const results = response.data?.results;
    console.log("[CryptoPanic] Notizie inviate con successo");

    if (!Array.isArray(results)) {
      return res.status(502).json({ error: "Dati non validi da CryptoPanic" });
    }

    const filtered = results
      .filter((item) => item.title && item.slug)
      .slice(0, 5)
      .map((item) => ({
        title: item.title,
        link: `https://cryptopanic.com/news/${item.slug}`,
        published_at: item.published_at,
        description: item.description,
      }));

    res.json(filtered);
  } catch (error) {
    console.error("Errore CryptoPanic:", error.message);
    res.status(500).json({ error: "Errore nel caricamento delle notizie" });
  }
};
