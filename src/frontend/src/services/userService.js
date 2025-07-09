import { requestService } from "./requestService";
import { getCurrentUser } from './authService';

export const getProfessionalById = async () => {
  const user = getCurrentUser();
  return await requestService.apiRequest(`/profiles/professionals/${user.id}`, "GET");
};

export const getAllProfessional = async () => {
//   return await requestService.apiRequest("/api/profiles/professionals/me", "GET");
};

export const updateProfessionalProfile = async (data) => {
  return await requestService.apiRequest("/api/profiles/professionals/update", "PUT", data);
};