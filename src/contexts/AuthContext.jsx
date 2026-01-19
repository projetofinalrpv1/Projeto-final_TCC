import { createContext, useState, useEffect } from 'react';

// Exportamos apenas o Contexto (para o Hook usar) e o Provider
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@App:user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('@App:user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@App:user');
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}