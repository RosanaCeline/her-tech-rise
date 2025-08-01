import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Earth, Lock } from "lucide-react";
import PopUpBlurProfile from "../../../components/Cards/Profile/PopUpBlurProfile";
import { getCurrentUser } from "../../../services/authService";
import { getCountInteractionsPost, sendLikePost, sendCommentPost, sendSharePost, getLikesPost, getCommentsPost,  } from "../../../services/interactionsService";
import CardPostProfile from "../../Cards/Posts/CardPostProfile";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";
import LabelInput from "../../form/Label/LabelInput";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";

export default function InteractionBar({ post, cardWidth }) {
    const currentUser = getCurrentUser();
    const isCompact = cardWidth < 600;
    const [hasLiked, setHasLiked] = useState(false);

    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);

    const [listLikes, setListLikes] = useState([]);
    const [showLikesModal, setShowLikesModal] = useState(false);

    const [listComments, setListComments] = useState([]);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showCommentsInput, setShowCommentsInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentsToShow, setCommentsToShow] = useState(2);

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

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const { likes, comments, shares } = await getCountInteractionsPost(post.id);
                setLikesCount(likes);
                setCommentsCount(comments);
                setShareCount(shares);

                const likesList = await getLikesPost(post.id);
                setListLikes(likesList);
                const userAlreadyLiked = likesList.some(like => like.userId === currentUser.id);
                setHasLiked(userAlreadyLiked);
            } catch (error) {
                console.error("Erro ao buscar contagens de interações:", error);
            }
        };
        fetchCounts();
    }, [post.id]);

    const sendLike = async () => {
        try {
            await sendLikePost(post.id);
            setHasLiked((prev) => {
                const newLiked = !prev;
                setLikesCount((prevCount) => {
                    if (newLiked) return prevCount + 1; 
                    return Math.max(prevCount - 1, 0); 
                });
                return newLiked;
            });
        } catch (error) {
            console.error("Erro ao curtir:", error);
        }
    };

    // Problem
    const sendComment = async () => {
        try {
            await sendCommentPost(post.id, { content: newComment });
            setNewComment("");
            await fetchComments();
            setCommentsCount((prev) => prev + 1);
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
        }
    };

    const sendShare = async (content) => {
        try {
            await sendSharePost(post.id, content);
            setShareModal(false);
            setFormData({ content: "", media: [], visibility: "PUBLICO" });
            setShareCount((prev) => prev + 1);
            console.log("Compartilhado com sucesso!");
        } catch (error) {
            console.error("Erro ao compartilhar:", error);
        }
    };

    // Problem
    const getListLikes = async () => {
        try {
            const list = await getLikesPost(post.id);
            console.log(post.id);
            console.log("🔍 Resposta bruta da API:", list);
            setListLikes(list);
            setShowLikesModal(true);
        } catch (error) {
            console.error("Erro ao pegar lista de curtidas:", error);
        }
    };

    // Problem
    const getListComments = async () => {
        try {
            const list = await getCommentsPost(post.id);
            console.log("🔍 Resposta bruta da API:", list);
            setListComments(list);
            setShowCommentsModal(true);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        }
    };

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
                        onClick={getListComments}>
                    {isCompact && <MessageCircle className="purple-primary" size={15} />}
                    <span>{commentsCount}</span>
                    {!isCompact && <span className="text-xs">comentários</span>}
                </button>

                <span>|</span>

                <button className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                    {isCompact && <Share className="purple-primary" size={15} />}
                    <span>{shareCount}</span>
                    {!isCompact && <span className="text-xs">compartilhamentos</span>}
                </button>
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
            onClick={() => setShareModal(true)}
            className="flex items-center gap-2 cursor-pointer transition duration-300 hover:scale-105"
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

                {listComments.slice(0, commentsToShow).map((comment) => (
                <div key={comment.id} className="pt-3 flex gap-3">
                    <img
                    src={comment.userAvatarUrl || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold">{comment.userName}</p>
                        <p>{comment.content}</p>
                        <p className="text-xs text-gray-500">
                            {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                            }).format(new Date(comment.createdAt))}
                        </p>
                    </div>
                </div>
                ))}

                {/* Botão Ver mais */}
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
                                <div className="flex items-center gap-2 text-(--purple-primary) cursor-pointer"
                                    onClick={() =>
                                        setChangeVisibilityPopup((prev) => !prev)
                                    }
                                >
                                {formData.visibility === "PUBLICO" ? (
                                    <> <Earth size={18} /> Pública  </>
                                ) : (
                                    <> <Lock size={18} /> Privada </>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {changeVisibilityPopup && (
                        <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-xl w-fit">
                        <p className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-xs"
                            onClick={() => changeVisibility("PUBLICO")}
                        >
                            Visível para todos
                        </p>
                        <p className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-xs"
                            onClick={() => changeVisibility("PRIVADO")}
                        >
                            Apenas você pode ver isso
                        </p>
                        </div>
                    )}

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
                            photo={post.author?.profilePic}
                            name={post.author?.name}
                            idAuthor={post.author?.id}
                            handle={post.author?.handle}
                            isOwner={post.isOwner}
                            isShare={true}
                            isFollowing={post.isOwner ? null : post.author.isFollowed}
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
    </div>
  );
}