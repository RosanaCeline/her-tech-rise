import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const saveUser = (data, remember) => {
  const payload = JSON.stringify({ ...data, remember: !!remember });
  if (remember) {
    localStorage.setItem('user', payload);
  } else {
    sessionStorage.setItem('user', payload);
  }
};

export const updateStoredUser = (changes) => {
  const storage = localStorage.getItem('user') ? localStorage : sessionStorage.getItem('user') ? sessionStorage : null;
  if (!storage) return null;
  const current = JSON.parse(storage.getItem('user'));
  const updated = { ...current, ...(typeof changes === 'function' ? changes(current) : changes) };
  storage.setItem('user', JSON.stringify(updated));
  return updated;
};

export const login = async (email, senha, remember) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password: senha, rememberMe: !!remember });
    saveUser(response.data, remember);
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    if (!error?.response) throw new Error('Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.');
    if (status === 403) throw new Error(error.response.data?.message || 'Conta desativada.');
    if (status === 429) throw new Error(error.response.data?.message || 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    if (status >= 500) throw new Error('Erro no servidor. Tente novamente em instantes.');
    throw new Error('E-mail ou senha incorretos.');
  }
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
        consentGenderSharing: formData.consentGenderSharing,
        gender: formData.gender
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
    saveUser(response.data, false);
    return response.data;
  }
  throw new Error('Erro ao registrar usuário'); 
}

export const getCurrentUser = () => {
  const local = localStorage.getItem('user');
  const session = sessionStorage.getItem('user');

  return local
    ? JSON.parse(local)
    : session
    ? JSON.parse(session)
    : null;
};

export const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
}

export const decodeToken = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

/** quantos minutos faltam para o token expirar (se negativo = já expirou) */
export const getTokenRemainingMs = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return -1;
  return payload.exp * 1000 - Date.now();
};

/** diz se o token já expirou ou é inválido */
export const isTokenExpired = (token) => {
  return getTokenRemainingMs(token) <= 0;
};

const resetErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (!error?.response) return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';
  if (status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if (status >= 500) return 'Erro no servidor. Tente novamente em instantes.';
  return error.response.data?.message || fallback;
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resetPassword`, { email });
    return response.data;
  } catch (error) {
    throw new Error(resetErrorMessage(error, 'Não foi possível enviar o pedido. Tente novamente.'));
  }
}

export const newPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/confirmedResetPassword`, {token, newPassword})
    return response.data
  } catch (error) {
    throw new Error(resetErrorMessage(error, 'Link de redefinição inválido ou expirado. Solicite um novo.'));
  }
}

export const verifyCPF = async (cpf) => {
  const response = await axios.get(`${API_URL}/cpf?cpf=${cpf}`, {validateStatus: (status) => status < 500})
  return response.status === 204 ? true : response.status === 409 ? false : null
}

export const verifyCNPJ = async (cnpj) => {
  const response = await axios.get(`${API_URL}/cnpj?cnpj=${cnpj}`, {validateStatus: (status) => status < 500})
  return response.status === 204 ? true : response.status === 409 ? false : null
}

export const getGender = () => {
  const saved = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!saved) return null;
  const parsed = JSON.parse(saved);
  return parsed?.gender ?? null;
}

export const updateGender = (gender, consentGenderSharing) => {
  updateStoredUser({
    gender: consentGenderSharing === false ? null : gender,
    consentGenderSharing,
  });
}