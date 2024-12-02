const axios = require('axios');

const getStockData = async (symbol, country) => {
  console.log('Fetching stock data for:', { symbol, country });

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m&country=${country}`
    );
    console.log('Response from Yahoo API:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching stock data from Yahoo API:',
      error.response?.data || error.message
    );
    throw new Error('Error fetching stock data');
  }
};

module.exports = { getStockData };
