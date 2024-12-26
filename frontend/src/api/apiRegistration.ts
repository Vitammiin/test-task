import axios from 'axios';

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
    const response = await axios.post('/api/register', {
      email,
      password,
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Registration failed' };
    }
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
