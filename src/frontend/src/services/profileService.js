import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = 'http://localhost:8080/api/profiles'; 
const user = getCurrentUser()

export const myProfile = async () => {
    const url = user.role === 'PROFESSIONAL' ? `${API_URL}/professionals/me` : `${API_URL}/companies/me`;
    const response = await axios.get(url, {headers: {Authorization: `Bearer ${user.token}`}})
    return response.data
}

export const getCompanyProfile = async (id) => {
    const url = `${API_URL}/companies/${id}`;
    const response = await axios.get(url, {headers: {Authorization: `Bearer ${user.token}`}})
    return response.data
}

export const getProfessionalProfile = async (id) => {
    const url = `${API_URL}/professionals/${id}`;
    const response = await axios.get(url, {headers: {Authorization: `Bearer ${user.token}`}})
    return response.data
}