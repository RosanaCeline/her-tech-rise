import { useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService';

// Estado de Login, logout, contexto 

export function useAuthProvider() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setUser(current);
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await loginService(email, senha);
      localStorage.setItem('token', data.token);
      setUser(getCurrentUser());
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return { user, login, logout };
}
