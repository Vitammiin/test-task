'use client';

import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Table,
  Input,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
} from '@nextui-org/react';

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [symbolFilter, setSymbolFilter] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    // Fetch stock data from backend API
    const response = await fetch('/api/stocks');
    const data = await response.json();
    setStocks(data);
    setFilteredStocks(data);
    setCountries(['All', ...new Set(data.map((stock) => stock.country))]);
  };

  const filterStocks = () => {
    let filtered = stocks;
    if (selectedCountry !== 'All') {
      filtered = filtered.filter((stock) => stock.country === selectedCountry);
    }
    if (symbolFilter) {
      filtered = filtered.filter((stock) =>
        stock.symbol.toLowerCase().includes(symbolFilter.toLowerCase()),
      );
    }
    setFilteredStocks(filtered);
  };

  useEffect(() => {
    filterStocks();
  }, [selectedCountry, symbolFilter]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'marketCap', label: 'Market Cap' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change' },
  ];

  return (
    <div>
      <div className="filters">
        <Dropdown>
          <Button>{selectedCountry}</Button>
          <DropdownMenu
            aria-label="Country selection"
            onAction={(key) => setSelectedCountry(key.toString())}
          >
            {countries.map((country) => (
              <DropdownItem key={country}>{country}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Input
          className="mb-[27px] rounded-lg border border-gray-600 bg pl-4.5 pr-4.5 py-1.5 text-white placeholder-gray-400 !focus:ring !focus:ring-blue-500 !focus:outline-none"
          placeholder="Enter your country"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
        />
        <Input
          className="rounded-lg border border-gray-600 bg-gray-800 pl-4.5 pr-4.5 py-1.5 text-white placeholder-gray-400 !focus:ring !focus:ring-blue-500 !focus:outline-none"
          placeholder="Enter symbol or name"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
        />
      </div>
      {/* <Table
        aria-label="Stock data table"
        css={{ height: 'auto', minWidth: '100%' }}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </Table.Header>
        <TableBody items={filteredStocks}>
          {(item) => (
            <TableRow key={item.symbol}>
              {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </div>
  );
};

export default StockPage;
