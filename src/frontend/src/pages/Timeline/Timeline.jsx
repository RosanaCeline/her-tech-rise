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

    const [isUniquePostPopup, setIsUniquePostPopup] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const selectedPost = posts.find((p) => p.id === selectedPostId);

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
                // console.log(response)
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
                showError("Erro ao carregar a timeline. Tente novamente.");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        }
        if (hasMore) fetchTimeline();
    }, [page]);

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

    const handleToggleFollow = async (userId) => {
        try {
          if (isFollowing) {
            await unfollowUser(userId);
            setIsFollowing(false);
          } else {
            await followUser(userId);
            setIsFollowing(true);
          }
        } catch (err) {
          showError("Erro ao atualizar o status de seguir.");
        }
    }; 

    if (loading) return <LoadingSpinner />;
    

    return (
        <main className="flex flex-col bg-(--gray) pt-34 pb-6">
            <TimelineCard> <NewPost /> </TimelineCard>

            {posts.length > 0 ? (
                <div className="flex flex-col gap-8 w-full mx-auto mt-6">
                    {posts.map((post) => {
                        const data = normalizePost(post);
                        // console.log(data)
                        return (
                            <div key={`${data.post.id}-${data.post.createdAt}`}
                                className="w-4/5 lg:w-1/2 mx-auto bg-white p-8 rounded-xl shadow-md"
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
                                isFollowing={data.post.isOwner ? null : data.isFollowed}
                                onFollowToggle={() => handleToggleFollow(data.idAuthor)}
                                onCardClick={() => openUniquePostPopup(data.post.id)}
                            />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10"> Nenhuma publicação encontrada </p>
            )}

            {!hasMore && (
                <p className="text-center text-gray-500 mt-6">Você chegou ao fim!</p>
            )}
            
            {isUniquePostPopup && selectedPost && (
                <PopUpBlurProfile
                    isOpen={isUniquePostPopup}
                    onClose={closeUniquePostPopup}
                    content={
                        (() => {
                            const data = normalizePost(selectedPost);
                            // console.log(data)
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