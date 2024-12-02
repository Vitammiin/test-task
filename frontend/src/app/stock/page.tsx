'use client';

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
} from "@nextui-org/react";
import { useState } from "react";

type Stock = {
    name: string;
    symbol: string;
    locale: string;
};

type StockDetails = {
    price: number;
    priceChangeDay: string;
    priceChangeMonth: string;
};

export default function StocksPage() {
    const [symbol, setSymbol] = useState("");
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [stockDetails, setStockDetails] = useState<Record<string, StockDetails>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (symbol: string) => {
        try {
            setError(null);
            const response = await fetch("http://localhost:4000/stocks", {
                method: "GET",
                headers: { symbol },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: Stock[] = await response.json();
            setStocks(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch stocks");
        }
    };

    const fetchStockPrice = async (selectedSymbol: string) => {
        try {
            setError(null);
            const response = await fetch("http://localhost:4000/stockPrice", {
                method: "GET",
                headers: { symbol: selectedSymbol },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: StockDetails = await response.json();
            setStockDetails((prev) => ({ ...prev, [selectedSymbol]: data }));
        } catch (err: any) {
            setError(err.message || "Failed to fetch stock price");
        }
    };

    return (
        <div className="text-white p-6">
            <div className="flex flex-row items-center mb-6 justify-center">
                <Input
                    color="primary"
                    placeholder="Enter symbol or name"
                    value={symbol}
                    className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 !focus:ring !focus:ring-blue-500 !focus:outline-none"
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setSymbol(newValue);
                        handleSearch(newValue);
                    }}
                />
            </div>

            {error && (
                <div className="mb-4 p-3 text-red-500 bg-red-100 border border-red-400 rounded">
                    {error}
                </div>
            )}

            <Table
                aria-label="Stocks Table"
                className="mt-5 text-white h-[70vh]"
                style={{ borderSpacing: '3.5rem 0.3rem', borderCollapse: 'separate' }}
            >
                <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>Symbol</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Capitalization</TableColumn>
                    <TableColumn>Price</TableColumn>
                    <TableColumn>Price Change per Day</TableColumn>
                    <TableColumn>Price Change per Month</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock: Stock, index: number) => {
                        const details = stockDetails[stock.symbol] || {};
                        return (
                            <TableRow key={stock.symbol}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{stock.symbol}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell>{"N/A"}</TableCell>
                                <TableCell>{details.price || "N/A"}</TableCell>
                                <TableCell
                                    className={
                                        details.priceChangeDay === undefined
                                            ? "text-white"
                                            : details.priceChangeDay?.startsWith("-")
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }
                                >
                                    {details.priceChangeDay || "N/A"}
                                </TableCell>
                                <TableCell
                                    className={
                                        details.priceChangeMonth === undefined
                                            ? "text-white"
                                            : details.priceChangeMonth?.startsWith("-")
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }
                                >
                                    {details.priceChangeMonth || "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                                        onClick={() => fetchStockPrice(stock.symbol)}
                                    >
                                        Get Price Data
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Pagination
                total={1}
                initialPage={1}
                onChange={(page) => setCurrentPage(page)}
                className="mt-8 flex justify-center"
            />
        </div>
    );
}
