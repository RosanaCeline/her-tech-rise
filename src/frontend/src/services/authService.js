import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (email, senha) => {
  const response = await axios.post(`${API_URL}/login`, { email, password: senha });
  if (response.status === 200) {
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }
  throw new Error(error?.response?.data?.message || 'Erro ao realizar login');
}

export const register = async (formData) => {
  const isProfessional = formData.tipo_usuario === 'profissional';

  const payload = isProfessional
    ? {
        name: formData.nome,
        cpf: formData.cpf,
        birthDate: formData.data_nascimento,
        phoneNumber: formData.telefone,
        cep: formData.cep,
        uf: formData.estado,
        city: formData.cidade,
        street: formData.rua,
        neighborhood: formData.bairro,
        email: formData.email,
        password: formData.senha,
      }
    : {
        name: formData.nome,
        cnpj: formData.cnpj,
        companyType: formData.tipo_empresa,
        phoneNumber: formData.telefone,
        cep: formData.cep,
        uf: formData.estado,
        city: formData.cidade,
        street: formData.rua,
        neighborhood: formData.bairro,
        email: formData.email,
        password: formData.senha,
      };

  const endpoint = isProfessional ? '/register/professional' : '/register/company';
  const response = await axios.post(`${API_URL}${endpoint}`, payload);

  if (response.status === 201) {
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }
  throw new Error('Erro ao registrar usuário'); 
}

export const getCurrentUser = () => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

export const logout = () => {
  localStorage.clear()
  window.location.reload()
}

export const resetPassword = async (email) => {
  const response = await axios.post(`${API_URL}/resetPassword`, { email });
  return response.data;
}

export const newPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/confirmedResetPassword`, {token, newPassword})
  return response.data
}