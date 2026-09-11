import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token JWT (Bearer) em todas as requisições
api.interceptors.request.use((config) => {
  // Se a requisição já possui Authorization definida explicitamente, mantém
  if (config.headers.Authorization) {
    return config;
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratamento de 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('usuario_logado');
        localStorage.removeItem('basic_auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);