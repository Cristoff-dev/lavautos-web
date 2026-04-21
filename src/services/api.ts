import axios from 'axios';

// Apuntamos al prefijo que definimos en tu app.js del backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api/lavautos',
  withCredentials: true, // Importante si usas cookies/sesiones
});

// Interceptor para incluir el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;