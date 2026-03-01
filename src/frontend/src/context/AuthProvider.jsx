import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'

import { login as loginService, logout as logoutService, getCurrentUser, isTokenExpired, getTokenRemainingMs } from '../services/authService';
import { updateProfile as updateProfileService } from '../services/userService';
import { AuthContext } from './AuthContext';
import { requestService } from '../services/requestService';

const WARN_BEFORE_MS = 10 * 60 * 1000;

function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const navigate = useNavigate();

  const doLogout = useCallback((expired = false) => {
    logoutService();
    setUser(null);
    setSessionWarning(false);
    navigate('/login', {
      replace: true,
      state: expired ? { expired: true } : undefined,
    });
  }, [navigate]);

  useEffect(() => {
    requestService.setUnauthorizedHandler(() => doLogout(true));
  }, [doLogout]);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      if (isTokenExpired(storedUser.token)) {
        logoutService();
        setLoading(false);
        navigate('/login', { replace: true, state: { expired: true } });
        return;
      }
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

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

  useEffect(() => {
    if (!user?.token) return;

    const remainingMs = getTokenRemainingMs(user.token);
    if (remainingMs <= 0) {
      doLogout(true);
      return;
    }

    // avisa 10 min antes
    const warnIn = remainingMs - WARN_BEFORE_MS;
    let warnTimer = null;
    if (warnIn > 0) {
      warnTimer = setTimeout(() => setSessionWarning(true), warnIn);
    } else {
      // já está dentro da janela de aviso
      setSessionWarning(true);
    }

    // logout automático quando expirar
    const logoutTimer = setTimeout(() => doLogout(true), remainingMs);

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
    };
  }, [user?.token, doLogout]);

  // guarda token e atualiza user
  const login = async (email, senha, remember) => {
    try {
      const userData = await loginService(email, senha, remember);
      setUser(userData);
      setSessionWarning(false);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  }

  const logout = () => doLogout(false);

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

  return { user, login, logout, updateProfile, setUser, loading, sessionWarning, dismissWarning: () => setSessionWarning(false), };
}

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};