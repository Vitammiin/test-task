import axios from 'axios';

export const getStock = async (country: string, symbol: string) => {
  try {
    const response = await axios.get(
      `https://audio-recorder-backend-plno.onrender.com/stock?country=${country}&symbol=${symbol}`,
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
      `https://audio-recorder-backend-plno.onrender.com/stocks?country=${country}&symbols=${symbols.join(',')}`,
    );
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('GET All Stock error', error);
  }
};
