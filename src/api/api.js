// api.js
import axios from 'axios';
import { settings } from 'config/Config';
const api = axios.create({
  baseURL: settings.apiUrl,
  timeout: 100000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = user?.token || '';

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
