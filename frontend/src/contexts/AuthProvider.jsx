// src/contexts/AuthProvider.jsx
// APENAS o componente Provider
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../service/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadUser() {
    const savedToken = localStorage.getItem('@App:token');

    if (savedToken) {
      try {
        // Usa os dados frescos do backend em vez do localStorage
        const response = await api.get('/auth/me');
        const freshUser = response.data;

        // Atualiza o localStorage com os dados corretos
        localStorage.setItem('@App:user', JSON.stringify(freshUser));
        setUser(freshUser);
      } catch (error) {
        console.log('ERRO NO /auth/me:', error.response?.status, error.response?.data);
        localStorage.removeItem('@App:token');
        localStorage.removeItem('@App:user');
      }
    }
    setLoading(false);
  }
  loadUser();
}, []);

  async function signIn({ email, password }) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('@App:token', token);
      localStorage.setItem('@App:user', JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      return { success: false, message };
    }
  }

  function signOut() {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}