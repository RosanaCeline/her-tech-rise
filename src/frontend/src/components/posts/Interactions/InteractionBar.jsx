import { useState, useEffect, useRef, useId } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share, Earth, Trash2, CornerUpLeft, Send } from "lucide-react";

import PopUpBlurProfile from "../../../components/Cards/Profile/PopUpBlurProfile";
import CardPostProfile from "../../Cards/Posts/CardPostProfile";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";
import LabelInput from "../../form/Label/LabelInput";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import LikesModal from "./LikesModal";

import { useError } from "../../../context/ErrorContext";
import { getCurrentUser } from "../../../services/authService";
import { getProfilePath } from "../../../services/profileLink";
import { getErrorMessage } from "../../../services/errorMessage";
import defaultProfessionalPhoto from "../../../assets/profile/FotoPadraoProfissional.png";
import { sendLikePost, getLikesPost,
            sendCommentPost, getCommentsPost, sendLikeComment, getLikesComment, deleteCommentsPost,
            sendSharePost, sendLikeShare, getLikesShare, sendCommentShare, getCommentsShare,
        } from "../../../services/interactionsService";

const formatDateTime = (value) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

function CommentInput({ value, onChange, onSend, placeholder, label, profileURL, sending }) {
    return (
        <div className="flex items-start gap-2 w-full min-w-0 pt-3">
            <img
                src={profileURL}
                alt=""
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <LabelInput
                    placeholder={placeholder}
                    ariaLabel={label}
                    value={value}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                />
            </div>
            <button
                type="button"
                onClick={onSend}
                disabled={sending || !value.trim()}
                aria-label={label}
                className="flex-shrink-0 flex items-center justify-center bg-[var(--purple-primary)] text-white rounded-lg hover:opacity-90 transition px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <Send size={16} className="@md:hidden" aria-hidden="true" />
                <span className="hidden @md:inline text-xs">{sending ? "Enviando..." : "Enviar"}</span>
            </button>
        </div>
    );
}

function CommentItem({ comment, isReply = false, canDelete, onToggleLike, onShowLikes, onReply, isReplying, onDelete, children }) {
    const profilePath = getProfilePath(comment.userId, comment.userHandle, comment.userType);
    const liked = !!comment.likedByMe;
    const likes = comment.countCommentLikes ?? 0;

    return (
        <div className="flex gap-3 w-full min-w-0">
            <img
                src={comment.userAvatarUrl || defaultProfessionalPhoto}
                alt=""
                loading="lazy"
                className={`${isReply ? "w-8 h-8" : "w-9 h-9"} rounded-full object-cover flex-shrink-0 mt-1`}
            />
            <div className="flex flex-col w-full min-w-0">
                <div className="flex justify-between items-start gap-2">
                    {profilePath ? (
                        <Link to={profilePath} className="font-semibold text-sm truncate text-[var(--purple-primary)] hover:underline">{comment.userName}</Link>
                    ) : (
                        <p className="font-semibold text-sm truncate">{comment.userName}</p>
                    )}
                    <time dateTime={comment.createdAt} className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                        {formatDateTime(comment.createdAt)}
                    </time>
                </div>
                <p className="mt-1 text-sm text-gray-700 break-words whitespace-pre-wrap">{comment.content}</p>

                <div className="flex items-center gap-4 mt-2 flex-wrap text-xs">
                    <button
                        type="button"
                        onClick={() => onToggleLike(comment)}
                        aria-pressed={liked}
                        aria-label={liked ? `Descurtir comentário de ${comment.userName}` : `Curtir comentário de ${comment.userName}`}
                        className={`flex items-center gap-1 cursor-pointer transition hover:text-purple-600 ${liked ? "text-purple-700" : "text-gray-500"}`}
                    >
                        <Heart fill={liked ? "var(--purple-primary)" : "transparent"} stroke="currentColor" size={14} aria-hidden="true" />
                        <span>{liked ? "Curtido" : "Curtir"}</span>
                    </button>

                    {likes > 0 && (
                        <button
                            type="button"
                            onClick={() => onShowLikes(comment.id)}
                            aria-label={`Ver quem curtiu (${likes} ${likes === 1 ? "curtida" : "curtidas"})`}
                            className="text-gray-500 hover:text-purple-600 hover:underline cursor-pointer"
                        >
                            {likes} {likes === 1 ? "curtida" : "curtidas"}
                        </button>
                    )}

                    {!isReply && (
                        <button
                            type="button"
                            className="flex items-center gap-1 cursor-pointer text-gray-500 transition hover:text-purple-600"
                            aria-expanded={isReplying}
                            onClick={() => onReply(comment.id)}
                        >
                            <CornerUpLeft size={14} aria-hidden="true" />
                            <span>Responder</span>
                        </button>
                    )}

                    {canDelete && (
                        <button
                            type="button"
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 cursor-pointer"
                            aria-label={`Excluir comentário de ${comment.userName}`}
                            onClick={() => onDelete(comment)}
                        >
                            <Trash2 size={14} aria-hidden="true" />
                            <span>Excluir</span>
                        </button>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}

export default function InteractionBar({ idAuthor, post, photo, name, onStatsChange = null }) {

    const currentUser = getCurrentUser();
    const user = {
        userName: currentUser.name,
        profileURL: currentUser.profilePicture
    };
    const { showError } = useError();
    const commentsId = useId();
    const isPost = post.type === "POSTAGEM";
    const isShareItem = post.type === "COMPARTILHAMENTO";

    const [hasLiked, setHasLiked] = useState(post.likedByMe ?? false);
    const [likesCount, setLikesCount] = useState(post.countLike || 0);
    const [commentsCount, setCommentsCount] = useState(post.countComment || 0);
    const [shareCount, setShareCount] = useState(post.countShares || 0);
    const pending = useRef(new Set());

    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesCommentId, setLikesCommentId] = useState(null);

    const [showComments, setShowComments] = useState(false);
    const [commentsStatus, setCommentsStatus] = useState("idle");
    const [listComments, setListComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [sendingComment, setSendingComment] = useState(false);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [deletingComment, setDeletingComment] = useState(false);

    const [showShareModal, setShareModal] = useState(false);
    const [shareContent, setShareContent] = useState("");
    const [sharing, setSharing] = useState(false);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [shareStatus, setShareStatus] = useState("");

    // acompanha os valores vindos do pai (ex.: o mesmo post aberto no pop-up e no feed)
    useEffect(() => { if (typeof post.likedByMe === "boolean") setHasLiked(post.likedByMe); }, [post.likedByMe]);
    useEffect(() => { setLikesCount(post.countLike || 0); }, [post.countLike]);
    useEffect(() => { setCommentsCount(post.countComment || 0); }, [post.countComment]);
    useEffect(() => { setShareCount(post.countShares || 0); }, [post.countShares]);

    // quem não envia `likedByMe` (telas antigas) continua descobrindo a curtida pela lista
    useEffect(() => {
        if (typeof post.likedByMe === "boolean" || !post?.id) return;
        let ignore = false;
        const request = isShareItem ? getLikesShare(post.id) : getLikesPost(post.id);
        request
            .then((list) => {
                if (!ignore && Array.isArray(list)) setHasLiked(list.some((like) => like.userId === currentUser.id));
            })
            .catch((error) => console.error("Erro ao buscar curtidas:", error));
        return () => { ignore = true; };
    }, [post.id, post.likedByMe, isShareItem, currentUser.id]);

    const runOnce = async (key, action) => {
        if (pending.current.has(key)) return;
        pending.current.add(key);
        try {
            await action();
        } finally {
            pending.current.delete(key);
        }
    };

    const sendLike = () => runOnce("like", async () => {
        const willLike = !hasLiked;
        const nextCount = Math.max(likesCount + (willLike ? 1 : -1), 0);
        setHasLiked(willLike);
        setLikesCount(nextCount);
        try {
            if (isShareItem) await sendLikeShare(post.id);
            else await sendLikePost(post.id);
            onStatsChange?.({ likedByMe: willLike, countLike: nextCount });
        } catch (error) {
            console.error("Erro ao curtir post:", error);
            setHasLiked(!willLike);
            setLikesCount(likesCount);
            showError(getErrorMessage(error, "Não foi possível curtir a publicação."));
        }
    });

    const loadComments = async () => {
        setCommentsStatus("loading");
        try {
            const list = isShareItem ? await getCommentsShare(post.id) : await getCommentsPost(post.id);
            setListComments(Array.isArray(list) ? list : []);
            setCommentsStatus("idle");
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
            setCommentsStatus("error");
        }
    };

    const toggleComments = () => {
        if (!showComments) loadComments();
        setShowComments((prev) => !prev);
    };

    const sendComment = (parentCommentId = null) => runOnce("comment", async () => {
        const isReply = parentCommentId !== null;
        const contentToSend = (isReply ? replyContent : newComment).trim();
        if (!contentToSend) return;
        setSendingComment(true);
        try {
            const payload = { content: contentToSend, parentCommentId: isReply ? Number(parentCommentId) : null };
            const created = isShareItem
                ? await sendCommentShare(post.id, payload)
                : await sendCommentPost(post.id, payload);

            setListComments((prev) => [
                {
                    ...created,
                    userHandle: created?.userHandle,
                    userAvatarUrl: created?.userAvatarUrl ?? currentUser.profilePicture,
                    parentComment: created?.parentComment ?? payload.parentCommentId,
                    countCommentLikes: 0,
                    likedByMe: false,
                },
                ...prev
            ]);
            const nextCount = commentsCount + 1;
            setCommentsCount(nextCount);
            onStatsChange?.({ countComment: nextCount });
            if (isReply) {
                setReplyContent("");
                setReplyingToCommentId(null);
            } else {
                setNewComment("");
            }
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            showError(getErrorMessage(error, "Seu comentário não foi enviado, mas o texto continua no campo."));
        } finally {
            setSendingComment(false);
        }
    });

    const updateComment = (commentId, changes) => {
        setListComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, ...changes } : c)));
    };

    const toggleCommentLike = (comment) => runOnce(`comment-like-${comment.id}`, async () => {
        const liked = !!comment.likedByMe;
        const count = comment.countCommentLikes ?? 0;
        updateComment(comment.id, { likedByMe: !liked, countCommentLikes: Math.max(count + (liked ? -1 : 1), 0) });
        try {
            await sendLikeComment(comment.id);
        } catch (error) {
            console.error("Erro ao curtir comentário:", error);
            updateComment(comment.id, { likedByMe: liked, countCommentLikes: count });
            showError(getErrorMessage(error, "Não foi possível curtir o comentário."));
        }
    });

    const handleDeleteComment = async () => {
        if (!commentToDelete || deletingComment) return;
        setDeletingComment(true);
        try {
            await deleteCommentsPost(commentToDelete.id);
            // as respostas são apagadas junto com o comentário no banco
            const removedIds = new Set([commentToDelete.id]);
            listComments.forEach((c) => { if (c.parentComment === commentToDelete.id) removedIds.add(c.id); });
            setListComments((prev) => prev.filter((c) => !removedIds.has(c.id)));
            const nextCount = Math.max(commentsCount - removedIds.size, 0);
            setCommentsCount(nextCount);
            onStatsChange?.({ countComment: nextCount });
            setCommentToDelete(null);
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
            setCommentToDelete(null);
            showError(getErrorMessage(error, "O comentário não foi excluído."));
        } finally {
            setDeletingComment(false);
        }
    };

    const closeShareModal = () => {
        setShareModal(false);
        setShareContent("");
    };

    const sendShare = () => runOnce("share", async () => {
        if (!isPost) return;
        setSharing(true);
        try {
            // o texto é opcional: em branco, compartilha só a publicação
            await sendSharePost(post.id, shareContent.trim() || null);
            closeShareModal();
            const nextCount = shareCount + 1;
            setShareCount(nextCount);
            onStatsChange?.({ countShares: nextCount });
            setShareStatus("Publicação compartilhada no seu perfil.");
            setTimeout(() => setShareStatus(""), 4000);
        } catch (error) {
            console.error("Erro ao compartilhar:", error);
            showError(getErrorMessage(error, "A publicação não foi compartilhada."));
        } finally {
            setSharing(false);
        }
    });

    // pode excluir: quem comentou ou o dono da publicação/compartilhamento (mesma regra do back-end)
    const canDeleteComment = (comment) => comment.userId === currentUser.id || !!post.isOwner;

    const topLevelComments = listComments.filter((comment) => !comment.parentComment);
    const likeLabel = `${likesCount} ${likesCount === 1 ? "curtida" : "curtidas"}`;
    const commentLabel = `${commentsCount} ${commentsCount === 1 ? "comentário" : "comentários"}`;
    const shareLabel = `${shareCount} ${shareCount === 1 ? "compartilhamento" : "compartilhamentos"}`;

    return (
        <div className="interaction-bar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-sm text-(--purple-primary) mt-3">
                <button type="button" className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                        onClick={() => setShowLikesModal(true)}
                        aria-label={`Ver quem curtiu (${likeLabel})`}>
                    <Heart size={15} aria-hidden="true" />
                    <span>{likesCount}</span>
                    <span className="hidden @md:inline text-xs">curtidas</span>
                </button>

                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                            onClick={toggleComments}
                            aria-expanded={showComments}
                            aria-controls={commentsId}
                            aria-label={`${showComments ? "Ocultar" : "Ver"} comentários (${commentLabel})`}>
                        <MessageCircle className="@md:hidden" size={18} aria-hidden="true" />
                        <span>{commentsCount}</span>
                        <span className="hidden @md:inline text-xs">comentários</span>
                    </button>

                    {isPost && (
                        <>
                            <span aria-hidden="true">|</span>
                            <span className="flex items-center gap-1" aria-label={shareLabel}>
                                <Share className="@md:hidden" size={18} aria-hidden="true" />
                                <span aria-hidden="true">{shareCount}</span>
                                <span className="hidden @md:inline text-xs" aria-hidden="true">compartilhamentos</span>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <hr className="border-t border-gray-300 my-3" />

            <div className="grid grid-cols-3 text-center @md:flex @md:justify-between text-(--purple-primary) text-sm sm:text-base md:text-lg">
                <button type="button" onClick={sendLike} aria-pressed={hasLiked}
                        aria-label={hasLiked ? "Descurtir publicação" : "Curtir publicação"}
                        className="flex items-center justify-center gap-2 cursor-pointer transition duration-300 hover:scale-105 py-1" >
                    <Heart
                        fill={hasLiked ? "var(--purple-primary)" : "transparent"}
                        stroke={hasLiked ? "var(--purple-primary)" : "currentColor"}
                        aria-hidden="true"
                    />
                    <span className="hidden @md:inline text-xs">{hasLiked ? "Curtido" : "Curtir"}</span>
                </button>

                <button
                    type="button"
                    onClick={toggleComments}
                    aria-expanded={showComments}
                    aria-controls={commentsId}
                    aria-label="Comentar"
                    className="flex items-center justify-center gap-2 cursor-pointer transition duration-300 hover:scale-105 py-1"
                >
                    <MessageCircle aria-hidden="true" />
                    <span className="hidden @md:inline text-xs">Comentar</span>
                </button>

                <button
                    type="button"
                    onClick={() => { if (isPost) setShareModal(true); }}
                    disabled={!isPost}
                    aria-label={isPost ? "Compartilhar esta publicação" : "Não é possível compartilhar um compartilhamento"}
                    title={isPost ? "Compartilhar esta publicação" : "Não é possível compartilhar porque isso já é um compartilhamento."}
                    className={`flex items-center justify-center gap-2 transition duration-300 py-1 ${
                        isPost ? "cursor-pointer hover:scale-105" : "opacity-50 cursor-not-allowed"
                    }`}
                >
                    <Share aria-hidden="true" />
                    <span className="hidden @md:inline text-xs">Compartilhar</span>
                </button>
            </div>

            {shareStatus && (
                <p role="status" className="mt-2 text-sm text-green-700 text-center">{shareStatus}</p>
            )}

            {showComments && (
                <section id={commentsId} aria-label="Comentários" className="mt-4 flex flex-col gap-4 w-full min-w-0 pb-1">
                    <CommentInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onSend={() => sendComment()}
                        placeholder="Escreva um comentário..."
                        label="Enviar comentário"
                        profileURL={user.profileURL}
                        sending={sendingComment}
                    />

                    {commentsStatus === "loading" && listComments.length === 0 && (
                        <p role="status" className="text-sm text-gray-500">Carregando comentários...</p>
                    )}
                    {commentsStatus === "error" && (
                        <p role="alert" className="text-sm text-gray-500">
                            Não foi possível carregar os comentários.{" "}
                            <button type="button" onClick={loadComments} className="font-semibold text-[var(--purple-primary)] hover:underline">Tentar novamente</button>
                        </p>
                    )}

                    {topLevelComments
                        .slice(0, commentsToShow)
                        .map((comment) => {
                            const replies = listComments.filter((r) => r.parentComment === comment.id);
                            return (
                                <div key={comment.id} className="flex flex-col gap-2 w-full min-w-0 pt-2 border-t border-gray-100">
                                    <CommentItem
                                        comment={comment}
                                        canDelete={canDeleteComment(comment)}
                                        onToggleLike={toggleCommentLike}
                                        onShowLikes={setLikesCommentId}
                                        onReply={(id) => setReplyingToCommentId(replyingToCommentId === id ? null : id)}
                                        isReplying={replyingToCommentId === comment.id}
                                        onDelete={setCommentToDelete}
                                    >
                                        {replyingToCommentId === comment.id && (
                                            <div className="ml-2 sm:ml-4 min-w-0 pr-1">
                                                <CommentInput
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    onSend={() => sendComment(comment.id)}
                                                    placeholder="Escreva uma resposta..."
                                                    label={`Responder a ${comment.userName}`}
                                                    profileURL={user.profileURL}
                                                    sending={sendingComment}
                                                />
                                            </div>
                                        )}

                                        {replies.length > 0 && (
                                            <div className="ml-2 sm:ml-4 flex flex-col gap-3 border-l-2 border-gray-200 pl-3 min-w-0 pt-3">
                                                {replies.map((reply) => (
                                                    <CommentItem
                                                        key={reply.id}
                                                        comment={reply}
                                                        isReply={true}
                                                        canDelete={canDeleteComment(reply)}
                                                        onToggleLike={toggleCommentLike}
                                                        onShowLikes={setLikesCommentId}
                                                        onDelete={setCommentToDelete}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </CommentItem>
                                </div>
                            );
                        })}

                    {topLevelComments.length > commentsToShow && (
                        <button
                            type="button"
                            onClick={() => setCommentsToShow((prev) => prev + 2)}
                            className="text-sm text-[var(--purple-primary)] hover:underline mt-1 self-start"
                        >
                            Ver mais comentários
                        </button>
                    )}
                </section>
            )}

            <LikesModal
                isOpen={showLikesModal}
                onClose={() => setShowLikesModal(false)}
                title="Curtidas"
                emptyText="Não há nenhuma curtida ainda."
                loadLikes={() => (isShareItem ? getLikesShare(post.id) : getLikesPost(post.id))}
            />

            <LikesModal
                isOpen={likesCommentId !== null}
                onClose={() => setLikesCommentId(null)}
                title="Curtidas do comentário"
                emptyText="Não há nenhuma curtida neste comentário."
                loadLikes={() => getLikesComment(likesCommentId)}
            />

            <PopUpBlurProfile
                isOpen={showShareModal}
                onClose={() => (shareContent.trim() ? setShowConfirmCancel(true) : closeShareModal())}
                ariaLabel="Compartilhar publicação"
                content={
                    <div className="flex flex-col gap-4">
                        <h2 className="sr-only">Compartilhar publicação</h2>
                        <div className="flex items-center">
                            <img src={user.profileURL} alt="" className="w-14 h-14 object-cover rounded-full mr-3 flex-shrink-0" />
                            <div className="flex flex-col">
                                <p>{user.userName}</p>
                                <p className="flex items-center gap-2 text-(--purple-primary) text-sm">
                                    <Earth size={16} aria-hidden="true" /> Pública
                                </p>
                            </div>
                        </div>

                        <LabelInput
                            placeholder="Escreva algo sobre esta publicação (opcional)"
                            ariaLabel="Texto do compartilhamento (opcional)"
                            type="mensagem"
                            value={shareContent}
                            onChange={(e) => setShareContent(e.target.value)}
                        />

                        <div className="border border-[var(--purple-primary)] rounded-xl p-3">
                            <CardPostProfile
                                post={post}
                                photo={photo}
                                name={name}
                                idAuthor={idAuthor}
                                hideInteractions={true}
                                isPopupView={true}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <BtnCallToAction variant="white" onClick={() => (shareContent.trim() ? setShowConfirmCancel(true) : closeShareModal())}> Cancelar </BtnCallToAction>
                            <BtnCallToAction variant="purple" onClick={sendShare} disabled={sharing} aria-busy={sharing || undefined}>
                                {sharing ? "Compartilhando..." : "Compartilhar"}
                            </BtnCallToAction>
                        </div>
                    </div>
                }
            />

            <ConfirmModal
                open={showConfirmCancel}
                title="Confirmar Cancelamento"
                message="Tem certeza que deseja descartar este compartilhamento?"
                confirmText="Sim"
                cancelText="Não"
                onConfirm={() => {
                    setShowConfirmCancel(false);
                    closeShareModal();
                }}
                onCancel={() => setShowConfirmCancel(false)}
            />

            <ConfirmModal
                open={commentToDelete !== null}
                title="Excluir comentário"
                message="Tem certeza de que deseja excluir este comentário? Essa ação não pode ser desfeita."
                confirmText={deletingComment ? "Excluindo..." : "Sim"}
                cancelText="Não"
                loading={deletingComment}
                onCancel={() => setCommentToDelete(null)}
                onConfirm={handleDeleteComment}
            />

        </div>
    );
}
