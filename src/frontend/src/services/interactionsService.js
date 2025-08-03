import { requestService } from "./requestService";

export const getCountInteractionsPost = async (postId) => {
  console.log("getCountInteractionsPost chamado:");
  return await requestService.apiRequest(`/post/${postId}/interactions/count`, 'GET');
}

export const sendLikePost = async (postId) => {
  console.log("sendLikePost chamado:");
  // return await requestService.apiRequest(`/post/${postId}/like`, 'POST');
}

// Tentando
export const sendCommentPost = async (postId, { content }) => {
  console.log("sendCommentPost chamado:", postId, content);
  // return await requestService.apiRequest(`/post/${postId}/comment`, 'POST');
}

export const sendSharePost = async (postId, content) => {
  console.log("sendSharePost chamado:");
  // return await requestService.apiRequest(`/post/${postId}/share`, 'POST', {content});
}

// Tentando
export const getLikesPost = async (postId) => {
  const res =  await requestService.apiRequest(`/post/${postId}/likes`, 'GET');
  console.log("getLikesPost chamado:", res);
  return Array.isArray(res) ? res : res ? [res] : [];
};

// Tentando
export const getCommentsPost = async (postId) => {
  console.log("getCommentsPost chamado:");
  // return await requestService.apiRequest(`/post/${postId}/comments`, 'GET');
}

export const deleteCommentsPost = async (commentId) => {
  // return await requestService.apiRequest(`/post/comment/${commentId}`, 'DELETE');
}