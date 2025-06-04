import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface AuthResponse {
  _id: string;
  username: string;
  token: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthResponse | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};