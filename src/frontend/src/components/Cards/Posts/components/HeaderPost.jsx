import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

import { Edit, Trash2, Eye, Globe, Users, Lock, AlertCircle, PencilIcon, TrashIcon, MoreHorizontal } from 'lucide-react';

import { updatePostVisibility, deletePost } from '../../../../services/timelineService';
import { deleteShare } from '../../../../services/interactionsService';
import { getProfilePath } from '../../../../services/profileLink';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';
import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';
import { getErrorMessage } from '../../../../services/errorMessage';

export default function HeaderPost({ photo, name, post, date, isOpen = false, onPostsUpdated = false, onDeleted = null, isShare = false,
                                      isFollowing = null, onFollowToggle = null, handle = null, idAuthor = null, authorType = null, isOwner = false, onEdit = false }) {

  const [showMenu, setShowMenu] = useState(false);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [localVisibility, setLocalVisibility] = useState(post.visibility);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const menuRef = useRef(null);
  const size = 18;

  const isSharedItem = post.type === "COMPARTILHAMENTO";
  const profilePath = getProfilePath(idAuthor, handle, authorType);

  const clearError = () => setError('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // fecha o menu ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!showMenu && !showVisibilityOptions) return;
    const close = () => {
      setShowMenu(false);
      setShowVisibilityOptions(false);
    };
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) close();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMenu, showVisibilityOptions]);

  const changeVisibility = async (value) => {
    clearError();
    try {
      await updatePostVisibility(post.id, value);
      setShowMenu(false);
      setShowVisibilityOptions(false);
      setLocalVisibility(value);
      showSuccess(value === 'PRIVADO' ? 'Publicação agora está privada.' : 'Publicação agora está visível para todos.');
    } catch (err) {
      setLocalVisibility(post.visibility);
      console.error('Erro ao alterar visibilidade:', err);
      setError(getErrorMessage(err, 'A visibilidade não foi alterada.'));
    }
  };

  const onDelete = (e) => {
    e.stopPropagation();
    clearError();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      if (isSharedItem) {
        await deleteShare(post.id);
      } else {
        await deletePost(post.id);
      }
      setShowDeleteModal(false);
      if (onDeleted) onDeleted(post);
      else if (typeof onPostsUpdated === 'function') onPostsUpdated();
      else window.location.reload();
    } catch (err) {
        console.error("Erro ao excluir o post:", err);
        setShowDeleteModal(false);
        setError(getErrorMessage(err, "A publicação não foi excluída."));
    } finally {
      setDeleting(false);
    }
  };

  // o back-end informa se ainda pode editar; o cálculo local fica como reserva
  const canEditPost = () => {
    if (!isOwner || isSharedItem) return false;
    if (typeof post.canEdit === 'boolean') return post.canEdit;
    const diffDays = (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    clearError();
    setShowMenu(false);
    if (!canEditPost()) {
      setError("Você só pode editar publicações feitas nos últimos 7 dias.");
      return;
    }
    if (onEdit) {
      onEdit(post);
    }
  };

  const typeLabel = isSharedItem ? 'compartilhamento' : 'publicação';
  const menuItemClass = "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 focus-visible:bg-gray-100 cursor-pointer";

  return (
    <div className="relative flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-1 items-start min-w-0">
          {profilePath ? (
            <Link to={profilePath} tabIndex={-1} aria-hidden="true" onClick={(e) => e.stopPropagation()}
              className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
              <img src={photo} alt="" loading="lazy" className="w-full h-full object-cover" />
            </Link>
          ) : (
            <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
              <img src={photo} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-col justify-start min-w-0">
            {profilePath ? (
              <Link to={profilePath} onClick={(e) => e.stopPropagation()}
                className="font-semibold text-sm sm:text-base truncate text-[var(--purple-primary)] hover:underline focus-visible:underline">
                {name}
              </Link>
            ) : (
              <p className="font-semibold text-sm sm:text-base truncate">{name}</p>
            )}
            <p className="text-xs text-[var(--purple-primary)] flex items-center">
              {(post.communityId ?? post.idCommunity) ? (
              <>
                <Users size={14} className='mr-2' aria-hidden="true"/> Comunidade
              </>
            ) : localVisibility === 'PRIVADO' ? (
              <>
                <Lock size={14} className='mr-2' aria-hidden="true"/> Privado
              </>
            ) : (
              <>
                <Globe size={14} className='mr-2' aria-hidden="true"/> Público
              </>
            )}
            </p>
            <p className="text-xs text-gray-500">
              <time dateTime={post.createdAt}>{date}</time>
              {post.edited && <span className="italic"> · Editado</span>}
            </p>
          </div>
        </div>

        {!isShare && !isOwner && isFollowing !== null && onFollowToggle && (
          <BtnCallToAction
            onClick={(e) => {
              e.stopPropagation();
              clearError();
              onFollowToggle?.();
            }}
            variant={isFollowing ? 'white' : 'purple'}
            aria-pressed={isFollowing}
            aria-label={isFollowing ? `Deixar de seguir ${name}` : `Seguir ${name}`}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </BtnCallToAction>
        )}

        {isOwner && !isOpen && (
          <div ref={menuRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearError();
                setShowMenu(prev => !prev)
              }}
              aria-label={`Mais opções do ${typeLabel}`}
              aria-haspopup="menu"
              aria-expanded={showMenu}
              className="text-gray-600 hover:text-black p-2 rounded-md"
            >
              <MoreHorizontal size={20} aria-hidden="true" />
            </button>

            {showMenu && (
              <div role="menu" className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border rounded-xl shadow-lg z-20 py-2"
                onClick={(e) => e.stopPropagation()}>
                {!isSharedItem && (
                  <button type="button" role="menuitem" className={menuItemClass} onClick={handleEditClick}>
                    <PencilIcon size={size} aria-hidden="true" /> Editar publicação
                  </button>
                )}

                {!isSharedItem && (
                  <button type="button" role="menuitem" className={menuItemClass}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeVisibility(localVisibility === 'PUBLICO' ? 'PRIVADO' : 'PUBLICO')
                    }}>
                    <Eye size={size} aria-hidden="true"/> {localVisibility === 'PUBLICO' ? 'Tornar privada' : 'Tornar pública'}
                  </button>
                )}

                <button type="button" role="menuitem" className={`${menuItemClass} text-red-600`} onClick={onDelete}>
                  <TrashIcon size={size} className="text-red-600" aria-hidden="true" /> Excluir {typeLabel}
                </button>
              </div>
            )}
          </div>
        )}

        {isOpen && isOwner && (
          <div ref={menuRef} className="relative flex items-center gap-3 mr-2 sm:mr-6" onClick={(e) => e.stopPropagation()}>
            {!isSharedItem && (
              <button type="button" onClick={handleEditClick} aria-label="Editar publicação" className="p-1">
                <Edit size={size} className="cursor-pointer hover:text-gray-700" aria-hidden="true" />
              </button>
            )}

            <button type="button" onClick={onDelete} aria-label={`Excluir ${typeLabel}`} className="p-1">
              <Trash2 size={size} className="cursor-pointer hover:text-red-500" aria-hidden="true" />
            </button>

            {!isSharedItem && (
              <div className="relative">
                <button type="button" onClick={() => setShowVisibilityOptions(prev => !prev)} className="p-1"
                  aria-label="Alterar visibilidade" aria-haspopup="menu" aria-expanded={showVisibilityOptions}>
                  <Eye size={size} className="cursor-pointer hover:text-blue-600" aria-hidden="true" />
                </button>

                {showVisibilityOptions && (
                  <div role="menu" className="absolute right-0 mt-2 w-52 bg-white shadow-xl border rounded-xl z-10 p-2">
                    <button type="button" role="menuitemradio" aria-checked={localVisibility === 'PUBLICO'}
                      className="w-full flex items-center gap-2 text-sm p-2 text-left hover:bg-gray-100 cursor-pointer rounded-lg"
                      onClick={() => changeVisibility('PUBLICO')}
                    >
                      <Globe size={14} aria-hidden="true" /> Visível para todos
                    </button>
                    <button type="button" role="menuitemradio" aria-checked={localVisibility === 'PRIVADO'}
                      className="w-full flex items-center gap-2 text-sm p-2 text-left hover:bg-gray-100 cursor-pointer rounded-lg"
                      onClick={() => changeVisibility('PRIVADO')}
                    >
                      <Lock size={14} aria-hidden="true" /> Apenas você pode ver isso
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="text-sm text-red-600 mt-1 flex items-center gap-2">
          <AlertCircle size={16} aria-hidden="true" /> {error}
        </div>
      )}
      {/* o selo Público/Privado já mostra a mudança; o aviso fica só para leitor de tela */}
      <p role="status" className="sr-only">{successMsg}</p>

      <ConfirmModal
        open={showDeleteModal}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este ${typeLabel}?`}
        confirmText={deleting ? "Excluindo..." : "Excluir"}
        cancelText="Cancelar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
