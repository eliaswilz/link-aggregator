// src/Auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getAdminData = async () => {
  try {
    const response = await authenticatedRequest.get('/api/admin');
    return response.data;
  } catch (error) {
    console.error('Failed to get admin data:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token && !isTokenExpired(token);
};

const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return false;
  }
};

export const authenticatedRequest = axios.create({
  baseURL: API_URL,
});

authenticatedRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authenticatedRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
