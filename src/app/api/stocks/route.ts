import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'HvvVrpj8ZzEEAOctutL63TJad8hkRwGV';
const BASE_URL = process.env.BASE_URL || 'https://api.polygon.io/v2';

interface PolygonStockResponse {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: {
        c: number;  // close price
        h: number;  // high
        l: number;  // low
        n: number;  // number of transactions
        o: number;  // open price
        t: number;  // timestamp
        v: number;  // trading volume
        vw: number; // volume weighted average price
    }[];
    status: string;
    request_id: string;
    count: number;
}

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const symbol = searchParams.get('symbol') || 'AAPL';
        const page = Number(searchParams.get('page')) || 1;


        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const formatDate = (date: Date) => {
            return date.toISOString().split('T')[0];
        };

        const response = await fetch(
            `${BASE_URL}/aggs/ticker/${symbol}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=desc&limit=120&apiKey=${POLYGON_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Polygon API error: ${response.statusText}`);
        }

        const data: PolygonStockResponse = await response.json();

        const latestPrice = data.results[0]?.c || 0;
        const previousPrice = data.results[1]?.c || latestPrice;
        const monthAgoPrice = data.results[data.results.length - 1]?.c || latestPrice;

        const dailyChange = ((latestPrice - previousPrice) / previousPrice) * 100;
        const monthlyChange = ((latestPrice - monthAgoPrice) / monthAgoPrice) * 100;

        const stockData = {
            symbol: data.ticker,
            name: data.ticker,
            price: latestPrice,
            currency: 'USD',
            marketCap: null,
            dailyChange: dailyChange,
            monthlyChange: monthlyChange,
            volume: data.results[0]?.v || 0,
            high: data.results[0]?.h || 0,
            low: data.results[0]?.l || 0
        };

        return NextResponse.json({
            data: [stockData],
            pagination: {
                total: 1,
                page: page,
                totalPages: 1
            }
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json(
            {error: 'Failed to fetch stock data'},
            {status: 500}
        );
    }
}
