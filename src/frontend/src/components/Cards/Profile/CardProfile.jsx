import { useState, useRef } from 'react';

import { FaCamera, FaPaperclip, FaCheck, FaPaperPlane, FaSlidersH } from 'react-icons/fa';
import { Check, Plus } from 'lucide-react'

// import defaultProfessional from '../../../assets/profile/FotoPadraoProfissional.png';
// import defaultEnterprise from '../../../assets/profile/FotoPadraoEnterprise.png';

import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction';
import PopUpBlurProfile from './PopUpBlurProfile';
import EditMyProfile from '../../../pages/User/edit/EditMyProfile';
import { changeProfilePicture, listFollowers, listFollowing } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';

export default function CardProfile({
  photo,
  // tipo_usuario,
  name,
  nameuser,
  link,
  email,
  number,
  city,
  state,
  statisticsComponent,
  isCurrentUser,
  followersCount,
  handleFollow,
  followedUser
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(photo);
  const fileInputRef = useRef();
  const [updateProfileError, setUpdateProfileError] = useState('')

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const handleFollowersClick = async () => {
    try {
      const data = await listFollowers();
      console.log('Seguidores:', data);
      setFollowersList(data);
      setShowFollowersModal(true);
    } catch (err) {
      console.error("Erro ao carregar seguidores:", err);
    }
  };

  const handleFollowingClick = async () => {
    try {
      const data = await listFollowing();
      console.log('Seguindo:', data);
      setFollowingList(data);
      setShowFollowingModal(true);
    } catch (err) {
      console.error("Erro ao carregar seguindo:", err);
    }
  };

  // const defaultPhoto = tipo_usuario === 'enterprise' ? defaultEnterprise : defaultProfessional;
  const userPhoto = previewPhoto || defaultPhoto;

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const { user, setUser } = useAuth()
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try{
      const result = await changeProfilePicture(file)
      const updatedUser = { ...user, profilePicture: result.profilePic };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setPreviewPhoto(result.profilePic)
    }catch(err){
      setUpdateProfileError(err.response?.data?.message || 'Erro ao atualizar foto de perfil.')
      setTimeout(() => setUpdateProfileError(null), 4000)
    }
  };

  const copyToClipboard = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <article className="relative bg-white drop-shadow-md rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start w-full max-w-8xl gap-10 z-0">
        {/* Foto com botão */}
        <div className="relative w-full max-w-[250px] h-[250px] flex-shrink-0">
          <div className="w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden">
            <img
              src={userPhoto}
              alt={`Foto de ${name || 'usuária'}`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          {isCurrentUser &&
          <>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-5 right-12 translate-x-1/2 translate-y-1/2 bg-[var(--purple-primary)] hover:bg-[var(--purple-secundary)] text-white p-3 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
            aria-label="Alterar foto do perfil"
          >
            <FaCamera size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          /></>}
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-4 flex-1 min-w-[250px] my-auto">
          <h2 className="text-4xl font-bold text-[var(--purple-primary)]">{name}</h2>

          {nameuser && (
            <p className="text-lg font-semibold text-[var(--purple-secundary)]">{nameuser}</p>
          )}

          {link && (
            <div className="flex items-center gap-2 text-[var(--font-gray)] text-sm">
              <button
                onClick={copyToClipboard}
                aria-label="Copiar link"
                className="text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition-colors"
                type="button"
              >
                {copied ? <FaCheck /> : <FaPaperclip />}
              </button>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--font-gray)] text-s break-all"
              >
                {link}
              </a>
            </div>
          )}

          {email && <p className="text-[var(--font-gray)] text-s break-all">{email}</p>}
          {number && <p className="text-[var(--font-gray)] text-s break-all">{number}</p>}
          {(city || state) && (
            <p className="text-[var(--font-gray)] text-s break-all">
              {city ? city : ''}{city && state ? ', ' : ''}{state ? state : ''}
            </p>
          )}
        </div>

        {/* Botões de ações */}
        <div className="flex flex-col gap-6 w-full max-w-[250px] my-auto order-last md:order-none items-center md:items-start text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition">
          <button
            type="button"
            className="flex items-center mx-auto gap-3"
          >
            <FaPaperPlane size={24} className="text-[var(--font-gray)]" />
            <span className="text-xl font-medium">Compartilhar</span>
          </button>
        {isCurrentUser
          ? <>
          <div className="relative w-full mx-auto flex justify-center md:justify-start">
            <button type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="flex items-center mx-auto gap-3"
            >
              <FaSlidersH size={24} className="text-[var(--font-gray)]" />
              <span className="text-xl font-medium">Configurações</span>
            </button>

            {showOptions && (
              <div
                className={`
                  absolute top-full mt-2 z-50
                  bg-white rounded-xl shadow-lg
                  flex-col gap-2 p-3
                  right-0
                  flex md:hidden
                `}
              >
                <BtnCallToAction variant="white">Excluir Perfil</BtnCallToAction>
                <BtnCallToAction
                  variant="purple"
                  onClick={() => handleOpenModal(<EditMyProfile />)}
                >
                  Editar Perfil
                </BtnCallToAction>
              </div>
            )}
          </div>
          <div>
            <button onClick={handleFollowersClick}
                    className="text-xl font-medium"
            >
                  Seguidores
            </button>
            <span className='p-2'>|</span>
            <button onClick={handleFollowingClick}
                    className="text-xl font-medium"
            >
                  Seguindo
            </button>
          </div>

          {showOptions && (
            <div
              className={`
                absolute flex-col gap-2 p-3
                bg-white rounded-xl shadow-lg
                transition-all duration-300
                right-1/2 md:right-80 top-20 z-40
                hidden md:flex
              `}
            >
              <BtnCallToAction variant="white">Excluir Perfil</BtnCallToAction>
              <BtnCallToAction
                variant="purple"
                onClick={() => handleOpenModal(<EditMyProfile />)}
              >
                Editar Perfil
              </BtnCallToAction>
            </div>
          )}
          <BtnCallToAction
            variant="purple"
            onClick={() => handleOpenModal(statisticsComponent)}
          >
            VER ESTATÍSTICAS
          </BtnCallToAction>
        </>
        : <div className='flex flex-col mx-auto gap-y-2'>
            <p className='mx-auto'>{followersCount} seguidor{followersCount > 1 && 'es'}</p>
            <button onClick={handleFollow}
                    className={`p-4 cursor-pointer mt-3 rounded-2xl 
                              ${followedUser ? 'bg-(--purple-primary) text-white' : 'bg-(--gray)' 
                    }`}>
                {followedUser ? <p className='flex gap-x-4'><Check />Seguindo</p> 
                              : <p className='flex gap-x-4'><Plus/>Seguir</p>}
            </button>
          </div>
        }
      </div>
    </article>

    <PopUpBlurProfile
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      content={modalContent}
    />
    {updateProfileError && (
      <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                      transition-opacity duration-300">
          {updateProfileError}
      </div>
    )}

    <PopUpBlurProfile
      isOpen={showFollowersModal}
      onClose={() => setShowFollowersModal(false)}
      content={
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">Seguidores</h2>
          {followersList.length > 0 ? (
            followersList.map((user) => (
              <div
                key={user.id}
                className="flex align-content-center px-4 border-t pt-4 border-slate-200 mx-auto md:mx-0"
              >
                <div className="relative w-full max-w-[85px] h-[85px] flex-shrink-0 my-auto mr-5">
                  <img
                    src={user.photo || "/default-avatar.png"}
                    className="h-full w-full object-cover rounded-full"
                    alt={user.name}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:w-full justify-between">
                  <div className="flex flex-col max-w-[70%]">
                    <p className="font-semibold truncate">{user.name}</p>
                    {user.nameuser && <p className="truncate">@{user.nameuser}</p>}
                    <p className="text-sm text-gray-500">
                      Seguiu em {user.followedAt}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70'>
              Nenhum seguidor encontrado.
            </p>
          )}
        </div>
      }
    />

    <PopUpBlurProfile
      isOpen={showFollowingModal}
      onClose={() => setShowFollowingModal(false)}
      content={
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">Seguindo</h2>
          {followingList.length > 0 ? (
            followingList.map((user) => (
              <div
                key={user.id}
                className="flex align-content-center px-4 border-t pt-4 border-slate-200 mx-auto md:mx-0"
              >
                <div className="relative w-full max-w-[85px] h-[85px] flex-shrink-0 my-auto mr-5">
                  <img
                    src={user.photo || "/default-avatar.png"}
                    className="h-full w-full object-cover rounded-full"
                    alt={user.name}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:w-full justify-between">
                  <div className="flex flex-col max-w-[70%]">
                    <p className="font-semibold truncate">{user.name}</p>
                    {user.nameuser && <p className="truncate">@{user.nameuser}</p>}
                    <p className="text-sm text-gray-500">
                      Seguiu em {user.followedAt}
                    </p>
                  </div>
                  <div className="my-auto">
                    <BtnCallToAction
                      variant="purple"
                      onClick={() => unfollowUser(user.id)}
                    >
                      Deixar de seguir
                    </BtnCallToAction>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70'>
              Você não está seguindo ninguém.
            </p>
          )}
        </div>
      }
    />
    </>
  )
}