import { useState, useRef, useEffect } from 'react';
import HeaderPost from './components/HeaderPost';
import ContentPost from './components/ContentPost';
import PopUpBlurProfile from '../Profile/PopUpBlurProfile';
import PopUp from '../../PopUp'
import ManagePost from '../../posts/ManagePost';
import AttachFile from '../../posts/AttachFile';
import InteractionBar from '../../posts/Interactions/InteractionBar';

export default function CardPostProfile({ post, photo, name, isPopupView = false, isOpen = false, onPostsUpdated = false, isShare = false,
                                          isFollowing = null, onFollowToggle = null, handle = null, idAuthor = null, isOwner = false }) {
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
        className={`flex flex-col justify-between bg-gray-50 rounded-xl shadow-md p-6 ${
          isPopupView
            ? 'w-full max-w-none min-h-[auto]'
            : `w-full max-w-[460vh] ${hasMedia ? 'h-[52vh]' : 'min-h-[20vh] max-h-[32vh]'}`
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
          isOpen={isOpen} 
          onExpand={openPopup}
        />

        {/* {!isShare && (
          <InteractionBar
            post={post}
            cardWidth={cardWidth}
          />
        )} */}

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

// [
//     {
//         "type": "COMPARTILHAMENTO",
//         "post": null,
//         "share": {
//             "id": 38,
//             "sharedContent": "compartilhando",
//             "sharedAt": "2025-08-01T15:18:33.542021",
//             "sharingUser": {
//                 "id": 4,
//                 "name": "Lais Carvalho Coutinho",
//                 "handle": "@laiscarvalhoco",
//                 "profilePic": "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
//                 "isFollowed": null
//             },
//             "originalPost": {
//                 "id": 38,
//                 "author": {
//                     "id": 1,
//                     "name": "Rosana Celine Pinheiro Damaceno",
//                     "handle": "@rosanacelinepi",
//                     "profilePic": "https://res.cloudinary.com/dl63ih00u/image/upload/v1752625413/default_profile_professional_yij7n0.png",
//                     "isFollowed": false
//                 },
//                 "content": "Esta sou eu jogando PEAK!!!",
//                 "createdAt": "2025-08-01T14:24:26.944795",
//                 "idCommunity": null,
//                 "media": [
//                     {
//                         "id": 23,
//                         "mediaType": "IMAGE",
//                         "url": "https://res.cloudinary.com/dl63ih00u/image/upload/v1754069066/posts/txb1eggpwnyje8fyf7xf.jpg"
//                     }
//                 ],
//                 "visibility": "PUBLICO",
//                 "edited": false,
//                 "editedAt": null,
//                 "isOwner": false,
//                 "canEdit": false
//             }
//         },
//         "createdAt": "2025-08-01T15:18:33.542021"
//     },
//     {
//         "type": "POSTAGEM",
//         "post": {
//             "id": 34,
//             "author": {
//                 "id": 4,
//                 "name": "Lais Carvalho Coutinho",
//                 "handle": "@laiscarvalhoco",
//                 "profilePic": "https://res.cloudinary.com/dl63ih00u/image/upload/v1753555946/profile_pics/user_4.png",
//                 "isFollowed": false
//             },
//             "content": "novo post com media publica",
//             "createdAt": "2025-07-31T23:32:33.673715",
//             "idCommunity": null,
//             "media": [
//                 {
//                     "id": 22,
//                     "mediaType": "IMAGE",
//                     "url": "https://res.cloudinary.com/dl63ih00u/image/upload/v1754015552/posts/etldgejc7itl5vxlqni7.jpg"
//                 }
//             ],
//             "visibility": "PUBLICO",
//             "edited": false,
//             "editedAt": null,
//             "isOwner": true,
//             "canEdit": true
//         },
//         "share": null,
//         "createdAt": "2025-07-31T23:32:33.673715"
//     },
// ]