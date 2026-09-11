import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar autenticacao HTTP Basic em todas as requisicoes
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('basic_auth');
    if (storedAuth) {
      config.headers.Authorization = `Basic ${storedAuth}`;
    } else {
      // Fallback seguro com as credenciais padrao
      config.headers.Authorization = `Basic ${btoa('admin:admin')}`;
    }
  } else {
    config.headers.Authorization = `Basic ${btoa('admin:admin')}`;
  }
  return config;
});

// Interceptor para tratamento de 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('basic_auth');
        localStorage.removeItem('usuario_logado');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);