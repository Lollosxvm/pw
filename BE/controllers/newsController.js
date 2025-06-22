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
        kind: "news",
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
      .slice(0, 20)
      .map((item) => ({
        title: item.title,
        link: `https://cryptopanic.com/news/${item.slug}`,
        published_at: item.published_at,
        description: item.description,
      }));

    res.json(filtered);
  } catch (error) {
    const status = error.response?.status;
    const info = error.response?.data?.info;

    switch (status) {
      case 401:
        console.warn(
          "[CryptoPanic] Errore 401 – auth_token mancante o non valido"
        );
        return res.status(401).json({
          error:
            "Autenticazione fallita. Verifica il tuo auth_token di CryptoPanic.",
        });

      case 403:
        if (info?.includes("quota exceeded")) {
          console.warn("[CryptoPanic] Errore 403 – quota mensile superata");
          return res.status(429).json({
            error:
              "Hai superato il limite mensile di richieste previsto dal piano gratuito di CryptoPanic.",
          });
        } else {
          console.warn(
            "[CryptoPanic] Errore 403 – accesso negato all'endpoint o rate limit backend"
          );
          return res.status(403).json({
            error:
              "Accesso non autorizzato a questo endpoint. Verifica il piano API di CryptoPanic.",
          });
        }

      case 429:
        console.warn(
          "[CryptoPanic] Errore 429 – sei stato temporaneamente rate-limitato"
        );
        return res.status(429).json({
          error:
            "Hai effettuato troppe richieste in poco tempo. Riprova tra qualche minuto.",
        });

      default:
        console.error("Errore generico CryptoPanic:", error.message);
        return res.status(500).json({
          error: "Errore interno durante il caricamento delle notizie.",
        });
    }
  }
};
