const { getStockData } = require('../services/stockService');

const stockController = {
  getStock: async (request, reply) => {
    const { symbol, country } = request.query;

    console.log('Received request:', { symbol, country });

    if (!symbol) {
      console.log('Validation error: Stock symbol is missing');
      return reply.status(400).send({ error: 'Stock symbol is required' });
    }

    try {
      const stockData = await getStockData(symbol, country || 'US');
      console.log('Stock data fetched successfully:', stockData);
      return reply.send(stockData);
    } catch (error) {
      console.error('Error in getStock:', error.message);
      return reply.status(500).send({ error: 'Error fetching stock data' });
    }
  },
};

module.exports = { stockController };
