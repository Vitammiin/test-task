export interface StockSymbolInfo {
  currency: string;
  description: string;
  displaySymbol: string;
  isin: string | null;
  figi: string;
  symbol: string;
}

export interface StockQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  t: number;
}

export interface StockData {
  symbolInfo: StockSymbolInfo;
  quote: StockQuote;
}

export interface StockProps {
  country: string;
  symbol: string;
}
