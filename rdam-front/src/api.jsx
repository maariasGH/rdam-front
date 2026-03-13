import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

// Interceptor: intercepta la petición antes de que salga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('citizen_token');
  if (token) {
    // Aquí es donde el backend recibe el header 'Authorization'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;