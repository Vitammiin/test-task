import axios from 'axios';

// const handleConfirmPasswordSubmit = async () => {
//   if (!confirmPassword.length || confirmPassword !== password) {
//     setIsConfirmPasswordValid(false);
//     return;
//   }
//   setIsConfirmPasswordValid(true);

//   try {
//     const response = await axios.post('/api/register', {
//       email,
//       password,
//     });

//     if (response.status === 200) {
//       console.log('Registration successful');
//       // Здесь можно добавить логику для перенаправления пользователя или отображения сообщения об успешной регистрации
//     }
//   } catch (error) {
//     console.error(
//       'Registration failed:',
//       error.response?.data || error.message,
//     );
//     // Здесь можно добавить логику для отображения ошибки пользователю
//   }
// };

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
