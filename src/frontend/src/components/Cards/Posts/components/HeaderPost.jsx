import { useState } from 'react';
import { Edit, Trash2, Eye, Globe, Users, Lock, AlertCircle } from 'lucide-react';
import { updatePostVisibility, deletePost, updatePost } from '../../../../services/timelineService';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';

export default function HeaderPost({ photo, name, communityId, postId, date, isOpen = false, onPostsUpdated }) {
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const size = 18;

  const isCommunity = Boolean(communityId);

  const onEdit = (e) => {
    e.stopPropagation();
    console.log('Edit');
  };

  const onDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const toggleVisibilityDropdown = (e) => {
    e.stopPropagation();
    setShowVisibilityOptions(prev => !prev);
  };

  const changeVisibility = async (value) => {
    try {
      await updatePostVisibility(postId, value);
      setShowVisibilityOptions(false);
      console.log('Visibilidade alterada para:', value);
    } catch (err) {
      console.error('Erro ao alterar visibilidade:', err);
      setError('Erro ao atualizar a visibilidade. Tente novamente.');
    }
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

  return (
    <div className="relative flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-4">
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-start">
            <p className="font-semibold text-base">{name}</p>
            <p className="text-xs text-[var(--purple-primary)] capitalize flex items-center gap-1">
              {isCommunity ? <Users size={14} /> : <Globe size={14} />}
              {isCommunity ? 'Comunidade' : 'Público'}
            </p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>

        {isOpen && (
          <div className="relative flex items-center gap-3">
            <button onClick={onEdit} title="Editar">
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
          onConfirm={() => handleConfirmDelete(postId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}