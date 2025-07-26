import { useState, useEffect } from 'react'
import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction'
import CardPostProfile from '../Posts/CardPostProfile'
import PopUpBlurProfile from '../Profile/PopUpBlurProfile'

export default function CardPublicationsProfile({ title, posts, photo, name, onPostsUpdated, setActivePopUp, isCurrentUser }) {
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [limit, setLimit] = useState(3);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isUniquePostPopup, setIsUniquePostPopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setLimit(2);
      } else {
        setLimit(3);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  useEffect(() => {
    if (!posts || posts.length === 0) return
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    setVisiblePosts(sorted.slice(0, limit))
    console.log(posts)
  }, [posts, limit])

  const openUniquePostPopup = (postId) => {
    setSelectedPostId(postId);
    setIsUniquePostPopup(true);
  }

  const closeUniquePostPopup = () => {
    setIsUniquePostPopup(false);
    setSelectedPostId(null);
  }

  return (
    <>
      <article className="bg-white text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-8 flex flex-col w-full max-w-8xl z-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-[var(--purple-secundary)]">{title}</h2>
          {isCurrentUser && (
            <BtnCallToAction onClick={() => setActivePopUp('post')}>
              CRIAR PUBLICAÇÃO
            </BtnCallToAction>
          )}
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <div key={post.id} className="cursor-pointer" onClick={() => openUniquePostPopup(post.id)}>
                <CardPostProfile post={post} photo={photo} name={name} />
              </div>
            ))}
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
              {[...posts]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                  <CardPostProfile key={post.id} post={post} photo={photo} name={name} onPostsUpdated={onPostsUpdated} isPopupView={true} />
              ))}
            </div>
          }
        />
      )}
      {isUniquePostPopup && (
        <PopUpBlurProfile
          isOpen={isUniquePostPopup}
          onClose={closeUniquePostPopup}
          content={
            <CardPostProfile
              post={posts.find(p => p.id === selectedPostId)}
              photo={photo}
              name={name}
              isPopupView={true}
              isOpen={true}
            />
          }
        />
      )}
    </>
  );
}
