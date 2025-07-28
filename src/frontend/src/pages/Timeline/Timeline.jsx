import React, { useEffect, useState } from 'react';
import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CardPostProfile from '../../components/Cards/Posts/CardPostProfile';
import { getTimelinePosts } from '../../services/timelineService';
import { getCurrentUser } from '../../services/authService';
import { getProfileById } from '../../services/userService';

export default function Timeline() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const userData = getCurrentUser();

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const response = await getTimelinePosts(page, 20);
                let rawPosts = response.content || response;
                rawPosts = rawPosts.filter((post) => post.visibility === "PUBLICO");

                const finalPosts = await Promise.all(
                    rawPosts.map(async (post) => {
                        if (post.isOwner) {
                        return {
                            ...post,
                            authorName: userData.name,
                            authorPhoto: userData.profilePicture,
                        };
                        } else {
                            try {
                                const profile = await getProfileById(post.idAuthor);
                                return {
                                ...post,
                                authorName: profile?.name || "Usuário",
                                authorPhoto: profile?.profilePic,
                                };
                            } catch (err) {
                                console.error(`Erro ao buscar perfil ${post.idAuthor}:`, err);
                                return { ...post, authorName: "Usuário",};
                            }
                        }
                    })
                );
                setPosts(finalPosts);
            } catch (err) {
                console.error("Erro ao carregar timeline:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTimeline();
    }, [page]);

    if (loading) return <LoadingSpinner />;

    return (
        <main className="flex flex-col bg-(--gray) pt-34 pb-6">
            <TimelineCard> <NewPost /> </TimelineCard>

            {posts.length > 0 ? (
                <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto mt-6">
                    {posts.map((post) => (
                        <CardPostProfile
                            key={post.id}
                            post={post}
                            photo={post.authorPhoto}
                            name={post.authorName}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10"> Nenhuma publicação encontrada </p>
            )}
        </main>
    );
}