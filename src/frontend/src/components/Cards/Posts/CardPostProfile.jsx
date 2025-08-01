import { useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import HeaderPost from './components/HeaderPost';
import ContentPost from './components/ContentPost';

export default function CardPostProfile({ post, photo, name, isPopupView = false, isOpen = false, onPostsUpdated }) {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const hasMedia = post.media?.length > 0;

  return (
    <>
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
          visibility={post.visibility}
          communityId = {post.communityId}
          postId={post.id}
          date={formattedDate}
          isOpen={isOpen}
          onPostsUpdated={onPostsUpdated}
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
      </div>
    </>
  )
}
