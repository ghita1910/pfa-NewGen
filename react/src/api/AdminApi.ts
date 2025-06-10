import axios from 'axios';

export const adminLogin = async (email: string, password: string) => {
  const response = await axios.post(`http://localhost:5173/admin/signin`, {
    email,
    password,
  });
  return response.data;
};
