export interface Stock {
    symbol: string;
    name: string;
    price: number;
    currency: string;
    marketCap: number | null;
    dailyChange: number;
    monthlyChange: number;
    volume: number;
    high: number;
    low: number;
}
