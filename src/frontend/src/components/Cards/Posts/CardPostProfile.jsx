import { useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import HeaderPost from './components/HeaderPost';
import ContentPost from './components/ContentPost';
import PopUpBlurProfile from '../Profile/PopUpBlurProfile';
import PopUp from '../../PopUp'
import ManagePost from '../../posts/ManagePost';
import AttachFile from '../../posts/AttachFile';

export default function CardPostProfile({ post, photo, name, isPopupView = false, isOpen = false, onPostsUpdated = false, 
                                          isFollowing = null, onFollowToggle = null, handle = null, idAuthor = null, isOwner = false }) {
  const [showPopup, setShowPopup] = useState(false);

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

  const [activePopUp, setActivePopUp] = useState("post");
  const [editingPost, setEditingPost] = useState(null);

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

  return (
      <div
        onClick={openPopup}
        className={`flex flex-col justify-between bg-gray-50 rounded-xl shadow-md p-6 ${
          isPopupView
            ? 'w-full max-w-none min-h-[auto]'
            : `w-full max-w-[460vh] ${hasMedia ? 'h-[32vh]' : 'min-h-[20vh] max-h-[32vh]'}`
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
          onPostsUpdated={onPostsUpdated}
          onEdit={handleEdit} 
          isFollowing={isFollowing}
          onFollowToggle={onFollowToggle}
        />
        
        <ContentPost 
          post={post} 
          isOpen={isOpen} 
          onExpand={openPopup}
        />

        {/* Interações */}
        <div className="flex justify-end items-center mt-4 text-sm text-gray-500 gap-6">
          <div className="flex items-center gap-1">
            <Heart size={16} /> <span>{post.likes ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} /> <span>{post.comments ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share size={16} /> <span>{post.shares ?? 0}</span>
          </div>
        </div>

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
