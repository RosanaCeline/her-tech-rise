import { getCurrentUser } from "./authService";
import { requestService } from "./requestService";

const baseUrl = import.meta.env.VITE_API_URL;

export const newPost = async (formData) => {
  const token = getCurrentUser().token;
  const fd = new FormData()

  formData.media.forEach((file) => {
    fd.append('mediaFiles', file);
  });

  const params = new URLSearchParams();
  if(formData.content) params.append('content', formData.content);
  if(formData.visibility) params.append('visibility', formData.visibility);
  if(formData.idCommunity) params.append('idCommunity', formData.idCommunity);

  const config = {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${token}`,
    },
    body: fd,
    credentials: "include",
  };

  try{
      const response = await fetch(`${baseUrl}/api/post?${params.toString()}`, config);

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

export const updatePostVisibility = async (postId, visibility) => {
  const visibilityUpper = visibility.toUpperCase();
  return await requestService.apiRequest(`/post/${postId}/visibility?visibility=${visibilityUpper}`, 'PATCH');
}

export const deletePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}`, 'DELETE');
}

// Erro
export const updatePost = async (postId, data) => {
  console.log(getCurrentUser().token, postId, data)
  const formData = new FormData();

  formData.append('data', JSON.stringify({
    content: data.content,
    visibility: data.visibility,
    medias: data.medias,
  }));

  if (data.newFiles && data.newFiles.length) {
    data.newFiles.forEach(file => {
      formData.append('newFiles', file);
    });
  }

  return await requestService.apiRequest(`/post/${postId}`, 'PUT', formData);
};


export const getTimelinePosts = async (page = 0, size = 20) => {
  return await requestService.apiRequest(`/post/timeline?page=${page}&size=${size}&orderBy=createdAt&direction=DESC`,'GET');
}