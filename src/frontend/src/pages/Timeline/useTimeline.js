import { useCallback, useEffect, useMemo, useState } from 'react';

import { getTimelinePosts } from '../../services/timelineService';

const PAGE_SIZE = 5;

export const itemKey = (item) => item.type === 'COMPARTILHAMENTO'
    ? `COMPARTILHAMENTO-${item.share?.sharedId}`
    : `POSTAGEM-${item.post?.id}`;

// Converte o item da API para as props usadas pelo CardPostProfile
export const normalizeItem = (item, idUserLogged) => {
    if (item.type === 'COMPARTILHAMENTO') {
        const { share } = item;
        return {
            key: itemKey(item),
            idUserLogged,
            photo: share.sharingUser.profilePic,
            name: share.sharingUser.name,
            handle: share.sharingUser.handle,
            idAuthor: share.sharingUser.id,
            authorType: share.sharingUser.type,
            isFollowed: share.sharingUser.isFollowed,
            post: {
                id: share.sharedId,
                type: item.type,
                isOwner: share.sharingUser.id === idUserLogged,
                content: share.sharedContent,
                createdAt: item.createdAt,
                visibility: 'PUBLICO',
                countLike: share.countShareLikes ?? 0,
                countComment: share.countShareComments ?? 0,
                likedByMe: share.likedByMe ?? false,
                canEdit: false,
            },
            isShare: true,
            postShare: share.originalPost,
        };
    }
    const { post } = item;
    return {
        key: itemKey(item),
        idUserLogged,
        photo: post.author.profilePic,
        name: post.author.name,
        handle: post.author.handle,
        idAuthor: post.author.id,
        authorType: post.author.type,
        isFollowed: post.author.isFollowed,
        post: {
            id: post.id,
            type: item.type,
            content: post.content,
            edited: post.edited,
            editedAt: post.editedAt,
            isOwner: post.isOwner,
            canEdit: post.canEdit,
            createdAt: item.createdAt,
            media: post.media || [],
            visibility: post.visibility,
            countLike: post.countLikes ?? 0,
            countComment: post.countComments ?? 0,
            countShares: post.countShares ?? 0,
            likedByMe: post.likedByMe ?? false,
        },
        isShare: false,
        postShare: null,
    };
};

const appendUnique = (current, incoming) => {
    const seen = new Set(current.map(itemKey));
    return [...current, ...incoming.filter((item) => !seen.has(itemKey(item)))];
};

// mantém contadores e curtida já conhecidos quando a API devolve só o conteúdo editado
const mergeEditedPost = (current, updated) => ({
    ...current,
    content: updated.content,
    media: updated.media ?? current.media,
    visibility: updated.visibility,
    edited: updated.edited,
    editedAt: updated.editedAt,
    canEdit: updated.canEdit,
});

/**
 * Estado da timeline: paginação pelo back-end (usa `last` da página),
 * itens sem duplicidade e atualizações locais após criar, editar, excluir e interagir.
 */
export default function useTimeline(idUserLogged) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [status, setStatus] = useState('loading'); // loading | loadingMore | idle | error
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let ignore = false;
        setStatus(page === 0 ? 'loading' : 'loadingMore');

        getTimelinePosts(page, PAGE_SIZE)
            .then((response) => {
                if (ignore) return;
                const content = response?.content ?? [];
                setItems((prev) => appendUnique(page === 0 ? [] : prev, content));
                setHasMore(typeof response?.last === 'boolean' ? !response.last : content.length === PAGE_SIZE);
                setStatus('idle');
            })
            .catch((err) => {
                if (ignore) return;
                console.error('Erro ao carregar a timeline:', err);
                setStatus('error');
            });

        return () => { ignore = true; };
    }, [page, attempt]);

    const loadMore = useCallback(() => {
        if (status !== 'idle' || !hasMore) return;
        setPage((prev) => prev + 1);
    }, [status, hasMore]);

    // tenta de novo a mesma página que falhou, sem perder o que já foi carregado
    const retry = useCallback(() => setAttempt((prev) => prev + 1), []);

    const addPost = useCallback((post) => {
        if (!post || post.visibility !== 'PUBLICO') return;
        const item = {
            type: 'POSTAGEM',
            post: { ...post, countLikes: 0, countComments: 0, countShares: 0, likedByMe: false },
            share: null,
            createdAt: post.createdAt,
        };
        setItems((prev) => [item, ...prev.filter((current) => itemKey(current) !== itemKey(item))]);
    }, []);

    const updatePost = useCallback((updated) => {
        if (!updated) return;
        setItems((prev) => prev.map((item) => {
            if (item.type === 'POSTAGEM' && item.post.id === updated.id) {
                return { ...item, post: mergeEditedPost(item.post, updated) };
            }
            if (item.type === 'COMPARTILHAMENTO' && item.share.originalPost?.id === updated.id) {
                return { ...item, share: { ...item.share, originalPost: mergeEditedPost(item.share.originalPost, updated) } };
            }
            return item;
        }));
    }, []);

    const removePost = useCallback((type, id) => {
        setItems((prev) => prev.filter((item) => {
            if (type === 'COMPARTILHAMENTO') return !(item.type === type && item.share.sharedId === id);
            // excluir a postagem original também remove os compartilhamentos dela da tela
            if (item.type === 'POSTAGEM') return item.post.id !== id;
            return item.share.originalPost?.id !== id;
        }));
    }, []);

    // sincroniza contadores entre o card do feed e o card aberto no pop-up
    const updateStats = useCallback((type, id, stats) => {
        setItems((prev) => prev.map((item) => {
            if (type === 'COMPARTILHAMENTO' && item.type === type && item.share.sharedId === id) {
                return {
                    ...item,
                    share: {
                        ...item.share,
                        countShareLikes: stats.countLike ?? item.share.countShareLikes,
                        countShareComments: stats.countComment ?? item.share.countShareComments,
                        likedByMe: stats.likedByMe ?? item.share.likedByMe,
                    },
                };
            }
            if (type === 'POSTAGEM' && item.type === type && item.post.id === id) {
                return {
                    ...item,
                    post: {
                        ...item.post,
                        countLikes: stats.countLike ?? item.post.countLikes,
                        countComments: stats.countComment ?? item.post.countComments,
                        countShares: stats.countShares ?? item.post.countShares,
                        likedByMe: stats.likedByMe ?? item.post.likedByMe,
                    },
                };
            }
            return item;
        }));
    }, []);

    const posts = useMemo(() => items.map((item) => normalizeItem(item, idUserLogged)), [items, idUserLogged]);

    return { posts, status, hasMore, loadMore, retry, addPost, updatePost, removePost, updateStats };
}
