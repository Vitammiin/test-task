"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { getAllStock, getStock } from "@/api/apiStock";
import { SotckProp, StockData } from "../types";

export default function Stocks({ country, symbol }: SotckProp) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allStock, setAllStock] = useState<StockData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [symbols] = useState([
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "FB",
    "NVDA",
    "BRK-B",
    "JPM",
    "V",
    "WMT",
    "UNH",
    "MA",
    "PG",
    "HD",
    "DIS",
    "PYPL",
  ]);
=======
import { getStock } from "@/api/apiStock";

interface StockSymbolInfo {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  isin: string | null;
  mic: string;
  shareClassFIGI: string;
  symbol: string;
  symbol2: string;
  type: string;
}

interface StockQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

interface StockData {
  symbolInfo: StockSymbolInfo;
  quote: StockQuote;
}

interface SotckProp {
  country: string;
  symbol: string;
}

export default function Stocks({ country, symbol }: SotckProp) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864

  useEffect(() => {
    const getData = async () => {
      setStocks([]);
<<<<<<< HEAD
=======
      setLoading(true);
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
      const data = await getStock(country, symbol);
      if (data) {
        setStocks([data]);
      }
      setLoading(false);
    };

    if (country && symbol) {
      getData();
<<<<<<< HEAD
    } else if (!country || !symbol) {
      setStocks([]);
    }
  }, [country, symbol]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllStock("US", symbols);
      if (data) {
        setAllStock(data);
      }
      setLoading(false);
    };

    if (!symbol && !allStock.length) {
      getData();
    }
  }, [country, symbols, allStock, symbol]);

  const currentStocks = (stocks.length > 0 ? stocks : allStock).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (stocks.length > 0 ? stocks : allStock).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

=======
    }
  }, [country, symbol]);

>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
  return (
    <div className="mt-[86px]">
      {loading ? (
        <div>Loading...</div>
<<<<<<< HEAD
      ) : currentStocks.length > 0 ? (
        <Table aria-label="Stocks Table" className="text-sm">
          <TableHeader>
            <TableColumn className="p-6">#</TableColumn>
            <TableColumn className="p-6">Symbol</TableColumn>
            <TableColumn className="p-6">Name</TableColumn>
            <TableColumn className="p-6">Capitalization</TableColumn>
            <TableColumn className="p-6">Price</TableColumn>
            <TableColumn className="p-6">Price change per day</TableColumn>
            <TableColumn className="p-6">Price change per month</TableColumn>
          </TableHeader>
          <TableBody>
            {currentStocks.map((stock, i) => (
              <TableRow key={i}>
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </TableCell>
                <TableCell>{stock.symbolInfo.symbol}</TableCell>
                <TableCell>{stock.symbolInfo.description}</TableCell>
                <TableCell>{stock.quote.t} $</TableCell>
                <TableCell>{`${stock.quote.c} ${stock.symbolInfo.currency}`}</TableCell>
=======
      ) : stocks.length > 0 ? (
        <Table aria-label="Stocks Table" className="text-sm">
          <TableHeader>
            <TableColumn className="p-4">#</TableColumn>
            <TableColumn className="p-4">Symbol</TableColumn>
            <TableColumn className="p-4">Name</TableColumn>
            <TableColumn className="p-4">Capitalization</TableColumn>
            <TableColumn className="p-4">Price</TableColumn>
            <TableColumn className="p-4">Price change per day</TableColumn>
            <TableColumn className="p-4">Price change per month</TableColumn>
          </TableHeader>
          <TableBody>
            {stocks.map((stock, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{stock.symbolInfo.symbol}</TableCell>
                <TableCell>{stock.symbolInfo.description}</TableCell>
                <TableCell>{stock.quote.t} $</TableCell>
                <TableCell>
                  {`${stock.quote.c} ${stock.symbolInfo.currency}`}
                </TableCell>
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
                <TableCell
                  style={{
                    color:
                      stock.quote.d >= 0
                        ? "rgba(20, 255, 82, 1)"
                        : "rgba(244, 28, 28, 1)",
                  }}
                >
                  {stock.quote.d}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      stock.quote.dp >= 0
                        ? "rgba(20, 255, 82, 1)"
                        : "rgba(244, 28, 28, 1)",
                  }}
                >
                  {stock.quote.dp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>No stocks found.</div>
      )}
<<<<<<< HEAD

      {totalPages > 1 && (
        <div className="pagination mt-6 flex gap-2 justify-center">
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs text-white
            hover:bg-blue-500 hover:text-white transition-all`}
            onClick={() =>
              currentPage > 1 ? handlePageChange(currentPage - 1) : null
            }
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs text-white
                    ${currentPage === index + 1 ? "bg-blue-600" : ""}
                    hover:bg-blue-500 hover:text-white transition-all`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs text-white
            hover:bg-blue-500 hover:text-white transition-all`}
            onClick={() =>
              currentPage < 3 ? handlePageChange(currentPage + 1) : null
            }
          >
            {">"}
          </button>
        </div>
      )}
=======
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
    </div>
  );
}
