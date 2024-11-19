import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import vantageapi from "../config/apiEndpoints";

type StockResponse = {
  name: string;
  symbol: string;
  marketCap: string;
  price: any;
  changes: number;
};
const Stock = () => {
  const [country, setCountry] = useState("");
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState<StockResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch stock data from API
  const fetchStockData = async () => {
    if (!symbol) {
      alert("Symbol is required");
      return;
    }

    setLoading(true);
    try {
      const response = await vantageapi({ country, symbol });

      setData(response);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  const columns = [
    {
      key: "stock_id",
      label: "#",
    },
    {
      key: "symbol",
      label: "Symbol",
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "marketCap",
      label: "Capitalization",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "changes",
      label: "Price change per day",
    },
    {
      key: "changes",
      label: "Price change per month",
    },
  ];
  return (
    <div>
      <div className="filters flex flex-col gap-4 max-w-[50%] mb-5 mx-auto">
        <Input
          variant={"bordered"}
          label="Enter your country"
          radius={"lg"}
          size="sm"
          classNames={{
            input: "border-white text-white focus:border-white",
            inputWrapper: ["hover:border-white", "focus: !border-white"],
          }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <Input
          variant={"bordered"}
          label="Enter symbol or name"
          radius={"lg"}
          size="sm"
          classNames={{
            input: "border-white text-white",
            inputWrapper: [
              "hover:border-default-200/70",
              "focus: !border-default-200/70",
            ],
          }}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button onClick={fetchStockData} disabled={loading}>
          {loading ? "Loading" : "Search"}
        </Button>
      </div>

      <div>
        <Table aria-label="table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} align={"center"}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data} emptyContent={"No data found!"}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Stock;
