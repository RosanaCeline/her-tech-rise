import { getCurrentUser } from "./authService";
import { requestService } from "./requestService";

const baseUrl = import.meta.env.VITE_API_URL;

export const newPost = async (formData) => {
  const token = getCurrentUser().token;
  const fd = new FormData()

  const PostVisibility = {
      public: 'PUBLICO',
      private: 'PRIVADO',
  }

  fd.append('content', formData.content);
  fd.append('visibility', PostVisibility[formData.visibility] || "PUBLICO");

  formData.media.forEach((file) => {
    fd.append('media', file);
  });

  const config = {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${token}`,
    },
    body: fd,
    credentials: "include",
    };

  try{
      const response = await fetch(`${baseUrl}/api/post`, config);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Erro desconhecido");

        error.status = response.status;
        error.backendMessage = errorData.message;

        throw error;
      }

      return await response.json();
  }catch(error){
    console.error('API request error:', error);
    throw error;
  }
}

// Erro por enquanto
export const updatePostVisibility = async (postId, visibility) => {
  const visibilityUpper = visibility.toUpperCase();
  return await requestService.apiRequest(`/post/${postId}/visibility?visibility=${visibilityUpper}`, 'PATCH');
}

// Funcionando
export const deletePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}`, 'DELETE');
}

// Nao implementado
export const updatePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}`, 'PUT');
}