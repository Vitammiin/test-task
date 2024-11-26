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

  useEffect(() => {
    const getData = async () => {
      setStocks([]);
      setLoading(true);
      const data = await getStock(country, symbol);
      if (data) {
        setStocks([data]);
      }
      setLoading(false);
    };

    if (country && symbol) {
      getData();
    }
  }, [country, symbol]);

  return (
    <div className="mt-[86px]">
      {loading ? (
        <div>Loading...</div>
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
    </div>
  );
}
