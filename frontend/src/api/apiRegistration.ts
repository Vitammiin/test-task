import axios from 'axios';

axios.defaults.baseURL = process.env.APP_BACKEND_URL || 'http://localhost:3001';

interface RegisterUserResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const registerUser = async (
  email: string,
  password: string,
): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post('/register', {
      email,
      password,
    });

    if (response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Registration failed' };
    }
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
