import { useState, useRef } from 'react';

import { FaCamera, FaPaperclip, FaCheck, FaPaperPlane, FaSlidersH } from 'react-icons/fa';
import { Check, Plus } from 'lucide-react'
import defaultProfessionalPhoto from '../../../assets/profile/FotoPadraoProfissional.png';
import defaultEnterprisePhoto from '../../../assets/profile/FotoPadraoEnterprise.png';

import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction';
import PopUpBlurProfile from './PopUpBlurProfile';
import EditMyProfile from '../../../pages/User/edit/EditMyProfile';
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { changeProfilePicture, listFollowers, listFollowing } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CardProfile({
  photo,
  tipo_usuario,
  name,
  nameuser,
  link,
  copyMyLink,
  city,
  state,
  statisticsComponent,
  isCurrentUser,
  followersCount,
  handleFollow,
  followedUser,
  onRequestDelete
}) {

  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(photo);
  const fileInputRef = useRef();
  const [updateProfileError, setUpdateProfileError] = useState('');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const userPhoto = previewPhoto || (tipo_usuario === 'company' ? defaultEnterprisePhoto : defaultProfessionalPhoto);

  const handleFollowersClick = async () => {
    try {
      const data = await listFollowers();
      setFollowersList(data);
      setShowFollowersModal(true);
    } catch (err) {
      console.error("Erro ao carregar seguidores:", err);
    }
  };

  const handleFollowingClick = async () => {
    try {
      setLoading(true);
      const data = await listFollowing();
      setFollowingList(data);
      setShowFollowingModal(true);
    } catch (err) {
      console.error("Erro ao carregar seguindo:", err);
    } finally{
      setLoading(false);
    }
  };

  const goToUserProfile = async ( userId ) => {
    try {
      setShowFollowersModal(false);
      setShowFollowingModal(false);
      if (user.role === "PROFESSIONAL" || user.role === "professional") {
        navigate(`/profile/professional/${userId}-${nameuser}`);
      } else {
        navigate(`/profile/company/${userId}-${nameuser}`);
      }
    } catch (err) {
      console.log('Erro ao buscar profissional.', err)
    }
  };

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await changeProfilePicture(file)
      const updatedUser = { ...user, profilePicture: result.profilePic };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setPreviewPhoto(result.profilePic)
    } catch(err){
      setUpdateProfileError(err.response?.data?.message || 'Erro ao atualizar foto de perfil.')
      setTimeout(() => setUpdateProfileError(null), 4000)
    }
  };

  const copyToClipboard = (copy) => {
    if (!copy) return;
    navigator.clipboard.writeText(copy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <article className="relative bg-white drop-shadow-md rounded-xl p-6 sm:p-8 w-full max-w-8xl z-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full min-w-0">

          <div className="relative w-26 h-26 sm:w-32 sm:h-32 xl:w-40 xl:h-40 flex-shrink-0">
            <div className="w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden">
              <img
                src={userPhoto}
                alt={`Foto de ${name || 'usuária'}`}
                className="object-cover w-full h-full"
              />
            </div>
            {isCurrentUser && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-[var(--purple-primary)] hover:bg-[var(--purple-secundary)] text-white p-2.5 rounded-full shadow-lg flex items-center justify-center"
                  aria-label="Alterar foto do perfil"
                >
                  <FaCamera size={16} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
              </>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start w-full min-w-0 gap-6">
            <div className="flex flex-col gap-3 flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-2xl xl:text-4xl font-bold text-[var(--purple-primary)] break-words">
                {name}
              </h2>
              {nameuser && (
                <p className="text-sm xl:text-lg font-semibold text-[var(--purple-secundary)] break-words">
                  {nameuser}
                </p>
              )}
              {link && (
                <div className="flex items-center gap-2 text-[var(--font-gray)] text-sm min-w-0">
                  <button
                    onClick={() => copyToClipboard(link)}
                    aria-label="Copiar link"
                    className="flex-shrink-0 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition-colors"
                    type="button"
                  >
                    {copied ? <FaCheck /> : <FaPaperclip />}
                  </button>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--font-gray)] text-sm break-all min-w-0"
                  >
                    {link}
                  </a>
                </div>
              )}

              {(city || state) && (
                <p className="text-[var(--font-gray)] text-sm break-words">
                  {city}{city && state ? ', ' : ''}{state}
                </p>
              )}
            </div>

            <div className="flex flex-row lg:flex-col flex-wrap justify-center lg:justify-start items-center gap-4 flex-shrink-0">
              <button
                type="button"
                className="flex items-center gap-2 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition whitespace-nowrap"
                onClick={() => copyToClipboard(copyMyLink)}
              >
                <FaPaperPlane className="text-xl xl:text-2xl flex-shrink-0" />
                <span className="text-sm font-medium">Compartilhar</span>
              </button>

              {isCurrentUser ? (
                <>
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="flex items-center gap-2 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition whitespace-nowrap"
                    >
                      <FaSlidersH className="text-xl xl:text-2xl flex-shrink-0" />
                      <span className="text-sm font-medium">Configurações</span>
                    </button>
                    {showOptions && (
                      <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl shadow-lg flex flex-col gap-2 p-3 min-w-[160px]">
                        <BtnCallToAction variant="white" onClick={onRequestDelete}>
                          Excluir Perfil
                        </BtnCallToAction>
                        <BtnCallToAction variant="purple" onClick={() => { setShowOptions(false); handleOpenModal(<EditMyProfile />); }}>
                          Editar Perfil
                        </BtnCallToAction>
                      </div>
                    )}
                  </div>

                  {/* Seguidores / Seguindo */}
                  <div className="flex items-center gap-1 text-sm xl:text-base font-medium text-[var(--font-gray)] whitespace-nowrap">
                    <button onClick={handleFollowersClick} className="hover:text-[var(--purple-primary)] transition text-sm font-medium">
                      Seguidores
                    </button>
                    <span className="px-1">|</span>
                    <button onClick={handleFollowingClick} className="hover:text-[var(--purple-primary)] transition text-sm font-medium">
                      Seguindo
                    </button>
                  </div>

                  {/* Ver estatísticas */}
                  <BtnCallToAction variant="purple" onClick={() => handleOpenModal(statisticsComponent)}>
                    VER ESTATÍSTICAS
                  </BtnCallToAction>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-[var(--font-gray)]">
                    {followersCount} seguidor{followersCount !== 1 && 'es'}
                  </p>
                  <button
                    onClick={async () => await handleFollow()}
                    className={`px-6 py-3 cursor-pointer rounded-2xl flex items-center gap-3 text-sm font-medium transition
                      ${followedUser ? 'bg-[var(--purple-primary)] text-white' : 'bg-[var(--gray)] text-[var(--font-gray)]'}`}
                  >
                    {followedUser ? <><Check size={16} /> Seguindo</> : <><Plus size={16} /> Seguir</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {copied && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]
                        bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          Endereço copiado!
        </div>
      )}
      {updateProfileError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]
                        bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          {updateProfileError}
        </div>
      )}

      <PopUpBlurProfile 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        content={modalContent} 
      />

      <PopUpBlurProfile
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        content={
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">Seguidores</h2>
            {followersList.length > 0 ? followersList.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-4 px-4 border-t pt-4 border-slate-200 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => goToUserProfile(u.followerId)}
              >
                <img src={u.followerProfilePic || "/default-avatar.png"} className="w-14 h-14 object-cover rounded-full flex-shrink-0" alt={u.followerName} />
                <div className="flex flex-col min-w-0">
                  <p className="font-semibold truncate">{u.followerName}</p>
                  {u.followerHandle && <p className="text-sm truncate text-gray-500">{u.followerHandle}</p>}
                  <p className="text-xs text-gray-400">Seguiu em {u.followedAt}</p>
                </div>
              </div>
            )) : (
              <p className="italic text-xl text-gray-400">Nenhum seguidor encontrado.</p>
            )}
          </div>
        }
      />

      <PopUpBlurProfile
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        content={
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">Seguindo</h2>
            {followingList.length > 0 ? followingList.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-4 border-t pt-4 border-slate-200">
                <img
                  src={u.followingProfilePic || "/default-avatar.png"}
                  className="w-14 h-14 object-cover rounded-full flex-shrink-0 cursor-pointer"
                  alt={u.followingName}
                  onClick={() => goToUserProfile(u.followingId)}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between w-full min-w-0 gap-2">
                  <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => goToUserProfile(u.followingId)}>
                    <p className="font-semibold truncate">{u.followingName}</p>
                    {u.followingHandle && <p className="text-sm truncate text-gray-500">{u.followingHandle}</p>}
                    <p className="text-xs text-gray-400">Seguiu em {u.followedAt}</p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <BtnCallToAction
                      variant="purple"
                      onClick={async () => {
                        try {
                          await handleFollow(u.followingId, true);
                          setFollowingList((prev) => prev.filter((item) => item.followingId !== u.followingId));
                        } catch (err) {
                          console.error("Erro ao deixar de seguir:", err);
                        }
                      }}
                    >
                      Deixar de seguir
                    </BtnCallToAction>
                  </div>
                </div>
              </div>
            )) : (
              <p className="italic text-xl text-gray-400">Você não está seguindo ninguém.</p>
            )}
          </div>
        }
      />

      {loading && (
        <div className="fixed inset-0 z-50 bg-white/60 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  )
}
