import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

const POLYGON_BASE_URL = 'https://api.polygon.io';
const API_KEY = process.env.POLYGON_API_KEY || '';

export const getStockData = async (req: FastifyRequest, reply: FastifyReply) => {
    const { country, symbol } = req.headers as {
        country?: string; //polygon api doesn't have country filter
        symbol?: string;
    };


    try {
        const params: { [key: string]: any } = {
            apiKey: API_KEY,
            limit: 10
        };

        if (symbol) {
            params['search'] = symbol;
        }

        const response = await axios.get(`${POLYGON_BASE_URL}/v3/reference/tickers`, {
            params,
        });

        const stocks = response.data.results.map((stock: any) => ({
            name: stock.name,
            symbol: stock.ticker,
            marketCap: stock.market_cap,
            locale: stock.locale
        }));

        return reply.send(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        reply.status(500).send({ error: 'Failed to fetch stock data' });
    }
};

export const getStockPriceData = async (req: FastifyRequest, reply: FastifyReply) => {
    const { symbol } = req.headers as {
        symbol?: string;
    };

    const today = new Date();

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const date = formatDate(threeDaysAgo);
    const from = formatDate(oneMonthAgo);
    const to = formatDate(today);

    if (!symbol) {
        return reply.status(400).send({ error: 'Symbol is required' });
    }

    try {
        let priceDayData = {};
        if (date) {
            priceDayData = await getStockPriceForDay(symbol, date);
        }

        let priceMonthData = {};
        if (from && to) {
            priceMonthData = await getStockPriceForMonth(symbol, from, to);
        }

        const stockData = {
            symbol,
            ...priceDayData,
            ...priceMonthData,
        };

        return reply.send(stockData);
    } catch (err) {
        console.error('Error fetching stock price data:', err);
        reply.status(500).send({ error: 'Failed to fetch stock price data' });
    }
};


const getStockPriceForDay = async (symbol: string, date: string) => {
    try {
        const params = {
            apiKey: API_KEY,
        };

        const response = await axios.get(`${POLYGON_BASE_URL}/v1/open-close/${symbol}/${date}`, {
            params,
        });

        const stockData = response.data;

        const priceChangeDay = ((stockData.close - stockData.open) / stockData.open) * 100;

        return {
            price: stockData.close,
            priceChangeDay: priceChangeDay.toFixed(2) + '%',
        };
    } catch (err) {
        console.error('Error fetching daily stock price:', err);
        throw new Error('Failed to fetch daily stock price');
    }
};


const getStockPriceForMonth = async (symbol: string, from: string, to: string) => {
    try {
        const params = {
            apiKey: API_KEY,
            multiplier: '1',
            timespan: 'day',
            from: from,
            to: to,
        };

        const response = await axios.get(`${POLYGON_BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}`, {
            params,
        });

        const monthData = response.data.results;

        if (monthData && monthData.length > 0) {
            const firstDayPrice = monthData[0].o;
            const lastDayPrice = monthData[monthData.length - 1].c;

            const priceChangeMonth = ((lastDayPrice - firstDayPrice) / firstDayPrice) * 100;

            return {
                priceChangeMonth: priceChangeMonth.toFixed(2) + '%',
            };
        }

        return { priceChangeMonth: '0%' };
    } catch (err) {
        console.error('Error fetching monthly stock price:', err);
        throw new Error('Failed to fetch monthly stock price');
    }
};

