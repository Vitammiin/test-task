import axios from "axios";

export const getStock = async (country: string, symbol: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/stock?country=${country}&symbol=${symbol}`
    );
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("GET Stock error", error);
  }
};