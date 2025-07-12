import { requestService } from "./requestService";
import { getCurrentUser } from './authService';

export const getProfileById = async () => {
  const user = getCurrentUser();
  const role = user?.role;
  if (role === 'COMPANY') {
    return await requestService.apiRequest(`/profiles/companies/${user.id}`, 'GET');
  }
  else if (role === 'PROFESSIONAL') {
    return await requestService.apiRequest(`/profiles/professionals/${user.id}`, 'GET');
  }
  return console.log('Sem user no localstorage.')
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
  return console.log('Sem user no localstorage.')  
};

export const updateProfile = async (data) => {
  const user = getCurrentUser();
  const role = user?.role;

  if (role === 'COMPANY') {
    await requestService.apiRequest(`/profiles/companies/update`, 'PUT', data);
    return await getProfileById(); 
  } else if (role === 'PROFESSIONAL') {
    await requestService.apiRequest(`/profiles/professionals/update`, 'PUT', data);
    return await getProfileById();  
  }
};