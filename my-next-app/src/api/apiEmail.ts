import axios from "axios";

export const postEmail = async (email: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/emails", {
      email: `${email}`,
    });
    if (response && response.data) {
<<<<<<< HEAD
      return response.data;
=======
      return response.data.token;
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
    }
  } catch (error) {
    console.error("POST Email error", error);
  }
};
