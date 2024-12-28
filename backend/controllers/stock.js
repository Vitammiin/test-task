import axios from 'axios';
import { env } from '../utils/env.js';

const API_KEY = env('FINNHUB_API_KEY');

export async function getStock(req, reply) {
  const { country, symbol } = req.query;

  const symbolUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${country}&token=${API_KEY}`;
  try {
    const symbolResponse = await fetch(symbolUrl);
    const symbolData = await symbolResponse.json();

    const filteredSymbolData = symbolData.filter(
      (stock) => stock.symbol === symbol,
    );

    if (filteredSymbolData.length === 0) {
      return reply.code(404).send({ error: 'Symbol not found' });
    }

    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    reply.code(200).send({
      symbolInfo: filteredSymbolData[0],
      quote: quoteData,
    });
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch stock data' });
  }
}

export async function getAllStock(req, reply) {
  const { country, symbols } = req.query;

  if (!symbols) {
    return reply.code(400).send({ error: 'No symbols provided' });
  }

  try {
    const symbolUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${country}&token=${API_KEY}`;
    const symbolResponse = await axios.get(symbolUrl);
    const symbolData = symbolResponse.data;

    const requestedSymbols = symbols.split(',');

    const filteredSymbols = symbolData.filter((stock) =>
      requestedSymbols.includes(stock.symbol),
    );

    if (filteredSymbols.length === 0) {
      return reply.code(404).send({ error: 'No matching symbols found' });
    }

    const quoteRequests = filteredSymbols.map((stock) =>
      axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${API_KEY}`,
      ),
    );

    const quoteResponses = await Promise.all(quoteRequests);

    const result = filteredSymbols.map((stock, index) => ({
      symbolInfo: stock,
      quote: quoteResponses[index].data,
    }));

    reply.code(200).send(result);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    reply.code(500).send({ error: 'Failed to fetch stock data' });
  }
}
