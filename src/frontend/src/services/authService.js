import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; 

// Dados mockados (teste)
import mockUsers from '../mocks/mockUsers';
let users = [...mockUsers];

export const login = async (email, senha) => {
  // const response = await axios.post(`${API_URL}/login`, { email, senha });
  // return response.data;

  // Mocked response for testing
  const user = users.find(u => u.email === email && u.senha === senha);
  if (!user) throw new Error('Email ou senha inválidos');
  const token = 'fake.jwt.token';
  const fullUser = {
    ...(user.dados || {}),
    ...(user.perfil || {}),
    email: user.email,
    tipo_usuario: user.dados?.tipo_usuario || user.tipo_usuario
  }
  console.log('👤 Usuário completo após login:', fullUser); 
  localStorage.setItem('mockUser', JSON.stringify(fullUser));
  return { token, user: fullUser };
}

export const register = async (formData) => {
  // const response = await axios.post(`${API_URL}/register`, formData);
  // return response.data;

  // Mocked response for testing
  console.log('Dados do cadastro:', formData);
  const { email } = formData;
  const exists = users.some(u => u.email === email);
  if (exists) throw new Error('Usuário já cadastrado (mock)');
  return { success: true, message: 'Usuário cadastrado com sucesso (mock)' };
}

export const getCurrentUser = () => {
  // const token = localStorage.getItem('token');
  // if (!token) return null;
  // return JSON.parse(atob(token.split('.')[1])); // JWT

  // Mocked response for testing
  const saved = localStorage.getItem('mockUser');
  return saved ? JSON.parse(saved) : null;
}

export const logout = () => {
  // localStorage.removeItem('token');

  // Mocked response for testing
  localStorage.removeItem('mockUser');
}

export const resetPassword = async (email) => {
  // const response = await axios.post(`${API_URL}/resetpassword`, { email });
  // return response.data;

  // Mocked response for testing
  const found = users.find(u => u.email === email);
  if (!found) throw new Error("Usuário não encontrado");
  return { success: true, message: "Email de recuperação enviado (mock)" };
}

export const updateProfile = async (updatedData) => {
  // const response = await axios.put(`${API_URL}/usuario/perfil`, updatedData);
  // return response.data;

  // Mocked response for testing
  const saved = localStorage.getItem('mockUser');
  if (!saved) throw new Error('Usuário não autenticado');
  let user = JSON.parse(saved);
  user = { ...user, ...updatedData };
  localStorage.setItem('mockUser', JSON.stringify(user));
  return user; 
}
