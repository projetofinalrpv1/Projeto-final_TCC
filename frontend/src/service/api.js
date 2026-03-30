// src/service/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

// Interceptor de REQUEST: injeta o token em toda requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag para evitar múltiplos redirecionamentos simultâneos
let isRedirecting = false;

// Interceptor de RESPONSE: trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Só redireciona pro login se:
    // 1. O erro for 401 (token inválido/expirado)
    // 2. NÃO for a rota de login (evita loop)
    // 3. Não estiver já redirecionando
    const isLoginRoute = error.config?.url?.includes('/auth/login');

    if (status === 401 && !isLoginRoute && !isRedirecting) {
      isRedirecting = true;

      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');

      // Pequeno delay para não cortar requisições em andamento
      setTimeout(() => {
        window.location.href = '/';
        isRedirecting = false;
      }, 100);
    }

    return Promise.reject(error);
  }
);

export default api;