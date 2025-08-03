import { requestService } from "./requestService";


// ================= POSTAGEM =================
export const sendLikePost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/like`, 'POST');
}

export const sendCommentPost = async (postId, { content, parentCommentId = null }) => {
  return await requestService.apiRequest(`/post/${postId}/comment`, 'POST', { content, parentCommentId });
}

// Tentando
export const sendSharePost = async (postId, content) => {
  console.log("sendSharePost chamado:", postId, content);
  return await requestService.apiRequest(`/post/${postId}/share`, 'POST', {content});
}

export const getLikesPost = async (postId) => {
  const res =  await requestService.apiRequest(`/post/${postId}/likes`, 'GET');
  return Array.isArray(res) ? res : res ? [res] : [];
};

export const getCommentsPost = async (postId) => {
  return await requestService.apiRequest(`/post/${postId}/comments`, 'GET');
}


// ================= COMPARTILHAMENTO =================
export const sendLikeShare = async (shareId) => {
  return await requestService.apiRequest(`/post/share/${shareId}/like`, 'POST');
}

export const sendCommentShare = async (shareId, { content, parentCommentId = null }) => {
  return await requestService.apiRequest(`/post/share/${shareId}/comment`, 'POST', { content, parentCommentId });
}

export const getLikesShare = async (shareId) => {
  return await requestService.apiRequest(`/post/share/${shareId}/likes`, 'GET');
}

export const getCommentsShare = async (shareId) => {
  return await requestService.apiRequest(`/post/share/${shareId}/comments`, 'GET');
}

// Tentando
export const deleteShare = async (shareId) => {
  return await requestService.apiRequest(`/post/share/${shareId}`, 'DELETE');
}


// ================= COMENTÁRIO =================
export const sendLikeComment = async (commentId) => {
  return await requestService.apiRequest(`/post/comment/${commentId}/like`, 'POST');
}

export const getLikesComment = async (commentId) => {
  return await requestService.apiRequest(`/post/comment/${commentId}/likes`, 'GET');
}

// Tentando
export const deleteCommentsPost = async (commentId) => {
  return await requestService.apiRequest(`/post/comment/${commentId}`, 'DELETE');
}