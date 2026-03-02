import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Earth, Trash2, CornerUpLeft, Send } from "lucide-react";

import PopUpBlurProfile from "../../../components/Cards/Profile/PopUpBlurProfile";
import CardPostProfile from "../../Cards/Posts/CardPostProfile";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";
import LabelInput from "../../form/Label/LabelInput";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";

import { useError } from "../../../context/ErrorContext";
import { getCurrentUser } from "../../../services/authService";
import { followUser, unfollowUser } from "../../../services/userService";
import { sendLikePost, getLikesPost,
            sendCommentPost, getCommentsPost, sendLikeComment, getLikesComment, deleteCommentsPost, 
            sendSharePost, sendLikeShare, getLikesShare, sendCommentShare, getCommentsShare,
        } from "../../../services/interactionsService";

export default function InteractionBar({ idAuthor, post, photo, name, cardWidth = 600 }) {

    const currentUser = getCurrentUser();
    const user = {
        userName: currentUser.name,
        profileURL: currentUser.profilePicture
    };
    const [formData, setFormData] = useState({
        content: "",
        media: [],
        visibility: "PUBLICO",
    });

    const [hasLiked, setHasLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [listLikes, setListLikes] = useState([]);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [listLikesComment, setListLikesComment] = useState([]);
    const [showLikesCommentModal, setShowLikesCommentModal] = useState(false);

    const [commentsCount, setCommentsCount] = useState(0);
    const [listComments, setListComments] = useState([]);
    const [showCommentsInput, setShowCommentsInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [likedComments, setLikedComments] = useState(new Set());
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [isFollowingLocal, setIsFollowingLocal] = useState(post?.author?.isFollowed ?? false);

    const { showError } = useError();
    const [shareCount, setShareCount] = useState(0);
    const [showShareModal, setShareModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);

    const isCompact = cardWidth < 450;
    
    const sendLike = async () => {
        try {
            if(post.type === 'POSTAGEM') await sendLikePost(post.id);
            if(post.type === 'COMPARTILHAMENTO') await sendLikeShare(post.id);
            const willLike = !hasLiked;
            setHasLiked(willLike);
            setLikesCount((prevCount) =>
                willLike ? prevCount + 1 : Math.max(prevCount - 1, 0)
            );
            if(willLike) {
                setListLikes(prev => [
                    ...prev,
                    {
                        id: currentUser.id,
                        userName: currentUser.name,
                        userAvatarUrl: currentUser.profilePicture,
                        createdAt: new Date().toISOString(),
                    }
                ]);
            } else {
                setListLikes(prev => prev.filter(user => user.id !== currentUser.id));
            }
        } catch (error) {
            console.error("Erro ao curtir post:", error);
            showError("Erro ao curtir. Tente novamente.");
        }
    };

    const sendComment = async (isReply = false, parentComment = null) => {
        const contentToSend = isReply ? replyContent.trim() : newComment.trim();
        if (!contentToSend) return;
        try {
            const payload = { content: contentToSend };
            if (isReply && parentComment) {
                payload.parentComment = Number(parentComment);
            }
            let createdComment;
            if(post.type === 'POSTAGEM'){
                createdComment = await sendCommentPost(post.id, payload)
            } else if(post.type === 'COMPARTILHAMENTO'){
                createdComment = await sendCommentShare(post.id, payload)
            }
            setListComments(prev => [
                {
                    id: createdComment.id, 
                    content: contentToSend,
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userAvatarUrl: currentUser.profilePicture,
                    createdAt: new Date().toISOString(),
                    parentComment: isReply ? parentComment : null,
                },
                ...prev
            ]);
            setCommentsCount(prev => prev + 1);
            if (isReply) {
                setReplyContent("");
                setReplyingToCommentId(null);
            } else {
                setNewComment("");
            }
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            showError("Erro ao enviar comentário. Tente novamente.");
        }
    };

    const sendLikeToComment = async (commentId) => {
        try {
            const alreadyLiked = likedComments.has(commentId);
            await sendLikeComment(commentId)
            console.log('Curtindo o comentário ', commentId)
            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (alreadyLiked){
                    newSet.delete(commentId);
                    console.log('Descurtindo o comentário ', commentId)
                }
                else newSet.add(commentId);
                return newSet;
            });
        } catch (error) {
            console.error("Erro ao curtir comentário:", error);
            showError("Erro ao curtir comentário. Tente novamente.");
        }
    };

    const sendShare = async (content) => {
        if (post.type !== "POSTAGEM") return;
        try {
            await sendSharePost(post.id, content);
            setShareModal(false);
            setFormData({ content: "", media: [], visibility: "PUBLICO" });
            setShareCount((prev) => prev + 1);
        } catch (error) {
            console.error("Erro ao compartilhar:", error);
            showError("Erro ao compartilhar. Tente novamente.");
        }
    };

    const getListLikes = async (modal = true) => {
        try {
            let list = [];
            if (post.type === "POSTAGEM") list = await getLikesPost(post.id);
            else if (post.type === "COMPARTILHAMENTO")  list = await getLikesShare(post.id);
            setListLikes(list);
            setLikesCount(list.length);
            if (modal) setShowLikesModal(true);
            return list;
        } catch (error) {
            console.error("Erro ao pegar lista de curtidas:", error);
            return [];
        }
    };

    const getListComments = async () => {
        try {
            let list = [];
            if (post.type === "POSTAGEM") list = await getCommentsPost(post.id);
            else if (post.type === "COMPARTILHAMENTO") list = await getCommentsShare(post.id);
            setListComments(list);

            const likedIds = new Set();
            for (const comment of list) {
                const likes = await getLikesComment(comment.id);
                if (likes.some(like => like.userId === currentUser.id)) {
                    likedIds.add(comment.id);
                }
            }
            setLikedComments(likedIds);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        }
    };

    const getListLikesComment = async (idComment) => {
        try {
            let likes = await getLikesComment(idComment);
            setListLikesComment(likes);
            setShowLikesCommentModal(true);
        } catch (error) {
            console.error("Erro ao buscar curtidas do comentário:", error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteCommentsPost(selectedCommentId);
            setListComments((prev) => prev.filter((c) => c.id !== selectedCommentId));
            setCommentsCount((prev) => prev - 1);
            setShowDeleteModal(false);
            setSelectedCommentId(null);
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
            showError("Erro ao excluir comentário. Tente novamente.");
        }
    };

    const handleToggleFollow = async (userId, isFollowing) => {
        if (!userId) {
            console.error("ID do perfil é inválido");
            return;
        }
        try {
            if (isFollowing) {
                await unfollowUser(userId);
                setIsFollowingLocal(false);
            } else {
                await followUser(userId);
                setIsFollowingLocal(true);
            }
        } catch (err) {
            showError("Erro ao atualizar o status de seguir.", err);
        }
    }; 

    useEffect(() => {
        setIsFollowingLocal(post?.author?.isFollowed ?? false);
    }, [post]);

    useEffect(() => {
        setLikesCount(post.countLike || 0);
        setCommentsCount(post.countComment || 0);
        setShareCount(post.countShares || 0);
    }, [post]);

    useEffect(() => {
        if (!post?.id) return;
        const fetchLikes = async () => {
            try {
                const list = await getListLikes(false); 
                const userLiked = list.some(like => like.userId === currentUser.id);
                setHasLiked(userLiked);
            } catch (error) {
            console.error("Erro ao buscar curtidas:", error);
            }
        };
        fetchLikes();
    }, [post?.id, currentUser.id]);

    const CommentInput = ({ value, onChange, onKeyDown, onSend, placeholder }) => (
        <div className="flex items-start gap-2 w-full min-w-0 pt-3">
            <img
                src={user.profileURL}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <LabelInput
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </div>
            <button
                onClick={onSend}
                className="flex-shrink-0 flex items-center justify-center bg-[var(--purple-primary)] text-white rounded-lg hover:opacity-90 transition px-3 py-2"
            >
                <Send size={16} className="sm:hidden" />
                {!isCompact && <span className="text-xs">Enviar</span>}
            </button>
        </div>
    );

    return (
        <div className="interaction-bar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-sm text-(--purple-primary) mt-3">
                <button className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            getListLikes(); 
                        }}  >
                    <Heart className="purple-primary" size={15} />
                    <span>{likesCount}</span>
                    {!isCompact && <span className="text-xs">curtidas</span>}
                </button>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                            onClick={() => {
                                if (!showCommentsInput) getListComments();
                                setShowCommentsInput((prev) => !prev);
                            }}>
                        <MessageCircle className="sm:hidden" />
                        <span>{commentsCount}</span>
                        {!isCompact && <span className="text-xs">comentários</span>}
                    </button>

                    {post.type !== "COMPARTILHAMENTO" && (
                        <>
                            <span>|</span>
                            <button className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                                <Share className="sm:hidden" />
                                <span>{shareCount}</span>
                                {!isCompact && <span className="text-xs">compartilhamentos</span>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <hr className="border-t border-gray-300 my-3" />

            <div className="grid grid-cols-3 text-center sm:flex sm:justify-between text-(--purple-primary) border-(--purple-primary) text-sm sm:text-base md:text-lg">
                <button onClick={sendLike} className="flex items-center justify-center gap-2 cursor-pointer transition duration-300 hover:scale-105" >
                    <Heart
                        fill={hasLiked ? "var(--purple-primary)" : "transparent"}
                        stroke={hasLiked ? "var(--purple-primary)" : "currentColor"}
                    />
                    {!isCompact && <span className="text-xs">{hasLiked ? "Curtido" : "Curtir"}</span>}
                </button>

                <button
                    onClick={() => {
                        if (!showCommentsInput) getListComments();
                        setShowCommentsInput((prev) => !prev);
                    }}
                    className="flex items-center justify-center gap-2 cursor-pointer transition duration-300 hover:scale-105"
                >
                    <MessageCircle />
                    {!isCompact && <span className="text-xs">Comentar</span>}
                </button>
                        
                <button
                    onClick={() => {
                        if (post.type === "POSTAGEM") setShareModal(true);
                    }}
                    disabled={post.type !== "POSTAGEM"}
                    title={
                        post.type !== "POSTAGEM"
                        ? "Não é possível compartilhar porque isso já é um compartilhamento."
                        : "Compartilhar esta postagem"
                    }
                    className={`flex items-center gap-2 transition duration-300 ${
                        post.type !== "POSTAGEM"
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:scale-105"
                    }`}
                >
                    <Share />
                    {!isCompact && <span className="text-xs">Compartilhar</span>}
                </button>
            </div>

            {showCommentsInput && (
                <div className="mt-4 flex flex-col gap-4 w-full min-w-0 overflow-hidden">
                    <CommentInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendComment()}
                        onSend={() => { if (!newComment.trim()) return; sendComment(); }}
                        placeholder="Escreva um comentário..."
                    />

                    {listComments
                        .filter((comment) => !comment.parentComment)
                        .slice(0, commentsToShow)
                        .map((comment) => {
                            const isLiked = likedComments.has(comment.id);
                            const replies = listComments.filter((r) => r.parentComment === comment.id);

                            return (
                                <div key={comment.id} className="flex flex-col gap-2 w-full min-w-0 pt-2 border-t border-gray-100">
                                    <div className="flex gap-3 w-full min-w-0">
                                    <img
                                        src={comment.userAvatarUrl || "/default-avatar.png"}
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
                                    />
                                    <div className="flex flex-col w-full min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="font-semibold text-sm truncate">{comment.userName}</p>
                                            <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                                {new Intl.DateTimeFormat("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                }).format(new Date(comment.createdAt))}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700 break-words whitespace-pre-wrap">{comment.content}</p>

                                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                                            <button
                                                onClick={() => sendLikeToComment(comment.id)}
                                                className={`flex items-center gap-1 text-xs cursor-pointer transition hover:text-purple-600 
                                                            ${isLiked ? "text-purple-600" : "text-gray-400" }`}
                                                title={isLiked ? "Descurtir comentário" : "Curtir comentário"}
                                            >
                                                <Heart
                                                    fill={isLiked ? "var(--purple-primary)" : "transparent"}
                                                    stroke="currentColor"
                                                    size={14}
                                                />
                                                <span onClick={(e) => {
                                                        e.stopPropagation();
                                                        getListLikesComment(comment.id);
                                                    }}
                                                >
                                                    {isLiked ? "Curtido" : "Curtir"}
                                                </span>
                                            </button>

                                            <button
                                                className="flex items-center gap-1 text-xs cursor-pointer text-gray-400 transition hover:text-purple-600"
                                                onClick={() => setReplyingToCommentId( replyingToCommentId === comment.id ? null : comment.id ) }
                                            >
                                                <CornerUpLeft size={14} />
                                                <span>Responder</span>
                                            </button>

                                            {comment.userId === currentUser.id && (
                                                <button
                                                    // className="text-red-500 hover:text-red-700 flex items-center"
                                                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCommentId(comment.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    >
                                                    <Trash2 size={14} />
                                                    <span className="ml-1 text-sm">Excluir</span>
                                                </button>
                                            )}
                                        </div>

                                        {replyingToCommentId === comment.id && (
                                            <div className="ml-2 sm:ml-4 w-full min-w-0 pr-1">
                                                <CommentInput
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && sendComment(true, comment.id)}
                                                    onSend={() => sendComment(true, comment.id)}
                                                    placeholder="Escreva uma resposta..."
                                                />
                                            </div>
                                        )}
                                        
                                        {replies.length > 0 && (
                                        <div className="ml-2 sm:ml-4 flex flex-col gap-3 border-l-2 border-gray-200 pl-3 w-full min-w-0 pt-3">
                                            {replies.map((reply) => {
                                                const isLikedReply = likedComments.has(reply.id);
                                                return (
                                                    <div key={reply.id} className="flex gap-3 w-full min-w-0">
                                                        <img
                                                            src={reply.userAvatarUrl || "/default-avatar.png"}
                                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                                                        />
                                                        <div className="flex flex-col w-full min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <p className="font-semibold text-sm truncate">{reply.userName}</p>
                                                                <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                                                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(reply.createdAt))}
                                                                </p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-700 break-words whitespace-pre-wrap">{reply.content}</p>

                                                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                                <button
                                                                    onClick={() => sendLikeToComment(reply.id)}
                                                                    className={`flex items-center gap-1 text-xs cursor-pointer transition hover:text-purple-600 ${isLikedReply ? "text-purple-600" : "text-gray-400"}`}
                                                                >
                                                                    <Heart fill={isLikedReply ? "var(--purple-primary)" : "transparent"} stroke="currentColor" size={14} />
                                                                    <span onClick={(e) => { e.stopPropagation(); getListLikesComment(reply.id); }}>
                                                                        {isLikedReply ? "Curtido" : "Curtir"}
                                                                    </span>
                                                                </button>

                                                                {reply.userId === currentUser.id && (
                                                                    <button
                                                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 cursor-pointer"
                                                                        onClick={() => { setSelectedCommentId(reply.id); setShowDeleteModal(true); }}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        <span>Excluir</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {listComments.filter(c => !c.parentComment).length > commentsToShow && (
                        <button
                            onClick={() => setCommentsToShow((prev) => prev + 2)}
                            className="text-sm text-[var(--purple-primary)] hover:underline mt-1 self-start"
                        >
                            Ver mais comentários
                        </button>
                    )}
                </div>
            )}

            <PopUpBlurProfile
                isOpen={showLikesModal}
                onClose={() => setShowLikesModal(false)}
                content={
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        <h2 className="text-2xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">Curtidas</h2>
                        {listLikes.length > 0 ? listLikes.map((u) => (
                            <div key={u.id} className="flex items-center px-4 border-t pt-4 border-slate-200 gap-4">
                                <img src={u.userAvatarUrl || "/default-avatar.png"} className="w-14 h-14 object-cover rounded-full flex-shrink-0" alt={u.userName} />
                                <div className="flex flex-col sm:flex-row sm:justify-between w-full min-w-0 gap-1">
                                    <p className="font-semibold truncate">{u.userName}</p>
                                    <p className="text-xs text-gray-500 whitespace-nowrap">Curtiu em {new Intl.DateTimeFormat('pt-BR').format(new Date(u.createdAt))}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="italic text-xl text-gray-400">Não há nenhuma curtida ainda.</p>
                        )}
                    </div>
                }
            />

            <PopUpBlurProfile
                isOpen={showShareModal}
                onClose={() => setShareModal(false)}
                content={
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={user.profileURL} className="w-14 h-14 object-cover rounded-full mr-3 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <p>{user.userName}</p>
                                    <div className="flex items-center gap-2 text-(--purple-primary) cursor-pointer text-sm">
                                        <Earth size={16} /> Pública
                                    </div>
                                </div>
                            </div>
                        </div>

                        <LabelInput
                            placeholder="Digite sua nova publicação"
                            type="mensagem"
                            value={formData.content}
                                onChange={(e) =>
                                setFormData((prev) => ({ ...prev, content: e.target.value }))
                            }
                        />

                        <div className="scale-80 origin-center border border-[var(--purple-primary)] rounded-xl p-3">
                            <CardPostProfile 
                                key={post.id}
                                post={post}
                                photo={photo}
                                name={name}
                                idAuthor={idAuthor}
                                isOwner={post.isOwner}
                                hideInteractions={true}
                                isShare={true}
                                isFollowing={post.isOwner ? false : isFollowingLocal}
                                onFollowToggle={() => handleToggleFollow(idAuthor)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <BtnCallToAction variant="white" onClick={() => setShowConfirmCancel(true)}> Cancelar </BtnCallToAction>
                            <BtnCallToAction variant="purple" onClick={() => {  if (!formData.content.trim()) return; 
                                                                                sendShare(formData.content);}}>
                                Compartilhar
                            </BtnCallToAction>
                        </div>
                    </div>
                }
            />

            <PopUpBlurProfile
                isOpen={showLikesCommentModal}
                onClose={() => setShowLikesCommentModal(false)}
                content={
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        <h2 className="text-2xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">Curtidas do comentário</h2>
                        {listLikesComment.length > 0 ? listLikesComment.map((u) => (
                            <div key={u.id} className="flex items-center px-4 border-t pt-4 border-slate-200 gap-4">
                                <img src={u.userAvatarUrl || "/default-avatar.png"} className="w-14 h-14 object-cover rounded-full flex-shrink-0" alt={u.userName} />
                                <div className="flex flex-col sm:flex-row sm:justify-between w-full min-w-0 gap-1">
                                    <p className="font-semibold truncate">{u.userName}</p>
                                    <p className="text-xs text-gray-500 whitespace-nowrap">Curtiu em {new Intl.DateTimeFormat('pt-BR').format(new Date(u.createdAt))}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="italic text-xl text-gray-400">Não há nenhuma curtida neste comentário.</p>
                        )}
                    </div>
                }
            />

            <ConfirmModal
                open={showConfirmCancel}
                title="Confirmar Cancelamento"
                message="Tem certeza que deseja cancelar esta publicação?"
                confirmText="Sim"
                cancelText="Não"
                onConfirm={() => {
                    setShowConfirmCancel(false);
                    setShareModal(false);
                    setFormData({ content: "", media: [], visibility: "PUBLICO" });
                }}
                onCancel={() => setShowConfirmCancel(false)}
            />

            <ConfirmModal
                open={showDeleteModal}
                title="Excluir comentário"
                message="Tem certeza de que deseja excluir este comentário? Essa ação não pode ser desfeita."
                confirmText="Sim"
                cancelText="Não"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteComment}
            />

        </div>
    );
}
