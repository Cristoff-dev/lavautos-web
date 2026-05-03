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
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar 401 (token expirado o inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login'; // Redirigir a login
    }
    return Promise.reject(error);
  }
);

export default api;