import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../../services/authService'
import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction'
import CardPostProfile from '../Posts/CardPostProfile'
import PopUpBlurProfile from '../Profile/PopUpBlurProfile'

export default function CardPublicationsProfile({ title, posts, onPostsUpdated, setActivePopUp, isCurrentUser }) {
  const userData = getCurrentUser();
  const [visiblePosts, setVisiblePosts] = useState([]);
  const normalizePost = (post) => post.type === "POSTAGEM" ? post.post : post.share.originalPost;
  const [limit, setLimit] = useState(3);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isUniquePostPopup, setIsUniquePostPopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPostItem = posts.find((item) => normalizePost(item)?.id === selectedPostId);
  const selectedRealPost = selectedPostItem ? normalizePost(selectedPostItem) : null;
  
  const [filter, setFilter] = useState("TODOS");
  const filteredPosts = posts
    .filter(p => {
      const rp = normalizePost(p);
      if (!rp) return false;
      if (filter === "TODOS") return true;
      return rp.visibility === filter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    const handleResize = () => setLimit(window.innerWidth < 1024 ? 2 : 3);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!posts || posts.length === 0) return
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    setVisiblePosts(sorted.slice(0, limit))
  }, [posts, limit])

  const openUniquePostPopup = (postId) => {
    setSelectedPostId(postId);
    setIsUniquePostPopup(true);
  }

  const closeUniquePostPopup = () => {
    setIsUniquePostPopup(false);
    setSelectedPostId(null);
  }

  const buildPostData = (item) => {
    if (item.type === "COMPARTILHAMENTO") {
      return {
          idUserLogged: userData.id,
          photo: item.share.sharingUser.profilePic,
          name: item.share.sharingUser.name,
          handle: item.share.sharingUser.handle,
          idAuthor: item.share.sharingUser.id,
          post: {
              id: item.share.sharedId,
              isOwner: (item.share.sharingUser.id === userData.id),
              type: item.type,
              content: item.share.sharedContent,
              createdAt: item.createdAt,
              visibility: "PUBLICO",
              countLike: item.share.countShareLikes,
              countComment: item.share.countShareComments,
          },
          isShare: true,
          postShare: item.share.originalPost, 
      };
    }
      return {
        idUserLogged: userData.id,
        photo: item.post.author.profilePic,
        name: item.post.author.name,
        handle: item.post.author.handle,
        idAuthor: item.post.author.id,
        isFollowed: item.post.author.isFollowed,
        post: {
            id: item.post.id,
            type: item.type,
            content: item.post.content,
            edited: item.post.edited,
            editedAt: item.post.editedAt,
            isOwner: item.post.isOwner,
            createdAt: item.createdAt,
            media: item.post.media || [],
            visibility: item.post.visibility,
            countLike: item.post.countLikes,
            countComment: item.post.countComments,
            countShares: item.post.countShares,
        },
        isShare: false,
        postShare: null,
      };
  };

  return (
    <>
      <article className="bg-white text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-8 flex flex-col w-full max-w-8xl z-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-[var(--purple-secundary)] mb-3 md:mb-0">{title}</h2>
          {isCurrentUser && (
            <BtnCallToAction onClick={() => setActivePopUp('post')}>
              CRIAR PUBLICAÇÃO
            </BtnCallToAction>
          )}
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((item, idx) => {
              const data = buildPostData(item);
              return (
                <div key={data.post?.id ?? `post-${idx}`} className="cursor-pointer" onClick={() => openUniquePostPopup(item.type === "COMPARTILHAMENTO" ? item.share.originalPost.id : item.post.id)}
>
                  <CardPostProfile
                    idUserLogged={data.idUserLogged}
                    photo={data.photo}
                    name={data.name}
                    handle={data.handle}
                    idAuthor={data.idAuthor}
                    isOwner={true}
                    post={data.post}
                    isShare={data.isShare}
                    postShare={data.postShare} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70">
            Nenhuma postagem disponível no momento.
          </p>
        )}

        {posts.length > visiblePosts.length && (
          <div className="mt-6 self-center">
            <BtnCallToAction onClick={() => setIsPopupOpen(true)}>VER MAIS</BtnCallToAction>
          </div>
        )}
      </article>

      {isPopupOpen && (
        <PopUpBlurProfile
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          content={
            <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto p-2">
              <h1 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">MINHAS POSTAGENS</h1>
              <div className="mb-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="TODOS">Todas</option>
                  <option value="PUBLICO">Públicas</option>
                  <option value="PRIVADO">Privadas</option>
                </select>
              </div>

              {filteredPosts.map((item, idx) => {
                const data = buildPostData(item);
                return (
                  <div key={data.post?.id ?? `post-${idx}`} className="cursor-pointer" onClick={() => openUniquePostPopup(item.type === "COMPARTILHAMENTO" ? item.share.originalPost.id : item.post.id)}
>
                    <CardPostProfile
                      idUserLogged={data.idUserLogged}
                      photo={data.photo}
                      name={data.name}
                      handle={data.handle}
                      idAuthor={data.idAuthor}
                      isOwner={true}
                      post={data.post}
                      isShare={data.isShare}
                      postShare={data.postShare} 
                      onPostsUpdated={onPostsUpdated}
                      isPopupView={true}
                    />
                  </div>
                );
              })}
            </div>
          }
        />
      )}
      {isUniquePostPopup && selectedRealPost && (
        <PopUpBlurProfile
          isOpen={isUniquePostPopup}
          onClose={closeUniquePostPopup}
          content={
            (() => {
              const data = buildPostData(selectedPostItem);
              return (
                <CardPostProfile
                  photo={data.photo}
                  name={data.name}
                  handle={data.handle}
                  idAuthor={data.idAuthor}
                  post={data.post}
                  isShare={data.isShare}
                  postShare={data.postShare}
                  isPopupView={true}
                  isOpen={true}
                  isOwner={data.post?.isOwner}
                />
              );
            })()
          }
        />
      )}
    </>
  );
}