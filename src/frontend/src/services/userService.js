import { requestService } from "./requestService";
import { getCurrentUser } from './authService';

const baseUrl = import.meta.env.VITE_API_URL;

export const getProfileById = async (user_id, role) => {
  if (role === 'company') {
    return await requestService.apiRequest(`/profiles/companies/${user_id}`, 'GET');
  }
  else if (role === 'professional') {
    return await requestService.apiRequest(`/profiles/professionals/${user_id}`, 'GET');
  }
  return console.log('ById: Sem user no local-storage.')
};

export const getAllProfile = async () => {
  const user = getCurrentUser();
  const role = user?.role;
  if (role === 'COMPANY') {
    return await requestService.apiRequest("/profiles/companies/me", "GET");
  }
  else if (role === 'PROFESSIONAL') {
    return await requestService.apiRequest("/profiles/professionals/me", "GET");
  }
  return console.log('GetAll: Sem user no localstorage.')  
};

export const updateProfile = async (data) => {
  const user = getCurrentUser();
  const role = user?.role;
  
  if (role === 'COMPANY') {
    return await requestService.apiRequest(`/profiles/companies/update`, 'PUT', data);
  } else if (role === 'PROFESSIONAL') {
    return await requestService.apiRequest(`/profiles/professionals/update`, 'PUT', data);
  }
  return console.log('Update: Sem user no local-storage.')
};

export const changeProfilePicture = async (photo) => {
  const token = getCurrentUser().token;
  const fd = new FormData()
  fd.append('file', photo);

  const config = {
    method: "PUT",
    headers: {
        "Authorization": `Bearer ${token}`,
    },
    body: fd,
    credentials: "include",
    };

  try{
      const response = await fetch(`${baseUrl}/api/users/profile-picture`, config);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Erro desconhecido");

        error.status = response.status;
        error.backendMessage = errorData.message;

        throw error;
      }

      const result = await response.json()
      return result
  }catch(error){
    console.error('API request error:', error);
    throw error;
  }
}

export const followUser = async(id) => {
    return await requestService.apiRequest(`/follows`, 'POST', {id: id});
}

export const unfollowUser = async(id) => {
    return await requestService.apiRequest(`/follows`, 'DELETE', {id: id});
}

export const verifyFollowUser = async(id) => {
    return await requestService.apiRequest(`/follows/verifyFollow/${id}`, 'GET');
}