import { getCurrentUser } from "./authService";
import { requestService } from "./requestService";

const baseUrl = import.meta.env.VITE_API_URL;
let isPosting = false;

export const newPost = async (formData) => {

  if (isPosting) return; 
  isPosting = true;

  try{

  const token = getCurrentUser().token;
  const fd = new FormData()

  formData.media.forEach((file) => {
    fd.append('mediaFiles', file);
  });

  const params = new URLSearchParams();
  if(formData.content) params.append('content', formData.content);
  if(formData.visibility) params.append('visibility', formData.visibility);
  if(formData.idCommunity) params.append('idCommunity', formData.idCommunity);

  const response = await fetch(
    `${baseUrl}/api/post?${params.toString()}`,
      {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${token}`,
    },
    body: fd,
    credentials: "include",
    }
  );

      if (!response.ok) {
          const text = await response.text();
          const error = new Error(text || "Erro desconhecido");
        error.status = response.status;
        throw error;
      }

      return await response.json();
  }catch(error){
    console.error('API request error:', error);
    throw error;
  }finally {
    isPosting = false;
  }
}

export const updatePostVisibility = async (postId, visibility) => {
  const visibilityUpper = visibility.toUpperCase();
  return await requestService.apiRequest(`/post/${postId}/visibility?visibility=${visibilityUpper}`, 'PATCH');
}

export const deletePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}`, 'DELETE');
}

export const updatePost = async (postId, data) => {
  const formData = new FormData();

  const jsonBlob = new Blob(
    [JSON.stringify({
      content: data.content,
      visibility: data.visibility,
      medias: data.medias,
    })],
    { type: 'application/json' }
  );

  formData.append('data', jsonBlob);

  if (data.newFiles && data.newFiles.length) {
    data.newFiles.forEach(file => {
      formData.append('newFiles', file);
    });
  }
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  const res = await requestService.apiRequest(`/post/${postId}`, 'PUT', formData);
  console.log(res)
  return res
};


export const getTimelinePosts = async (page = 0, size = 5) => {
  return await requestService.apiRequest(`/post/timeline?page=${page}&size=${size}&orderBy=createdAt&direction=DESC`,'GET');
}