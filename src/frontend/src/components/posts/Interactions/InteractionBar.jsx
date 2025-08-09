import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Earth, Lock, Trash2, CornerUpLeft } from "lucide-react";

import PopUpBlurProfile from "../../../components/Cards/Profile/PopUpBlurProfile";
import CardPostProfile from "../../Cards/Posts/CardPostProfile";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";
import LabelInput from "../../form/Label/LabelInput";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";

import { getCurrentUser } from "../../../services/authService";
import { sendLikePost, getLikesPost,
            sendCommentPost, getCommentsPost, sendLikeComment, getLikesComment, deleteCommentsPost, 
            sendSharePost, sendLikeShare, getLikesShare, sendCommentShare, getCommentsShare,
        } from "../../../services/interactionsService";

export default function InteractionBar({ idAuthor, post, photo, name, cardWidth }) {
    const currentUser = getCurrentUser();
    const isCompact = cardWidth < 600;

    const [hasLiked, setHasLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [listLikes, setListLikes] = useState([]);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [listLikesComment, setListLikesComment] = useState([]);
    const [showLikesCommentModal, setShowLikesCommentModal] = useState(false);

    const [commentsCount, setCommentsCount] = useState(0);
    const [listComments, setListComments] = useState([]);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showCommentsInput, setShowCommentsInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [likedComments, setLikedComments] = useState(new Set());

    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const [shareCount, setShareCount] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [showShareModal, setShareModal] = useState(false);
    const [formData, setFormData] = useState({
        content: "",
        media: [],
        visibility: "PUBLICO",
    });
    const user = {
        userName: currentUser.name,
        profileURL: currentUser.profilePicture
    }
    const [changeVisibilityPopup, setChangeVisibilityPopup] = useState(false);
    const changeVisibility = (visibility) => {
        setFormData((prev) => ({ ...prev, visibility }));
        setChangeVisibilityPopup(false);
    };

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
        }
    };

    const sendComment = async (isReply = false, parentComment = null) => {
        const contentToSend = isReply ? replyContent.trim() : newComment.trim();
        if (!contentToSend) return;
        try {
            const payload = { content: contentToSend };
            if (isReply && parentComment) {
                payload.parentCommentId = Number(parentComment);
            }
            console.log("Payload do comentário:", payload);

            let createdComment;
            if(post.type === 'POSTAGEM'){
                createdComment = await sendCommentPost(post.id, payload)
            } else if(post.type === 'COMPARTILHAMENTO'){
                createdComment = await sendCommentShare(post.id, payload)
            }
            setListComments(prev => [
                {
                    id: createdComment.id, 
                    content: newComment,
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userAvatarUrl: currentUser.profilePicture,
                    createdAt: new Date().toISOString(),
                    parentCommentId: isReply ? parentComment : null,
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
            console.log(list)

            const likedIds = new Set();
            for (const comment of list) {
                const likes = await getLikesComment(comment.id);
                if (likes.some(like => like.userId === currentUser.id)) {
                    likedIds.add(comment.id);
                }
            }
            setLikedComments(likedIds);
            setShowCommentsModal(true);
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
            setListComments((prev) =>
                prev.filter((c) => c.id !== selectedCommentId)
            );
            setCommentsCount((prev) => prev - 1);
            setShowDeleteModal(false);
            setSelectedCommentId(null);
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        }
    };

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

    // console.log("InteractionBar - post:", post);

    return (
        <div className="interaction-bar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-sm text-(--purple-primary) mt-3">
                <button
                    className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                    onClick={getListLikes}
                >
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
                        {isCompact && <MessageCircle className="purple-primary" size={15} />}
                        <span>{commentsCount}</span>
                        {!isCompact && <span className="text-xs">comentários</span>}
                    </button>

                    {post.type !== "COMPARTILHAMENTO" && (
                        <>
                            <span>|</span>
                            <button className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                            {isCompact && <Share className="purple-primary" size={15} />}
                            <span>{post.countShares}</span>
                            {!isCompact && <span className="text-xs">compartilhamentos</span>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <hr className="border-t border-gray-300 my-3" />

            <div className="flex justify-between text-(--purple-primary) border-(--purple-primary) font-semibold text-lg">
                <button
                    onClick={sendLike}
                    className="flex items-center gap-2 cursor-pointer transition duration-300 hover:scale-105"
                >
                    <Heart
                        fill={hasLiked ? "var(--purple-primary)" : "transparent"}
                        stroke={hasLiked ? "var(--purple-primary)" : "currentColor"}
                    />                
                    {!isCompact && (hasLiked ? "Curtido" : "Curtir")}
                </button>

                <button
                    onClick={() => {
                        if (!showCommentsInput) getListComments();
                        setShowCommentsInput((prev) => !prev);
                    }}
                    className="flex items-center gap-2 cursor-pointer transition duration-300 hover:scale-105"
                >
                    <MessageCircle />
                    {!isCompact && "Comentar"}
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
                    {!isCompact && "Compartilhar"}
                </button>
            </div>

            {showCommentsInput && (
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex gap-x-4">
                        <div className="relative w-full max-w-[70px] h-[70px] flex-shrink-0">
                            <img src={user.profileURL} className="h-full w-full object-cover rounded-full" />
                        </div>
                        <div className="w-full pt-2">
                            <LabelInput
                                placeholder="Escreva um comentário..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendComment()}
                            />
                        </div>
                        <BtnCallToAction
                                variant="purple"
                                className="!px-3 !py-1 !text-sm" 
                                onClick={() => {
                                    if (!newComment.trim()) return;
                                    sendComment(); 
                                }}
                            >
                                Enviar
                        </BtnCallToAction>
                    </div>

                    {listComments
                        .filter((comment) => comment.parentComment === null)
                        .slice(0, commentsToShow)
                        .map((comment) => {
                            const isLiked = likedComments.has(comment.id);
                            return (
                                <div key={comment.id} className="pt-3 flex gap-3 flex-col w-full">
                                    <div className="flex gap-3">
                                    <img
                                        src={comment.userAvatarUrl || "/default-avatar.png"}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{comment.userName}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Intl.DateTimeFormat("pt-BR", {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                                }).format(new Date(comment.createdAt))}
                                            </p>
                                        </div>
                                        <p className="mt-1">{comment.content}</p>

                                        <div className="flex items-center gap-8 mt-2">
                                            <button
                                                onClick={() => sendLikeToComment(comment.id)}
                                                className={`flex items-center cursor-pointer transition hover:text-purple-600 ${
                                                isLiked ? "text-purple-600" : "text-gray-400"
                                                }`}
                                                title={isLiked ? "Descurtir comentário" : "Curtir comentário"}
                                            >
                                                <Heart
                                                fill={isLiked ? "var(--purple-primary)" : "transparent"}
                                                stroke="currentColor"
                                                size={18}
                                                />
                                                <span
                                                className="ml-1 text-sm cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    getListLikesComment(comment.id);
                                                }}
                                                >
                                                {isLiked ? "Curtido" : "Curtir"}
                                                </span>
                                            </button>

                                            <button
                                                className="flex items-center cursor-pointer transition hover:text-purple-600"
                                                onClick={() =>
                                                setReplyingToCommentId(
                                                    replyingToCommentId === comment.id ? null : comment.id
                                                )
                                                }
                                            >
                                                <CornerUpLeft size={16} />
                                                <span className="ml-1 text-sm cursor-pointer">Responder</span>
                                            </button>

                                            {comment.userId === currentUser.id && (
                                                <button
                                                className="text-red-500 hover:text-red-700 flex items-center"
                                                onClick={() => {
                                                    setSelectedCommentId(comment.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                title="Excluir comentário"
                                                >
                                                <Trash2 size={18} />
                                                <span className="ml-1 text-sm">Excluir</span>
                                                </button>
                                            )}
                                        </div>

                                        {replyingToCommentId === comment.id && (
                                            <div className="flex mt-3 gap-4">
                                                <img
                                                    src={user.profileURL}
                                                    className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <LabelInput
                                                        placeholder="Escreva uma resposta..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        onKeyDown={(e) =>
                                                        e.key === "Enter" && sendComment(true, comment.id)
                                                        }
                                                    />
                                                </div>
                                                <BtnCallToAction
                                                    variant="purple"
                                                    className="!px-3 !py-1 !text-sm"
                                                    onClick={() => sendComment(true, comment.id)}
                                                >
                                                    Enviar
                                                </BtnCallToAction>
                                            </div>
                                        )}
                                        {listComments
                                        .filter((reply) => reply.parentComment === comment.id)
                                        .map((reply) => {
                                            const isLikedReply = likedComments.has(reply.id);
                                            return (
                                                <div
                                                    key={reply.id}
                                                    className="ml-12 mt-3 flex gap-3 flex-col w-full border-l-2 border-gray-300 pl-4"
                                                >
                                                    <div className="flex gap-3">
                                                        <img
                                                            src={reply.userAvatarUrl || "/default-avatar.png"}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold">{reply.userName}</p>
                                                                <p className="text-xs text-gray-500 mr-12">
                                                                    {new Intl.DateTimeFormat("pt-BR", {
                                                                    dateStyle: "short",
                                                                    timeStyle: "short",
                                                                    }).format(new Date(reply.createdAt))}
                                                                </p>
                                                            </div>
                                                            <p className="mt-1">{reply.content}</p>

                                                            <div className="flex items-center gap-8 mt-2">
                                                                <button
                                                                    onClick={() => sendLikeToComment(reply.id)}
                                                                    className={`flex items-center cursor-pointer transition hover:text-purple-600 ${
                                                                    isLikedReply ? "text-purple-600" : "text-gray-400"
                                                                    }`}
                                                                    title={
                                                                    isLikedReply
                                                                        ? "Descurtir comentário"
                                                                        : "Curtir comentário"
                                                                    }
                                                                >
                                                                    <Heart
                                                                    fill={
                                                                        isLikedReply
                                                                        ? "var(--purple-primary)"
                                                                        : "transparent"
                                                                    }
                                                                    stroke="currentColor"
                                                                    size={18}
                                                                    />
                                                                    <span
                                                                    className="ml-1 text-sm cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        getListLikesComment(reply.id);
                                                                    }}
                                                                    >
                                                                    {isLikedReply ? "Curtido" : "Curtir"}
                                                                    </span>
                                                                </button>

                                                                {reply.userId === currentUser.id && (
                                                                    <button
                                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                                    onClick={() => {
                                                                        setSelectedCommentId(reply.id);
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                    title="Excluir comentário"
                                                                    >
                                                                    <Trash2 size={18} />
                                                                    <span className="ml-1 text-sm">Excluir</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {listComments.length > commentsToShow && (
                        <button
                            onClick={() => setCommentsToShow((prev) => prev + 2)}
                            className="text-sm text-blue-600 hover:underline mt-2 self-start"
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
                <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">Curtidas</h2>
                {listLikes.length > 0 ? (
                    listLikes.map((user) => (
                    <div
                        key={user.id}
                        className="flex align-content-center px-4 border-t pt-4 border-slate-200 mx-auto md:mx-0"
                    >
                        <div className="relative w-full max-w-[85px] h-[85px] flex-shrink-0 my-auto mr-5">
                        <img
                            src={user.userAvatarUrl || "/default-avatar.png"}
                            className="h-full w-full object-cover rounded-full"
                            alt={user.userName}
                        />
                        </div>
                        <div className="flex flex-col md:flex-row md:w-full justify-between">
                            <div className="flex flex-col max-w-[70%]">
                                <p className="font-semibold truncate">{user.userName}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                Curtiu em {new Intl.DateTimeFormat('pt-BR').format(new Date(user.createdAt))}
                            </p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className='italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70'>
                    Não há nenhuma curtida ainda.
                    </p>
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
                                <div className="relative w-[60px] h-[60px] mr-3">
                                    <img src={user.profileURL} className="h-full w-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <p>{user.userName}</p>
                                    <div className="flex items-center gap-2 text-(--purple-primary) cursor-pointer">
                                        <Earth size={18} /> Pública
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

                        <div className="scale-80 origin-center">
                            <CardPostProfile 
                                key={post.id}
                                post={post}
                                photo={photo}
                                name={name}
                                idAuthor={idAuthor}
                                isOwner={post.isOwner}
                                hideInteractions={true}
                                isShare={true}
                                isFollowing={post.isOwner ? false : (post.author?.isFollowed ?? false)}
                                onFollowToggle={() => handleToggleFollow(post.author.id)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <BtnCallToAction variant="white" onClick={() => setShowConfirmCancel(true)}> Cancelar </BtnCallToAction>
                            <BtnCallToAction variant="purple" onClick={() => { 
                                                                                if (!formData.content.trim()) return; 
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
                    <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">Curtidas do comentário</h2>
                    {listLikesComment.length > 0 ? (
                        listLikesComment.map((user) => (
                        <div
                            key={user.id}
                            className="flex align-content-center px-4 border-t pt-4 border-slate-200 mx-auto md:mx-0"
                        >
                            <div className="relative w-full max-w-[85px] h-[85px] flex-shrink-0 my-auto mr-5">
                            <img
                                src={user.userAvatarUrl || "/default-avatar.png"}
                                className="h-full w-full object-cover rounded-full"
                                alt={user.userName}
                            />
                            </div>
                            <div className="flex flex-col md:flex-row md:w-full justify-between">
                            <div className="flex flex-col max-w-[70%]">
                                <p className="font-semibold truncate">{user.userName}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                Curtiu em {new Intl.DateTimeFormat('pt-BR').format(new Date(user.createdAt))}
                            </p>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className='italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70'>
                        Não há nenhuma curtida neste comentário.
                        </p>
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