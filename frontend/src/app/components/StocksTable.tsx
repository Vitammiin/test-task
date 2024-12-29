'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { getAllStock, getStock } from '@/api/apiStock';
import { StockProps, StockData } from '../(admin)/stock/stockTypes';

const StocksTable = ({ country, symbol }: StockProps) => {
  const [allStock, setAllStock] = useState<StockData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);

  const [symbols] = useState([
    'AAPL',
    'AMZN',
    'BRK-B',
    'CSCO',
    'FB',
    'GOOGL',
    'LMND',
    'META',
    'MSFT',
    'NFLX',
    'NVDA',
    'RGTI',
    'SBUX',
    'TSLA',
    'UNH',
    'V',
    'WMT',
    'WULF',
  ]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await getAllStock('US', symbols);
      if (data) {
        setAllStock(data);
        setFilteredStocks(data);
      }
      setLoading(false);
    };

    getData();
  }, [symbols]);

  useEffect(() => {
    const filterStocks = () => {
      let filtered = allStock;

      if (country) {
        filtered = filtered.filter((stock) =>
          stock.symbolInfo.symbol.toLowerCase().includes(country.toLowerCase()),
        );
      }

      if (symbol) {
        filtered = filtered.filter((stock) =>
          symbols.some(
            (s) =>
              s.toLowerCase().includes(symbol.toLowerCase()) &&
              stock.symbolInfo.symbol.toLowerCase().includes(s.toLowerCase()),
          ),
        );
      }

      setFilteredStocks(filtered);
      setCurrentPage(1);
    };

    filterStocks();
  }, [country, symbol, allStock, symbols]);

  const currentStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-[86px]">
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : currentStocks.length > 0 ? (
        <Table aria-label="Stocks Table" className="text-sm">
          <TableHeader>
            <TableColumn className="p-6 text-white">#</TableColumn>
            <TableColumn className="p-6 text-white">Symbol</TableColumn>
            <TableColumn className="p-6 text-white">Name</TableColumn>
            <TableColumn className="p-6 text-white">Capitalization</TableColumn>
            <TableColumn className="p-6 text-white">Price</TableColumn>
            <TableColumn className="p-6 text-white">
              Price change per day
            </TableColumn>
            <TableColumn className="p-6 text-white">
              Price change per month
            </TableColumn>
          </TableHeader>
          <TableBody>
            {currentStocks.map((stock, i) => (
              <TableRow key={i} className="text-white">
                <TableCell>
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </TableCell>
                <TableCell>{stock.symbolInfo.symbol}</TableCell>
                <TableCell>{stock.symbolInfo.description}</TableCell>
                <TableCell>{stock.quote.t} $</TableCell>
                <TableCell>{`${stock.quote.c} ${stock.symbolInfo.currency}`}</TableCell>
                <TableCell
                  style={{
                    color:
                      stock.quote.d >= 0
                        ? 'rgba(20, 255, 82, 1)'
                        : 'rgba(244, 28, 28, 1)',
                  }}
                >
                  {stock.quote.d >= 0
                    ? '+' + stock.quote.d + '%'
                    : stock.quote.d + '%'}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      stock.quote.dp >= 0
                        ? 'rgba(20, 255, 82, 1)'
                        : 'rgba(244, 28, 28, 1)',
                  }}
                >
                  {stock.quote.dp >= 0
                    ? '+' + stock.quote.dp + '%'
                    : stock.quote.dp + '%'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-white">No stocks found.</div>
      )}

      {totalPages > 1 && (
        <div className="pagination mt-6 flex gap-2 justify-center">
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs text-white
            hover:bg-blue-500 hover:text-white transition-all`}
            onClick={() =>
              currentPage > 1 ? handlePageChange(currentPage - 1) : null
            }
          >
            {'<'}
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs text-white
                    ${currentPage === index + 1 ? 'bg-blue-600' : ''}
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
              currentPage < totalPages
                ? handlePageChange(currentPage + 1)
                : null
            }
          >
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StocksTable;
