import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Globe, Users, Lock, AlertCircle } from 'lucide-react';
import { updatePostVisibility, deletePost } from '../../../../services/timelineService';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';
import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';

const baseUrl = import.meta.env.VITE_API_URL;

export default function HeaderPost({ photo, name, post, date, isOpen = false, onPostsUpdated = false, 
                                      isFollowing = null, onFollowToggle = null, handle = null, idAuthor = null, isOwner = false, onEdit = false }) {
  const navigate = useNavigate();
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const size = 18;

  const toggleVisibilityDropdown = (e) => {
    e.stopPropagation();
    setShowVisibilityOptions(prev => !prev);
  };

  const changeVisibility = async (value) => {
    try {
      await updatePostVisibility(post.id, value);
      setShowVisibilityOptions(false);
      console.log("Visibilidade do Post alterado com sucesso.");
    } catch (err) {
      console.error('Erro ao alterar visibilidade:', err);
      setError('Erro ao atualizar a visibilidade. Tente novamente.');
    }
  };

  const onDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (postId) => {
    try {
      await deletePost(postId);
      setShowDeleteModal(false);
      console.log("Post excluído com sucesso.");
      if(onPostsUpdated) {
        onPostsUpdated();  
      }
      window.location.reload();
    } catch (err) {
      console.error("Erro ao excluir o post:", err);
      setShowDeleteModal(false);
      setError(err.message || "Erro ao excluir o post. Tente novamente.");
    }
  };

  const canEditPost = () => {
    if (!isOwner) return false;
    const createdAt = new Date(post.createdAt);
    const now = new Date();
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24); 
    return diffDays <= 7;
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (!canEditPost()) {
      setError("Você só pode editar publicações feitas nos últimos 7 dias.");
      return;
    }
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleNavigateProfile = async () => {
    if (isFollowing !== null) {
        const professionalPath = `/profile/professional/${idAuthor}-${handle}`;
        const companyPath = `/profile/company/${idAuthor}-${handle}`;

        try {
          const response = await fetch(`${baseUrl}/profile/professional/${idAuthor}`);
          if (response.ok) {
            navigate(professionalPath);
          } else {
            navigate(companyPath);
          }
        } catch (err) {
          navigate(companyPath);
        }
      }
    };

  return (
    <div className="relative flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-4">
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-start">
            <p className={`font-semibold text-base ${
                isFollowing !== null ? "text-[var(--purple-primary)] cursor-pointer hover:underline" : ""
              }`}
              onClick={handleNavigateProfile}
            >
              {name}
            </p>
            <p className="text-xs text-[var(--purple-primary)] capitalize flex items-center gap-1">
              {post.communityId ? (
              <>
                <Users size={14} /> Comunidade
              </>
            ) : post.visibility === 'PRIVADO' ? (
              <>
                <Lock size={14} /> Privado
              </>
            ) : (
              <>
                <Globe size={14} /> Público
              </>
            )}
            </p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>

        {onPostsUpdated === true && (
          <div className="flex justify-end text-xs text-gray-500 italic">
            Editado
          </div>
        )}

        {!isOwner && isFollowing !== null && onFollowToggle && (
          <BtnCallToAction
            onClick={onFollowToggle}
            variant={isFollowing ? 'white' : 'purple'}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </BtnCallToAction>
        )}

        {isOpen && isOwner && (
          <div className="relative flex items-center gap-3">
            <button onClick={handleEditClick} title="Editar">
              <Edit size={size} className="cursor-pointer hover:text-gray-700" />
            </button>

            <button onClick={onDelete} title="Excluir">
              <Trash2 size={size} className="cursor-pointer hover:text-red-500" />
            </button>

            <div className="relative">
              <button onClick={toggleVisibilityDropdown} title="Alterar visibilidade">
                <Eye size={size} className="cursor-pointer hover:text-blue-600" />
              </button>

              {showVisibilityOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border rounded-xl z-10 p-2">
                  <p
                    className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    onClick={() => changeVisibility('PUBLICO')}
                  >
                    <Globe size={14} /> Visível para todos
                  </p>
                  <p
                    className="flex items-center gap-2 text-sm p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    onClick={() => changeVisibility('PRIVADO')}
                  >
                    <Lock size={14} /> Apenas você pode ver isso
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 mt-1 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {showDeleteModal && (
        <ConfirmModal
          open={showDeleteModal}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta publicação?"
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={() => handleConfirmDelete(post.id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}