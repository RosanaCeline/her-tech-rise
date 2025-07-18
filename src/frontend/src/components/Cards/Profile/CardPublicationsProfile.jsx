import { useState, useEffect } from 'react'
import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction'
import CardPostProfile from '../Posts/CardPostProfile'
import PopUpBlurProfile from '../Profile/PopUpBlurProfile'

export default function CardPublicationsProfile({ title, posts, setActivePopUp }) {
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [limit, setLimit] = useState(3);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  console.log(posts)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setLimit(2);
      } else {
        setLimit(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setVisiblePosts(posts?.slice(0, limit));
  }, [posts, limit]);

  return (
    <>
      <article className="bg-white text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-8 flex flex-col w-full max-w-8xl z-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-[var(--purple-secundary)]">{title}</h2>
          <BtnCallToAction onClick={() => setActivePopUp('post')}>
            CRIAR PUBLICAÇÃO
          </BtnCallToAction>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <CardPostProfile key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p>Sem publicações para mostrar.</p>
        )}

        {posts.length > visiblePosts.length && (
          <div className="mt-6 self-center">
            <BtnCallToAction onClick={() => setIsPopupOpen(true)}>VER MAIS</BtnCallToAction>
          </div>
        )}
      </article>

      {/* Popup colocado fora do artigo e em nível raiz do componente */}
      {isPopupOpen && (
        <PopUpBlurProfile
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          content={
            <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto p-2">
              {posts.map((post) => (
                <CardPostProfile key={post.id} post={post} isPopupView />
              ))}
              <BtnCallToAction onClick={() => setIsPopupOpen(false)}>FECHAR</BtnCallToAction>
            </div>
          }
        />
      )}
    </>
  );
}
