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
} from '@nextui-org/react';
import { useState } from 'react';

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
  return (
    <div className="text-white p-6">
      <div className="flex flex-col items-center mb-6 justify-center">
        <Input
          className="mb-[27px] rounded-lg border border-gray-600 bg pl-4.5 pr-4.5 py-1.5 text-white placeholder-gray-400 !focus:ring !focus:ring-blue-500 !focus:outline-none"
          placeholder="Enter your country"
          // value={symbol}
          // onChange={(e) => {
          //   const newValue = e.target.value;
          //   setSymbol(newValue);
          //   handleSearch(newValue);
          // }}
        />
        <Input
          className="rounded-lg border border-gray-600 bg-gray-800 pl-4.5 pr-4.5 py-1.5 text-white placeholder-gray-400 !focus:ring !focus:ring-blue-500 !focus:outline-none"
          placeholder="Enter symbol or name"
          // value={symbol}
          // onChange={(e) => {
          //   const newValue = e.target.value;
          //   setSymbol(newValue);
          //   handleSearch(newValue);
          // }}
        />
      </div>

      {/* {error && (
        <div className="mb-4 p-3 text-red-500 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )} */}

      {/* <Table
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
          
        </TableBody>
      </Table> */}

      {/* <Pagination
        total={1}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        className="mt-8 flex justify-center"
      /> */}
    </div>
  );
}
