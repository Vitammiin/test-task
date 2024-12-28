import axios from 'axios';
import { env } from '../utils/env.js';

const API_KEY = env('FINNHUB_API_KEY');

export async function getStock(req, reply) {
  const { country, symbol } = req.query;

  if (!country || !symbol) {
    return reply.code(400).send({ error: 'Country and symbol are required' });
  }

  const symbolUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${country}&token=${API_KEY}`;
  try {
    const symbolResponse = await fetch(symbolUrl);
    const symbolData = await symbolResponse.json();

    if (!Array.isArray(symbolData)) {
      console.error('Unexpected symbolData format:', symbolData);
      return reply.code(500).send({ error: 'Unexpected data format from API' });
    }

    const filteredSymbolData = symbolData.filter(
      (stock) => stock.symbol.toUpperCase() === symbol.toUpperCase(),
    );

    if (filteredSymbolData.length === 0) {
      return reply.code(404).send({ error: 'The symbol was not found' });
    }

    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    reply.code(200).send({
      symbolInfo: filteredSymbolData[0],
      quote: quoteData,
    });
  } catch (error) {
    console.error('Error in getStock:', error);
    reply.code(500).send({ error: 'Failed to fetch stock data' });
  }
}

export async function getAllStock(req, reply) {
  const { country, symbols } = req.query;

  if (!country || !symbols) {
    return reply.code(400).send({ error: 'Country and symbols are required' });
  }

  try {
    const symbolUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${country}&token=${API_KEY}`;
    const symbolResponse = await axios.get(symbolUrl);
    const symbolData = symbolResponse.data;

    const requestedSymbols = symbols.split(',').map((s) => s.toUpperCase());

    if (!Array.isArray(symbolData)) {
      console.error('Unexpected symbolData format:', symbolData);
      return reply.code(500).send({ error: 'Unexpected data format from API' });
    }

    const filteredSymbols = symbolData.filter((stock) =>
      requestedSymbols.includes(stock.symbol.toUpperCase()),
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
    console.error('Error in getAllStock:', error);
    reply.code(500).send({ error: 'Failed to fetch stock data' });
  }
}
