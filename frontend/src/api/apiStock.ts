import axios from 'axios';

export const getStock = async (country: string, symbol: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:3001/stock?country=${country}&symbol=${symbol}`,
    );
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('GET Stock error', error);
  }
};

export const getAllStock = async (country: string, symbols: string[]) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:3001/stocks?country=${country}&symbols=${symbols.join(',')}`,
    );
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('GET All Stock error', error);
  }
};
