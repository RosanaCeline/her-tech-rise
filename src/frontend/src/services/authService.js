import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; 

// Verifique a documentacao do back em http://localhost:8080/swagger-ui/index.html

// Dados mockados (teste)
import mockUsers from '../mocks/mockUsers';
let users = [...mockUsers];

export const login = async (email, senha) => {
  const response = await axios.post(`${API_URL}/login`, { email, password: senha });
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;

  // Mocked response for testing
  /*
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
  */
}

export const register = async (formData) => {
  if(formData.tipo_usuario == 'profissional'){
    const professional = {
      name:         formData.nome,
      cpf:          formData.cpf,
      birthDate:    formData.data_nascimento,
      phoneNumber:  formData.telefone,
      cep:          formData.cep,
      city:         formData.cidade,
      street:       formData.rua,
      neighborhood: formData.bairro,
      email:        formData.email,
      password:     formData.senha
    }
    const response = await axios.post(`${API_URL}/register/professional`, professional)
    if(response.status === 201)
      localStorage.setItem('user', JSON.stringify(response.data));
  }else{
    const company = {
      name:         formData.nome,
      cnpj:         formData.cnpj,
      companyType:  formData.tipo_empresa,
      phoneNumber:  formData.telefone,
      cep:          formData.cep,
      city:         formData.cidade,
      street:       formData.rua,
      neighborhood: formData.bairro,
      email:        formData.email,
      password:     formData.senha
    }
    const response = await axios.post(`${API_URL}/register/company`, company)
     if(response.status === 201)
      localStorage.setItem('user', JSON.stringify(response.data));
  }
}

export const getCurrentUser = () => {
  // const token = localStorage.getItem('token');
  // if (!token) return null;
  // return JSON.parse(atob(token.split('.')[1])); // JWT

  // Mocked response for testing
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

export const logout = () => {
  // localStorage.removeItem('token');

  // Mocked response for testing
  localStorage.removeItem('user');
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
  const saved = localStorage.getItem('user');
  if (!saved) throw new Error('Usuário não autenticado');
  let user = JSON.parse(saved);
  user = { ...user, ...updatedData };
  localStorage.setItem('user', JSON.stringify(user));
  return user; 
}
