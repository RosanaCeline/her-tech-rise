import { requestService } from "./requestService";

export const searchUsers = async (query) => {
    return await requestService.apiRequest(`/listing?q=${query}`, 'GET');
}

export const searchProfessionals = async (query, page) => {
    return await requestService.apiRequest(`/listing/professionals?q=${query}&page=${page}&size=10`, 'GET');
}

export const searchCompanies = async (query, page) => {
    return await requestService.apiRequest(`/listing/companies?q=${query}&page=${page}&size=1`, 'GET');
}