import { useEffect, useRef, useState } from 'react';

import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';
import useTimeline from './useTimeline';
import CardPostProfile from '../../components/Cards/Posts/CardPostProfile';
import PostSkeleton from '../../components/Cards/Posts/PostSkeleton';
import PopUpBlurProfile from '../../components/Cards/Profile/PopUpBlurProfile';

import { followUser, unfollowUser } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import { useError } from "../../context/ErrorContext";
import { getErrorMessage } from '../../services/errorMessage';

export default function Timeline() {

    const userData = getCurrentUser();
    const { showError } = useError();
    const { posts, status, hasMore, loadMore, retry, addPost, updatePost, removePost, updateStats } = useTimeline(userData.id);

    const [followStatusMap, setFollowStatusMap] = useState({});
    const followPending = useRef(new Set());
    const [selectedKey, setSelectedKey] = useState(null);
    const [announcement, setAnnouncement] = useState('');
    const [announcementVisible, setAnnouncementVisible] = useState(false);
    const sentinelRef = useRef(null);

    const isInitialLoading = status === 'loading' && posts.length === 0;
    const selectedPost = posts.find((data) => data.key === selectedKey);

    // carrega a próxima página um pouco antes de chegar ao fim da lista
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || status !== 'idle' || !hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { rootMargin: '400px 0px' }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [status, hasMore, loadMore]);

    useEffect(() => {
        if (!announcement) return;
        const timer = setTimeout(() => setAnnouncement(''), 5000);
        return () => clearTimeout(timer);
    }, [announcement]);

    const getFollowState = (data) => {
        if (data.idAuthor === userData.id) return null;
        return Object.prototype.hasOwnProperty.call(followStatusMap, data.idAuthor)
            ? followStatusMap[data.idAuthor]
            : !!data.isFollowed;
    };

    const handleToggleFollow = async (userId, isFollowing) => {
        if (!userId || followPending.current.has(userId)) return;
        followPending.current.add(userId);
        try {
            if (isFollowing) await unfollowUser(userId);
            else await followUser(userId);
            setFollowStatusMap((prev) => ({ ...prev, [userId]: !isFollowing }));
        } catch (err) {
            showError(getErrorMessage(err, isFollowing ? "Você continua seguindo este perfil." : "Não foi possível seguir este perfil."));
        } finally {
            followPending.current.delete(userId);
        }
    };

    const handleCreated = (post) => {
        if (!post) return;
        if (post.visibility === 'PUBLICO') {
            addPost(post);
            setAnnouncementVisible(false);
            setAnnouncement('Publicação criada.');
        } else {
            setAnnouncementVisible(true);
            setAnnouncement('Publicação privada criada. Ela aparece apenas no seu perfil.');
        }
    };

    const handleDeleted = (data) => {
        removePost(data.post.type, data.post.id);
        if (selectedKey === data.key) setSelectedKey(null);
    };

    const cardProps = (data) => {
        const isFollowing = getFollowState(data);
        return {
            post: data.post,
            photo: data.photo,
            name: data.name,
            handle: data.handle,
            idAuthor: data.idAuthor,
            authorType: data.authorType,
            isOwner: data.idUserLogged === data.idAuthor,
            isShare: data.isShare,
            postShare: data.postShare,
            isFollowing,
            onFollowToggle: () => handleToggleFollow(data.idAuthor, isFollowing),
            onDeleted: () => handleDeleted(data),
            onUpdated: updatePost,
            onStatsChange: (stats) => updateStats(data.post.type, data.post.id, stats),
        };
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6">
            <h1 className="sr-only">Timeline</h1>

            <TimelineCard>
                <NewPost onCreated={handleCreated} />
            </TimelineCard>

            {/* a publicação pública aparece no topo do feed: o aviso visível só vale para a privada, que não aparece aqui */}
            <p role="status" className={announcement && announcementVisible
                ? 'text-center text-sm text-[var(--font-gray)] bg-white border border-slate-200 rounded-lg px-4 py-2'
                : 'sr-only'}>
                {announcement}
            </p>

            <section aria-labelledby="timeline-feed-title" className="flex flex-col gap-6">
                <h2 id="timeline-feed-title" className="sr-only">Publicações recentes</h2>

                {isInitialLoading && (
                    <div className="flex flex-col gap-6">
                        <p role="status" className="sr-only">Carregando publicações...</p>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                )}

                {status === 'error' && posts.length === 0 && (
                    <div role="alert" className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                        <p className="text-gray-500 text-lg">Não foi possível carregar as publicações.</p>
                        <button
                            type="button"
                            onClick={retry}
                            className="px-5 py-2 bg-(--purple-primary) text-white rounded-lg hover:opacity-90 transition"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {status === 'idle' && posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
                        <p className="text-2xl md:text-4xl font-semibold text-gray-700 mb-3">
                            A timeline começa com você
                        </p>
                        <p className="text-lg md:text-2xl text-gray-500 max-w-md">
                            Seja a primeira a compartilhar uma ideia, conquista ou aprendizado.
                        </p>
                    </div>
                )}

                {posts.length > 0 && (
                    <div role="feed" aria-busy={status === 'loadingMore'} aria-label="Publicações" className="flex flex-col gap-6">
                        {posts.map((data, index) => (
                            <article
                                key={data.key}
                                aria-label={`${data.isShare ? 'Compartilhamento' : 'Publicação'} de ${data.name}`}
                                aria-posinset={index + 1}
                                aria-setsize={hasMore ? -1 : posts.length}
                                className="w-full bg-white p-4 sm:p-8 rounded-xl shadow-md"
                            >
                                <CardPostProfile
                                    {...cardProps(data)}
                                    onCardClick={() => setSelectedKey(data.key)}
                                />
                            </article>
                        ))}
                    </div>
                )}

                {status === 'loadingMore' && (
                    <>
                        <p role="status" className="sr-only">Carregando mais publicações...</p>
                        <PostSkeleton />
                    </>
                )}

                {status === 'error' && posts.length > 0 && (
                    <div role="alert" className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                        <p className="text-gray-500">Não foi possível carregar mais publicações.</p>
                        <button type="button" onClick={retry} className="font-semibold text-(--purple-primary) hover:underline">
                            Tentar novamente
                        </button>
                    </div>
                )}

                {hasMore && posts.length > 0 && status === 'idle' && (
                    <>
                        <div ref={sentinelRef} aria-hidden="true" />
                        <button
                            type="button"
                            onClick={loadMore}
                            className="sr-only focus:not-sr-only focus:self-center focus:px-5 focus:py-2 focus:bg-(--purple-primary) focus:text-white focus:rounded-lg"
                        >
                            Carregar mais publicações
                        </button>
                    </>
                )}

                {!hasMore && posts.length > 0 && status === 'idle' && (
                    <p className="text-center text-gray-500 mb-4">Você chegou ao fim!</p>
                )}
            </section>

            {selectedPost && (
                <PopUpBlurProfile
                    isOpen={true}
                    onClose={() => setSelectedKey(null)}
                    ariaLabel={`Publicação de ${selectedPost.name}`}
                    content={
                        <CardPostProfile
                            {...cardProps(selectedPost)}
                            isPopupView={true}
                            isOpen={true}
                        />
                    }
                />
            )}
        </div>
    );
}
