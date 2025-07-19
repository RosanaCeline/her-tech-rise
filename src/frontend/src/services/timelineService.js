import { getCurrentUser } from "./authService";

export const newPost = async (formData) => {
  const token = getCurrentUser().token;
  const fd = new FormData()
  fd.append('content', formData.content);
  fd.append('visibility', formData.visibility);

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
      const response = await fetch(`http://localhost:8080/api/post`, config);

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