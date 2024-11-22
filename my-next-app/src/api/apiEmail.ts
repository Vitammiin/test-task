import axios from "axios";

export const postEmail = async (email: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/emails", {
      email: `${email}`,
    });
    if (response && response.data) {
      return response.data.token;
    }
  } catch (error) {
    console.error("POST Email error", error);
  }
};
