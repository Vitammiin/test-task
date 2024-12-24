'use client';
import React, { useState, useEffect } from 'react';
import { Stock } from '../../types/stock';

interface StockAPIResponse {
    error?: string;
    data: Stock[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
    };
}

export default function StockPage() {
    const [query, setQuery] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [stockData, setStockData] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(20);

    const fetchStockData = async (page: number) => {
        if (!query && !country) {
            setStockData([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (query) params.append('symbol', query.toUpperCase());
            if (country) params.append('country', country.toUpperCase());
            params.append('page', page.toString());

            const response = await fetch(`/api/stocks?${params.toString()}`);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to fetch stock data');
            }

            if (!responseData.data || responseData.data.length === 0) {
                setStockData([]);
                setError('No data found for the given search criteria');
                return;
            }

            const transformedData = responseData.data.map((stock: any) => ({
                ...stock,
                dailyChange: stock.dailyChange || 0,
                monthlyChange: stock.monthlyChange || 0,
                price: stock.price || 0,
                marketCap: stock.marketCap || null,
            }));

            setStockData(transformedData);
            setTotalPages(responseData.pagination?.totalPages || 1);
            setError('');
        } catch (err) {
            console.error('API Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
            setStockData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query || country) {
                setCurrentPage(1);
                fetchStockData(1);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, country]);

    useEffect(() => {
        if (currentPage > 1 && (query || country)) {
            fetchStockData(currentPage);
        }
    }, [currentPage]);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatNumber = (num: number | null): string => {
        if (num === null) return 'N/A';
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        return num.toLocaleString();
    };

    useEffect(() => {
        if (!query && !country) {
            fetchStockData(1);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-center mb-16">
            <div className="max-w-xl mx-auto space-y-4 mb-8 mt-12"> {/* Added top margin */}
                <input
                    type="text"
                    placeholder="Enter your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                    type="text"
                    placeholder="Enter symbol or name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>
            </div>
            {loading && (
                <div className="text-center text-gray-400 my-8">
                    Loading...
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-center text-red-500 my-8">
                    {error}
                </div>
            )}

            {/* Results table */}
            {!loading && stockData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-200">
                        <thead>
                        <tr className="border-b border-gray-800">
                            <th className="py-4 px-6">#</th>
                            <th className="py-4 px-6">Symbol</th>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Capitalization</th>
                            <th className="py-4 px-6">Price</th>
                            <th className="py-4 px-6">Price change per day</th>
                            <th className="py-4 px-6">Price change per month</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stockData.map((stock, index) => (
                            <tr key={stock.symbol} className="border-b border-gray-800">
                                <td className="py-4 px-6">{(currentPage - 1) * 10 + index + 1}</td>
                                <td className="py-4 px-6">{stock.symbol}</td>
                                <td className="py-4 px-6">{stock.name}</td>
                                <td className="py-4 px-6">{formatNumber(stock.marketCap)}</td>
                                <td className="py-4 px-6">{formatCurrency(stock.price)}</td>
                                <td className={`py-4 px-6 ${
                                    stock.dailyChange > 0 ? 'text-green-500' :
                                        stock.dailyChange < 0 ? 'text-red-500' : ''
                                }`}>
                                    {stock.dailyChange > 0 ? '+' : ''}
                                    {stock.dailyChange.toFixed(2)}%
                                </td>
                                <td className={`py-4 px-6 ${
                                    stock.monthlyChange > 0 ? 'text-green-500' :
                                        stock.monthlyChange < 0 ? 'text-red-500' : ''
                                }`}>
                                    {stock.monthlyChange > 0 ? '+' : ''}
                                    {stock.monthlyChange.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && stockData.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>
                    {[...Array(Math.min(7, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-full ${
                                    currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    {totalPages > 7 && <span className="text-gray-400">...</span>}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
