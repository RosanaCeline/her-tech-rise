/**
 * Gerencia chamadas à API de autenticação
 */

import { getCurrentUser } from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL;

let unauthorizedHandler = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  window.location.replace('/hertechrise/login');
};

export const requestService = {

  setUnauthorizedHandler(fn) {
    unauthorizedHandler = fn;
  },

  async apiRequest(endpoint, method = "GET", data = null) {
    const currentUser = getCurrentUser();
    if (!currentUser?.token) {
      unauthorizedHandler();
      return;
    }

    const token = currentUser.token;
    const isFormData = data instanceof FormData;
    const config = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      credentials: "include",
      body: data ? (isFormData ? data : JSON.stringify(data)) : null,
    };

    try {
      const response = await fetch(`${BASE_URL}/api${endpoint}`, config);

      if (!response.ok) {

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          unauthorizedHandler();
          return;
        }

        let errorMessage = "Erro desconhecido";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error('API request error:', err);
          throw err;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }
      const contentType = response.headers.get("content-type");
      if (response.status === 204 || !contentType || !contentType.includes("application/json")) return null;
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
};