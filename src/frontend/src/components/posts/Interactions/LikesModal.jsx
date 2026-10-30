import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import PopUpBlurProfile from "../../Cards/Profile/PopUpBlurProfile";
import { getProfilePath } from "../../../services/profileLink";
import defaultProfessionalPhoto from "../../../assets/profile/FotoPadraoProfissional.png";

// Lista de quem curtiu: busca só quando o modal abre
export default function LikesModal({ isOpen, onClose, title, emptyText, loadLikes }) {
    const [likes, setLikes] = useState([]);
    const [status, setStatus] = useState("idle");
    const loadRef = useRef(loadLikes);

    useEffect(() => {
        loadRef.current = loadLikes;
    }, [loadLikes]);

    useEffect(() => {
        if (!isOpen) return;
        let ignore = false;
        setStatus("loading");
        loadRef.current()
            .then((list) => {
                if (ignore) return;
                setLikes(Array.isArray(list) ? list : []);
                setStatus("idle");
            })
            .catch((error) => {
                if (ignore) return;
                console.error("Erro ao buscar curtidas:", error);
                setStatus("error");
            });
        return () => { ignore = true; };
    }, [isOpen]);

    return (
        <PopUpBlurProfile
            isOpen={isOpen}
            onClose={onClose}
            ariaLabel={title}
            content={
                <div className="p-1 sm:p-4">
                    <h2 className="text-2xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">{title}</h2>
                    {status === "loading" && <p role="status" className="text-gray-500">Carregando curtidas...</p>}
                    {status === "error" && <p role="alert" className="text-gray-500">Não foi possível carregar as curtidas. Feche esta janela e abra de novo.</p>}
                    {status === "idle" && (likes.length > 0 ? (
                        <ul className="flex flex-col">
                            {likes.map((like) => {
                                const path = getProfilePath(like.userId, like.userHandle, like.userType);
                                return (
                                    <li key={like.id} className="flex items-center px-2 sm:px-4 border-t py-3 border-slate-200 gap-4">
                                        <img src={like.userAvatarUrl || defaultProfessionalPhoto} alt="" loading="lazy" className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full flex-shrink-0" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between w-full min-w-0 gap-1">
                                            {path ? (
                                                <Link to={path} onClick={onClose} className="font-semibold truncate text-[var(--purple-primary)] hover:underline">{like.userName}</Link>
                                            ) : (
                                                <p className="font-semibold truncate">{like.userName}</p>
                                            )}
                                            <p className="text-xs text-gray-500 whitespace-nowrap">
                                                Curtiu em <time dateTime={like.createdAt}>{new Intl.DateTimeFormat('pt-BR').format(new Date(like.createdAt))}</time>
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="italic text-xl text-gray-400">{emptyText}</p>
                    ))}
                </div>
            }
        />
    );
}
