import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export const fetchStockData = async (symbol: string, country: string) => {
  if (!symbol) {
    throw new Error('Please enter a stock symbol');
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stock`,
      {
        params: { symbol, country },
      }
    );

    const data = response.data.chart.result[0];
    if (!data) throw new Error('Invalid data structure received');

    const meta = data.meta;
    const closePrices = data.indicators.quote[0].close;
    const lastClosePrice = closePrices[closePrices.length - 1];
    const secondLastClosePrice = closePrices[closePrices.length - 2];

    const priceChangeDay =
      ((lastClosePrice - secondLastClosePrice) / secondLastClosePrice) * 100;

    const monthStartPrice = closePrices[0];
    const priceChangeMonth =
      ((lastClosePrice - monthStartPrice) / monthStartPrice) * 100;

    const companyName = meta.exchangeName || 'Unknown Company';
    const capitalization = await fetchCapitalization(meta.symbol);

    return {
      symbol: meta.symbol,
      name: companyName,
      capitalization,
      price: lastClosePrice.toFixed(2),
      priceChangeDay: priceChangeDay.toFixed(2),
      priceChangeMonth: priceChangeMonth.toFixed(2),
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error('Stock not found.');
      } else if (status === 500) {
        throw new Error('Internal server error, please try again later.');
      }
    }
    throw new Error('Something went wrong. Please try again.');
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCapitalization = async (symbol: string) => {
  try {
    await delay(2000);

    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (
      response.data.Information &&
      response.data.Information.includes('rate limit')
    ) {
      return 'API rate limit';
    }

    const marketCap = response.data.MarketCapitalization;
    return marketCap ? `${(parseFloat(marketCap) / 1e9).toFixed(2)} B` : 'N/A';
  } catch (error) {
    return 'Error fetching capitalization data';
  }
};

export const registerUser = async (email: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      {
        email,
      }
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 409) {
        throw new Error('A user with this email is already registered.');
      }
    }
    throw new Error('Something went wrong! Please try again....');
  }
};
