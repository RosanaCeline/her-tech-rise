import React, { useEffect, useState } from 'react';
import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CardPostProfile from '../../components/Cards/Posts/CardPostProfile';
import { getTimelinePosts } from '../../services/timelineService';
import { getCurrentUser } from '../../services/authService';
import { getProfileById } from '../../services/userService';

export default function Timeline() {
    const userData = getCurrentUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                if (page === 0) setLoading(true);
                else setLoadingMore(true);

                const response = await getTimelinePosts(page);
                let rawPosts = response.content || response;
                rawPosts = rawPosts.filter((post) => post.visibility === "PUBLICO");
                console.log(rawPosts);

                if (rawPosts.length === 0) {
                    setHasMore(false); 
                    return;
                }

                const finalPosts = rawPosts.map((post) =>
                    post.isOwner
                        ? {
                            ...post,
                            author: {
                            ...post.author,
                            name: userData.name,
                            profilePic: userData.profilePicture,
                            },
                        }
                        : post
                );
                setPosts(prevPosts => (page === 0 ? finalPosts : [...prevPosts, ...finalPosts]));
            } catch (err) {
                console.error("Erro ao carregar timeline:", err);
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
          console.error("Erro ao seguir/desseguir:", err);
        }
    };

    if (loading) return <LoadingSpinner />;
    

    return (
        <main className="flex flex-col bg-(--gray) pt-34 pb-6">
            <TimelineCard> <NewPost /> </TimelineCard>

            {posts.length > 0 ? (
                <div className="flex flex-col gap-8 w-full mx-auto mt-6">
                    {posts.map((post) => (
                        <div key={post.id} className="w-4/5 mx-auto bg-white p-8 rounded-xl shadow-md">
                            <CardPostProfile
                                key={post.id}
                                post={post}
                                photo={post.author?.profilePic}
                                name={post.author?.name}
                                isFollowing={ post.isOwner ? null : post.author.isFollowed }
                                onFollowToggle={() => handleToggleFollow(post.author.id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10"> Nenhuma publicação encontrada </p>
            )}

            {!hasMore && (
                <p className="text-center text-gray-500 mt-6">Você chegou ao fim!</p>
            )}
        </main>
    );
}