import { requestService } from "./requestService";

export const getCountInteractionsPost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/interactions/count`, 'GET');
}

export const sendLikePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/like`, 'POST');
}

// Tentando
export const sendCommentPost = async (postId, { content }) => {
  console.log("sendCommentPost chamado:", postId, content);
  return await requestService.apiRequest(`/post/${postId}/comment`, 'POST');
}

export const sendSharePost = async (postId, content) => {
  return await requestService.apiRequest(`/post/${postId}/share`, 'POST', {content});
}

// Tentando
export const getLikesPost = async (postId) => {
  // const res =  await requestService.apiRequest(`/post/${postId}/likes`, 'GET');
  // return Array.isArray(res) ? res : res ? [res] : [];
  console.log("🔹 Mock getLikesPost chamado:", postId);
  return [
    {
      id: 5,
      userId: 7,
      userName: "Ana Silva",
      userAvatarUrl: "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      userId: 7,
      userName: "Carlos Souza",
      userAvatarUrl: "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      createdAt: new Date().toISOString(),
    },
  ];
};

// Tentando
export const getCommentsPost = async (postId) => {
  // return await requestService.apiRequest(`/post/${postId}/comments`, 'GET');
  console.log("🔹 Mock getCommentsPost chamado:", postId);
  return [
    {
      id: 1,
      userId: 7,
      userName: "Maria Oliveira",
      userAvatarUrl: "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      content: "Achei esse post muito interessante!",
      edited: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 2,
      userId: 7,
      userName: "João Pedro",
      userAvatarUrl: "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      content: "Concordo totalmente com o que foi dito.",
      edited: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 3,
      userId: 7,
      userName: "Fernanda Lima",
      userAvatarUrl: "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
      content: "Alguém tem mais informações sobre esse tema?",
      edited: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ];
}

export const deleteCommentsPost = async (commentId) => {
  return await requestService.apiRequest(`/post/comment/${commentId}`, 'DELETE');
}