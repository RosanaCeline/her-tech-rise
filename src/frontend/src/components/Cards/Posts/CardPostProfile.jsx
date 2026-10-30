import { useState } from 'react';

import HeaderPost from './components/HeaderPost';
import ContentPost from './components/ContentPost';
import ManagePost from '../../posts/ManagePost';
import AttachFile from '../../posts/AttachFile';
import InteractionBar from '../../posts/Interactions/InteractionBar';
import PopUp from '../../PopUp'

export default function CardPostProfile({ post, photo, name, isPostDetail = true, handle = null, idAuthor = null, authorType = null, isOwner = false, isShare = false, postShare = null, hideInteractions = false,
                                          isPopupView = false, isOpen = false, onPostsUpdated = false, isFollowing = null, onFollowToggle = null, onCardClick,
                                          onDeleted = null, onUpdated = null, onStatsChange = null }) {

  const [activePopUp, setActivePopUp] = useState("post");
  const [editingPost, setEditingPost] = useState(null);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const hasMedia = post.media?.length > 0;
  const user = { userName: name, profileURL: photo }
  const [formData, setFormData] = useState({
    postId: post.id,
    content: post.content,
    media: post.media || [],
    visibility: post.visibility
  });

  const handleEdit = (postData) => {
    setFormData({
      postId: postData.id,
      content: postData.content ?? '',
      media: postData.media || [],
      visibility: postData.visibility
    });
    setEditingPost(postData);
    setActivePopUp("post");
  };

  // quem renderiza o card decide como atualizar a lista; sem callback, mantém o recarregamento antigo
  const handleEdited = (updated) => {
    setEditingPost(null);
    if (onUpdated) onUpdated(updated);
    else if (typeof onPostsUpdated === 'function') onPostsUpdated();
    else window.location.reload();
  };

  return (
      <div className={`@container flex flex-col justify-between rounded-xl w-full min-w-0 transition-all duration-300
                                        ${ onCardClick ? 'cursor-pointer' : '' }
                                        ${ isPostDetail ? '' : 'border border-(--gray) p-5 hover:bg-slate-50'}
                                        ${ isPopupView  ? 'w-full' : `mx-auto ${hasMedia ? '' : 'min-h-[10vh] '}` }`}
            onClick={(e) => { e.stopPropagation(); onCardClick?.(); }}
      >
        <HeaderPost
          photo={photo}
          name={name}
          post={post}
          date={formattedDate}
          handle={handle}
          idAuthor={idAuthor}
          authorType={authorType}
          isOpen={isOpen}
          isOwner={isOwner}
          isShare={isShare}
          onPostsUpdated={onPostsUpdated}
          onDeleted={onDeleted}
          onEdit={handleEdit}
          isFollowing={isFollowing}
          onFollowToggle={onFollowToggle}
        />

        <ContentPost
          post={post}
          authorName={name}
          isShare={isShare}
          postShare={isShare && postShare ? postShare : null}
          isOpen={isOpen}
          onExpand={onCardClick}
        />

        {!hideInteractions && (
          <InteractionBar
            idAuthor={idAuthor}
            photo={photo}
            name={name}
            post={post}
            onStatsChange={onStatsChange}
          />
        )}

        {editingPost && (
          <div onClick={(e) => e.stopPropagation()}>
            <PopUp onClose={() => setEditingPost(null)} ariaLabel="Editar publicação">
              {activePopUp === 'post' && (
                <ManagePost
                  user={user}
                  setActivePopUp={setActivePopUp}
                  formData={formData}
                  setFormData={setFormData}
                  isEdit={true}
                  onSuccess={handleEdited}
                  onClose={() => setEditingPost(null)}
                />
              )}
              {activePopUp === 'image' && <AttachFile type="image" setFormData={setFormData} setActivePopUp={setActivePopUp} />}
              {activePopUp === 'docs' && <AttachFile type="docs" setFormData={setFormData} setActivePopUp={setActivePopUp} />}
            </PopUp>
          </div>
        )}
      </div>
  )
}
