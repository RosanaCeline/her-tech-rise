import { useState, useMemo } from 'react'

import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction'
import CardPostProfile from '../Posts/CardPostProfile'
import PopUpBlurProfile from '../Profile/PopUpBlurProfile'
import { useAuth } from '../../../context/AuthContext'

const PREVIEW_LIMIT = 2;

// chave única por item: um compartilhamento e a publicação original têm ids de tabelas diferentes
const itemKey = (item) => item.type === "COMPARTILHAMENTO"
  ? `COMPARTILHAMENTO-${item.share?.sharedId}`
  : `POSTAGEM-${item.post?.id}`;

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export default function CardPublicationsProfile({ title, posts, onPostsUpdated, setActivePopUp, isCurrentUser }) {

  const userData = useAuth();
  const normalizePost = (post) => post.type === "POSTAGEM" ? post.post : post.share?.originalPost;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [filter, setFilter] = useState("TODOS");

  const sortedPosts = useMemo(() => [...(posts ?? [])].sort(byNewest), [posts]);
  const visiblePosts = sortedPosts.slice(0, PREVIEW_LIMIT);
  const selectedPostItem = sortedPosts.find((item) => itemKey(item) === selectedKey);

  const filteredPosts = sortedPosts.filter((p) => {
    const rp = normalizePost(p);
    if (!rp) return false;
    if (filter === "TODOS") return true;
    return rp.visibility === filter;
  });

  const openUniquePostPopup = (item) => {
    setIsPopupOpen(false);
    setSelectedKey(itemKey(item));
  }

  const buildPostData = (item) => {
    if (item.type === "COMPARTILHAMENTO") {
      return {
          idUserLogged: userData.id,
          photo: item.share.sharingUser.profilePic,
          name: item.share.sharingUser.name,
          handle: item.share.sharingUser.handle,
          idAuthor: item.share.sharingUser.id,
          authorType: item.share.sharingUser.type,
          post: {
              id: item.share.sharedId,
              isOwner: (item.share.sharingUser.id === userData.id),
              type: item.type,
              content: item.share.sharedContent,
              createdAt: item.createdAt,
              visibility: "PUBLICO",
              countLike: item.share.countShareLikes,
              countComment: item.share.countShareComments,
              likedByMe: item.share.likedByMe,
              canEdit: false,
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
        authorType: item.post.author.type,
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
            likedByMe: item.post.likedByMe,
            canEdit: item.post.canEdit,
        },
        isShare: false,
        postShare: null,
      };
  };

  const renderCard = (item, extraProps = {}) => {
    const data = buildPostData(item);
    return (
      <CardPostProfile
        photo={data.photo}
        name={data.name}
        handle={data.handle}
        idAuthor={data.idAuthor}
        authorType={data.authorType}
        isOwner={data.post.isOwner}
        post={data.post}
        isShare={data.isShare}
        postShare={data.postShare}
        onPostsUpdated={onPostsUpdated}
        isPostDetail={true}
        {...extraProps}
      />
    );
  };

  return (
    <>
      <article className="bg-white text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-5 sm:p-8 flex flex-col w-full max-w-8xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-[var(--purple-secundary)] break-words min-w-0">{title}</h2>
          {isCurrentUser && (
            <BtnCallToAction onClick={() => setActivePopUp('post')}>
              CRIAR PUBLICAÇÃO
            </BtnCallToAction>
          )}
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {visiblePosts.map((item) => (
              <div key={itemKey(item)} className="min-w-0 rounded-xl border border-[var(--gray)] hover:bg-slate-50 transition p-3">
                {renderCard(item, { onCardClick: () => openUniquePostPopup(item) })}
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70">
            Nenhuma postagem disponível no momento.
          </p>
        )}

        {sortedPosts.length > visiblePosts.length && (
          <div className="mt-6 self-center">
            <BtnCallToAction onClick={() => setIsPopupOpen(true)} aria-label={`Ver todas as ${sortedPosts.length} publicações`}>
              VER MAIS
            </BtnCallToAction>
          </div>
        )}
      </article>

      <PopUpBlurProfile
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        ariaLabel={isCurrentUser ? "Minhas publicações" : title}
        content={
          <div className="flex flex-col gap-6 w-full min-w-0">
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--purple-secundary)] break-words">
              {isCurrentUser ? "MINHAS PUBLICAÇÕES" : String(title ?? '').toUpperCase()}
            </h2>
            {isCurrentUser && (
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Filtrar publicações por visibilidade"
                  className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="TODOS">Todas</option>
                  <option value="PUBLICO">Públicas</option>
                  <option value="PRIVADO">Privadas</option>
                </select>
              </div>
            )}

            <div className="flex flex-col min-w-0 gap-4">
              {filteredPosts.length > 0 ? filteredPosts.map((item) => (
                <div key={itemKey(item)} className="border border-[var(--gray)] rounded-xl hover:bg-slate-50 transition p-3 min-w-0">
                  {renderCard(item, { isPopupView: true, onCardClick: () => openUniquePostPopup(item) })}
                </div>
              )) : (
                <p className="italic text-gray-400">Nenhuma postagem encontrada.</p>
              )}
            </div>
          </div>
        }
      />

      <PopUpBlurProfile
        isOpen={!!selectedPostItem}
        onClose={() => setSelectedKey(null)}
        ariaLabel="Publicação"
        content={selectedPostItem ? renderCard(selectedPostItem, { isPopupView: true, isOpen: true }) : null}
      />
    </>
  );
}
