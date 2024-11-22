import axios from "axios";

export const getAudio = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/audio");
    if (response && response.data) {
      console.log(response.data);
    }
  } catch (error) {
    console.error("Get Audio error", error);
  }
};

export const postAudio = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/audio", {
      audio: "first",
    });
    if (response && response.data) {
      console.log(response.data);
    }
  } catch (error) {
    console.error("POST Audio error", error);
  }
};
