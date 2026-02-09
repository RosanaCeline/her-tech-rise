import React, { useEffect, useState } from 'react';

import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CardPostProfile from '../../components/Cards/Posts/CardPostProfile';
import PopUpBlurProfile from '../../components/Cards/Profile/PopUpBlurProfile';

import { getTimelinePosts } from '../../services/timelineService';
import { followUser, unfollowUser } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import { useError } from "../../context/ErrorContext";

export default function Timeline() {
    const userData = getCurrentUser();
    const { showError } = useError();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [followStatusMap, setFollowStatusMap] = useState({});

    const [isUniquePostPopup, setIsUniquePostPopup] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    
    const selectedPost = posts.find((item) => {
        if (item.type === 'POSTAGEM') return item.post.id === selectedPostId;
        if (item.type === 'COMPARTILHAMENTO') return item.share.sharedId === selectedPostId;
        return false;
    });

    const openUniquePostPopup = (postId) => {
        setSelectedPostId(postId);
        setIsUniquePostPopup(true);
    };

    const closeUniquePostPopup = () => {
        setIsUniquePostPopup(false);
        setSelectedPostId(null);
    };

    const normalizePost = (item) => {
        if (item.type === "COMPARTILHAMENTO") {
            return {
                idUserLogged: userData.id,
                photo: item.share.sharingUser.profilePic,
                name: item.share.sharingUser.name,
                handle: item.share.sharingUser.handle,
                idAuthor: item.share.sharingUser.id,
                isFollowed: item.share.sharingUser.isFollowed,
                post: {
                    id: item.share.sharedId,
                    type: item.type,
                    isOwner: (item.share.sharingUser.id === userData.id),
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

    useEffect(() => {
        async function fetchTimeline() {
            try {
                if (page === 0) setLoading(true);
                else setLoadingMore(true);

                const response = await getTimelinePosts(page);
                let rawPosts = response.content || response;
                rawPosts = rawPosts.filter((item) => {
                    if (item.type === "POSTAGEM") {
                        return item.post?.visibility === "PUBLICO";
                    }
                    if (item.type === "COMPARTILHAMENTO") {
                        return item.share?.originalPost?.visibility === "PUBLICO";
                    }
                    return false;
                });

                if (rawPosts.length === 0) {
                    setHasMore(false); 
                    return;
                }

                setPosts((prev) => (page === 0 ? rawPosts : [...prev, ...rawPosts]));
            } catch (err) {
                showError("Erro ao carregar a timeline. Tente novamente.", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        }
        if (hasMore) fetchTimeline();
    }, [page, hasMore, showError]);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
                !loadingMore &&
                !loading
            ) {
                setLoadingMore(true);
                setPage(prev => prev + 1);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, loading]);

    const handleToggleFollow = async (userId, isFollowing) => {
        if (!userId) {
            console.error("ID do perfil é inválido");
            return;
        }
        try {
            if (isFollowing) {
                await unfollowUser(userId);
                setFollowStatusMap((prev) => ({ ...prev, [userId]: false }));
            } else {
                await followUser(userId);
                setFollowStatusMap((prev) => ({ ...prev, [userId]: true }));
            }
        } catch (err) {
          showError("Erro ao atualizar o status de seguir.", err);
        }
    }; 

    if (loading) return <LoadingSpinner />;
    

    return (
        <main className="flex flex-col bg-(--gray) flex-1">
            <TimelineCard> <NewPost /> </TimelineCard>

            {posts.length > 0 ? (
                <div className="flex flex-col gap-8 w-full mx-auto mt-6 mb-10">
                    {posts.map((post) => {
                        const data = normalizePost(post);
                        const isFollowing = data.post.isOwner
                            ? null
                            : followStatusMap.hasOwnProperty.call(followStatusMap, data.idAuthor)
                                ? followStatusMap[data.idAuthor]
                                : data.isFollowed;
                        return (
                            <div key={`${data.post.id}-${data.post.createdAt}`}
                                className="w-4/5 lg:w-1/2 mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-md"
                                onClick={() => openUniquePostPopup(data.post.id)}
                            >
                            <CardPostProfile
                                idUserLogged={data.idUserLogged}
                                post={data.post}
                                photo={data.photo}
                                name={data.name}
                                idAuthor={data.idAuthor}
                                handle={data.handle}
                                isOwner={data.idUserLogged === data.idAuthor}
                                isShare={data.isShare}
                                postShare={data.postShare}
                                // isFollowing={data.post.isOwner ? null : data.isFollowed}
                                isFollowing={isFollowing}
                                onFollowToggle={() => handleToggleFollow(data.idAuthor, isFollowing)}
                                onCardClick={() => openUniquePostPopup(data.post.id)}
                            />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-3">
                        A timeline começa com você
                    </h2>
                    <p className="text-l md:text-2xl text-gray-500 max-w-md mb-6">
                        Seja a primeira a compartilhar uma ideia, conquista ou aprendizado.
                    </p>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500 m-8 mt-0">Você chegou ao fim!</p>
            )}
            
            {isUniquePostPopup && selectedPost && (
                <PopUpBlurProfile
                    isOpen={isUniquePostPopup}
                    onClose={closeUniquePostPopup}
                    content={
                        (() => {
                            const data = normalizePost(selectedPost);
                            return (
                                <CardPostProfile
                                    idUserLogged={data.idUserLogged}
                                    post={data.post}
                                    photo={data.photo}
                                    name={data.name}
                                    handle={data.handle}
                                    idAuthor={data.idAuthor}
                                    isPopupView={true}
                                    isOpen={true}
                                    isOwner={data.idUserLogged === data.idAuthor}
                                    isFollowing={data.post.isOwner ? false : (data.post.author?.isFollowed ?? false)}
                                    isShare={data.isShare}
                                    postShare={data.postShare}
                                />
                            );
                        })()
                    }
                />
            )}
        </main>
    );
}