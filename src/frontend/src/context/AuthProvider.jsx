import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService';
import { updateProfile as updateProfileService } from '../services/userService';
import { AuthContext } from './AuthContext';
import { requestService } from '../services/requestService';

function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    requestService.setUnauthorizedHandler(() => {
      logoutService();
      setUser(null);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // guarda token e atualiza user
  const login = async (email, senha, remember) => {
    try {
      const userData = await loginService(email, senha, remember);
      setUser(userData);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  }

  // remove token e limpa user
  const logout = () => {
    logoutService();
    setUser(null);
    navigate('/login', { replace: true });
  }

  const updateProfile = async (updatedData) => {
    try {
      const userUpdated = await updateProfileService(updatedData);
      setUser(userUpdated);
      return userUpdated;
    } 
    catch (error) {
        console.error('Erro na atualização de perfil:', error.message);
        throw new Error(error.message || 'Erro ao atualizar perfil')
    }
  }

  return { user, login, logout, updateProfile, setUser, loading };
}

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};