/**
 * Gerencia chamadas à API de autenticação
 */

import { getCurrentUser } from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL;

export const requestService = {
  async apiRequest(endpoint, method = "GET", data = null) {
    const token = getCurrentUser().token;

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