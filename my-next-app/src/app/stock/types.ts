export interface StockSymbolInfo {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  isin: string | null;
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

export interface SotckProp {
  country: string;
  symbol: string;
}