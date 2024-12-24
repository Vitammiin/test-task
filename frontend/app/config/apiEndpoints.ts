import axios from "axios";

export default async function vantageapi({
  symbol,
  country,
}: {
  symbol: string;
  country: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!symbol) {
    return [];
  }

  try {
    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol + (country ? "." + country : ""),
        apikey: apiKey,
      },
    });

    if (response.data["Time Series (Daily)"]) {
      const stockData = Object.keys(response.data["Time Series (Daily)"]).map(
        (date) => {
          const dailyData = response.data["Time Series (Daily)"][date];
          return {
            name: symbol, // Stock name could be fetched from another API if needed
            symbol,
            marketCap: "N/A", // Alpha Vantage doesn't provide market cap
            price: dailyData["4. close"],
            changes: dailyData["4. close"] - dailyData["1. open"],
          };
        }
      );

      return stockData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
}
