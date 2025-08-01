import { requestService } from "./requestService";
import { getCurrentUser } from "./authService";

const baseUrl = import.meta.env.VITE_API_URL;

export const getCountInteractionsPost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/interactions/count`, 'GET');
}

// Deu certo
export const sendLikePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/like`, 'POST');
}

export const sendCommentPost = async (postId, content, parentCommentId) => {
  return await requestService.apiRequest(`/post/${postId}/comment`, 'POST');
}

// Deu certo
export const sendSharePost = async (postId, content) => {
  return await requestService.apiRequest(`/post/${postId}/share`, 'POST', {content});
}

// Tentando
export const getLikesPost = async (postId) => {
  // const res =  await requestService.apiRequest(`/post/${postId}/likes`, 'GET');
  // return Array.isArray(res) ? res : res ? [res] : [];
  return [
    {
      id: 34,
      userId: 4,
      userName: "Lais Carvalho Coutinho",
      userAvatarUrl:
        "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      createdAt: "2025-08-01T10:08:00",
    },
    {
      id: 35,
      userId: 7,
      userName: "Maria Souza",
      userAvatarUrl:
        "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_7.png",
      createdAt: "2025-08-01T10:15:00",
    },
  ];
};

export const getCommentsPost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/comments`, 'GET');
}

export const deleteCommentsPost = async (commentId) => {
  return await requestService.apiRequest(`/post/comment/${commentId}`, 'DELETE');
}