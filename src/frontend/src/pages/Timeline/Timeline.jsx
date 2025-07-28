import React, { useEffect, useState } from 'react';
import TimelineCard from './components/TimelineCard';
import NewPost from './components/NewPost';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CardPostProfile from '../../components/Cards/Posts/CardPostProfile';
import { getTimelinePosts } from '../../services/timelineService';

export default function Timeline () {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const response = await getTimelinePosts(page, 20)
                console.log("Resposta da timeline:", response)
                setPosts(response.content || response);
            } catch (err) {
                console.error("Erro ao carregar timeline:", err)
            } finally {
                setLoading(false);
            }
        }
        fetchTimeline()
    }, [page])

    if (loading) return ( <LoadingSpinner /> )

    return (
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            <TimelineCard><NewPost/></TimelineCard>

        {posts.length > 0 ? (
            <div className="flex flex-col gap-8 w-[65%] mt-6">
                {posts.map((post) => (
                    <CardPostProfile
                        key={post.id}
                        post={post}
                        photo={post.author?.profilePic || ''}
                        name={post.author?.name || 'Usuário'}
                    />
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 mt-10">Nenhuma publicação encontrada</p>
        )}
        </main>
    )
}
// canEdit
// : 
// true
// content
// : 
// "oie minha 2 post privado sem midia aryane"
// createdAt
// : 
// "2025-07-26T10:46:07.06911"
// edited
// : 
// false
// editedAt
// : 
// null
// id
// : 
// 2
// idAuthor
// : 
// 2
// idCommunity
// : 
// null
// isOwner
// : 
// true
// media
// : 
// []
// visibility
// : 
// "PUBLICO"
// [[Prototype]]
// : 
// Object