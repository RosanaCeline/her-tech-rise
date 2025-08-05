import { useState, useRef, useEffect } from 'react';
import HeaderPost from './components/HeaderPost';
import ContentPost from './components/ContentPost';
import PopUpBlurProfile from '../Profile/PopUpBlurProfile';
import PopUp from '../../PopUp'
import ManagePost from '../../posts/ManagePost';
import AttachFile from '../../posts/AttachFile';
import InteractionBar from '../../posts/Interactions/InteractionBar';

export default function CardPostProfile({ idUserLogged, post, photo, name, handle = null, idAuthor = null, isOwner = false, isShare = false, postShare = null, hideInteractions = false,
                                          isPopupView = false, isOpen = false, onPostsUpdated = false, isFollowing = null, onFollowToggle = null, }) {
  const [showPopup, setShowPopup] = useState(false);
  const [activePopUp, setActivePopUp] = useState("post");
  const [editingPost, setEditingPost] = useState(null);
  const openPopup = () => setShowPopup(true);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const hasMedia = post.media?.length > 0;
  const user = {
      userName: name,
      profileURL: photo
  }
  const [formData, setFormData] = useState({
    postId: post.id,
    content: post.content,
    media: post.media || [],
    visibility: post.visibility
  });

  const handleEdit = (postData) => {
    setFormData({
      postId: postData.id,
      content: postData.content,
      media: postData.media || [],
      visibility: postData.visibility
    });
    setEditingPost(postData);
    setActivePopUp("post");
  };

  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
      <div
        ref={containerRef}
        onClick={openPopup}
        className={`flex flex-col justify-between rounded-xl h-fit transition-all duration-300 ${
          isPopupView
            ? 'w-full max-w-none min-h-[auto]'
            : `w-full max-w-[460vh] ${hasMedia ? 'min-h-[52vh]' : 'min-h-[20vh] '}`
        }`}
      >
        <HeaderPost
          photo={photo}
          name={name}
          post={post} 
          date={formattedDate}
          handle={handle}
          idAuthor={idAuthor}
          isOpen={isOpen}
          isOwner={isOwner}
          isShare={isShare}
          onPostsUpdated={onPostsUpdated}
          onEdit={handleEdit} 
          isFollowing={isFollowing}
          onFollowToggle={onFollowToggle}
        />
        
        <ContentPost 
          post={post} 
          isShare={isShare}
          postShare={isShare && postShare ? postShare : null}
          isOpen={isOpen} 
          onExpand={openPopup}
          cardWidth={cardWidth}
        />

        {!hideInteractions && (
          <InteractionBar
            idAuthor={idAuthor}
            photo={photo}
            name={name}
            post={post}
            cardWidth={cardWidth}
          />
        )}

        {editingPost && (
          <PopUpBlurProfile
            isOpen={true}
            onClose={() => setEditingPost(null)}
            content={
              <PopUp>
                {activePopUp === 'post' && (
                  <ManagePost
                    user={user}
                    setActivePopUp={setActivePopUp}
                    formData={formData}
                    setFormData={setFormData}
                    isEdit={true} 
                    onSuccess={() => {
                      setEditingPost(null);
                      onPostsUpdated?.();
                    }}
                  />
                )}
                {activePopUp === 'image' && <AttachFile type="image" setFormData={setFormData} setActivePopUp={setActivePopUp} />}
                {activePopUp === 'video' && <AttachFile type="video" setFormData={setFormData} setActivePopUp={setActivePopUp} />}
                {activePopUp === 'docs' && <AttachFile type="docs" setFormData={setFormData} setActivePopUp={setActivePopUp} />}
              </PopUp>
            }
          />
        )}
      </div>
  )
}