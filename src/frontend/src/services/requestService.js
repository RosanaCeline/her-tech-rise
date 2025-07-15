/**
 * Gerencia chamadas à API de autenticação
 */

import { getCurrentUser } from "./authService";

export const requestService = {
  async apiRequest(endpoint, method = "GET", data = null) {
    const token = getCurrentUser().token;

    const config = {
        method,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    };

    if (data) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(`http://localhost:8080/api${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Erro desconhecido");

        error.status = response.status;
        error.backendMessage = errorData.message;

        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
}