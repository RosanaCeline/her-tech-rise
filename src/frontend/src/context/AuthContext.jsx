import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export function useAuthProvider() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setUser(current);
  }, []);

  // guarda token e atualiza user
  const login = async (email, senha) => {
    try {
      const data = await loginService(email, senha);
      localStorage.setItem('token', data.token);
      setUser(getCurrentUser());
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  // remove token e limpa user
  const logout = () => {
    logoutService();
    setUser(null);
  };

  return { user, login, logout };
}

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
