import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService';
import { updateProfessionalProfile } from '../services/userService';

const AuthContext = createContext();

export function useAuthProvider() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setUser(current);
  }, [])

  // guarda token e atualiza user
  const login = async (email, senha) => {
    try {
      await loginService(email, senha);
      setUser(getCurrentUser());
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  }

  // remove token e limpa user
  const logout = () => {
    logoutService();
    setUser(null);
  }

  const updateProfile = async (updatedData) => {
    try {
      console.log('Dados enviados para atualização:', updatedData); 
      const userUpdated = await updateProfessionalProfile(updatedData);
      console.log('Dados após atualização:', userUpdated); 
      setUser(userUpdated);
      return userUpdated;
    } 
    catch (error) {
        console.error('Erro na atualização de perfil:', error.message);
        throw new Error(error.message || 'Erro ao atualizar perfil')
    }
  }

  return { user, login, logout, updateProfile, setUser };
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
