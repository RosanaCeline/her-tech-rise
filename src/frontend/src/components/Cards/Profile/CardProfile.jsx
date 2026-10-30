import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FaCamera, FaTrashAlt, FaPaperclip, FaCheck, FaPaperPlane, FaSlidersH, FaChartBar } from 'react-icons/fa';
import { Check, Plus } from 'lucide-react'
import defaultProfessionalPhoto from '../../../assets/profile/FotoPadraoProfissional.png';
import defaultEnterprisePhoto from '../../../assets/profile/FotoPadraoEnterprise.png';

import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction';
import PopUpBlurProfile from './PopUpBlurProfile';
import EditMyProfile from '../../../pages/User/edit/EditMyProfile';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import { changeProfilePicture, removeProfilePicture, listFollowers, listFollowing, unfollowUser } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import { updateStoredUser } from '../../../services/authService';
import { toSafeUrl } from '../../../services/safeUrl';
import { getProfilePath } from '../../../services/profileLink';
import { getErrorMessage } from '../../../services/errorMessage';

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // mesmo limite do back-end

// a foto padrão vem do back-end como uma URL "default_profile_..."
const isDefaultPhoto = (url) => !url || url.includes('default_profile');

const plural = (count, singular, pluralWord) => `${count} ${count === 1 ? singular : pluralWord}`;

// Lista de seguidores/seguindo: cada pessoa leva ao próprio perfil
function FollowList({ title, status, people, emptyText, onNavigate, onRetry, renderAction }) {
  return (
    <div className="p-1 sm:p-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-4">{title}</h2>
      {status === 'loading' && <p role="status" className="text-gray-500">Carregando...</p>}
      {status === 'error' && (
        <p role="alert" className="text-gray-500">
          Não foi possível carregar a lista.{' '}
          <button type="button" onClick={onRetry} className="font-semibold text-[var(--purple-primary)] hover:underline">Tentar novamente</button>
        </p>
      )}
      {status === 'idle' && (people.length > 0 ? (
        <ul className="flex flex-col">
          {people.map((person) => {
            const path = getProfilePath(person.id, person.handle, person.type);
            return (
              <li key={person.key} className="flex items-center gap-4 px-2 sm:px-4 py-3 border-t border-slate-200">
                <img src={person.photo || defaultProfessionalPhoto} alt="" loading="lazy" className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full min-w-0 gap-2">
                  <div className="flex flex-col min-w-0">
                    {path ? (
                      <Link to={path} onClick={onNavigate} className="font-semibold truncate text-[var(--purple-primary)] hover:underline">{person.name}</Link>
                    ) : (
                      <p className="font-semibold truncate">{person.name}</p>
                    )}
                    {person.handle && <p className="text-sm truncate text-gray-500">{person.handle}</p>}
                    {person.followedAt && <p className="text-xs text-gray-400">Desde {person.followedAt}</p>}
                  </div>
                  {renderAction && <div className="flex-shrink-0">{renderAction(person)}</div>}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="italic text-xl text-gray-400">{emptyText}</p>
      ))}
    </div>
  );
}

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
  followingCount,
  handleFollow,
  followedUser,
  onRequestDelete,
  onProfileUpdated
}) {

  const { setUser } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalLabel, setModalLabel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(photo);
  const fileInputRef = useRef();
  const optionsRef = useRef(null);
  const [updateProfileError, setUpdateProfileError] = useState('');
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [confirmRemovePhoto, setConfirmRemovePhoto] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const userPhoto = previewPhoto || (tipo_usuario === 'company' ? defaultEnterprisePhoto : defaultProfessionalPhoto);
  const hasCustomPhoto = !isDefaultPhoto(previewPhoto);

  // o perfil chega depois do primeiro render (e muda ao salvar a edição)
  useEffect(() => { setPreviewPhoto(photo); }, [photo]);

  // qual lista está aberta: 'followers' | 'following' | null
  const [openList, setOpenList] = useState(null);
  const [listStatus, setListStatus] = useState('idle');
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [unfollowingId, setUnfollowingId] = useState(null);
  const [followersTotal, setFollowersTotal] = useState(followersCount ?? 0);
  const [followingTotal, setFollowingTotal] = useState(followingCount ?? 0);

  useEffect(() => { setFollowersTotal(followersCount ?? 0); }, [followersCount]);
  useEffect(() => { setFollowingTotal(followingCount ?? 0); }, [followingCount]);

  // fecha o menu de configurações ao clicar fora dele ou apertar Esc
  useEffect(() => {
    if (!showOptions) return;
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) setShowOptions(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showOptions]);

  // abre o pop-up na hora e carrega a lista dentro dele
  const openFollowList = async (type) => {
    setOpenList(type);
    setListStatus('loading');
    try {
      if (type === 'followers') {
        const data = await listFollowers();
        const list = Array.isArray(data) ? data : [];
        setFollowersList(list);
        setFollowersTotal(list.length);
      } else {
        const data = await listFollowing();
        const list = Array.isArray(data) ? data : [];
        setFollowingList(list);
        setFollowingTotal(list.length);
      }
      setListStatus('idle');
    } catch (err) {
      console.error("Erro ao carregar lista:", err);
      setListStatus('error');
    }
  };

  const handleUnfollow = async (person) => {
    if (unfollowingId) return;
    setUnfollowingId(person.id);
    try {
      await unfollowUser(person.id);
      setFollowingList((prev) => prev.filter((item) => item.followingId !== person.id));
      setFollowingTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Erro ao deixar de seguir:", err);
    } finally {
      setUnfollowingId(null);
    }
  };

  const handleOpenModal = (content, label = '') => {
    setModalContent(content);
    setModalLabel(label);
    setShowModal(true);
  };


  const showPhotoError = (message) => {
    setUpdateProfileError(message);
    setTimeout(() => setUpdateProfileError(null), 4000);
  };

  const applyPhoto = (url) => {
    setUser((prev) => ({ ...prev, profilePicture: url }));
    updateStoredUser({ profilePicture: url });
    setPreviewPhoto(url);
  };

  const openFilePicker = () => {
    if (!photoBusy) fileInputRef.current?.click();
  };

  // com foto: abre a visualização; sem foto: vai direto para escolher uma
  const handlePhotoClick = () => {
    if (hasCustomPhoto) setShowPhotoViewer(true);
    else openFilePicker();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    // limpa o input para permitir escolher o mesmo arquivo de novo
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showPhotoError('Esse arquivo não é uma imagem. Escolha um arquivo JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      showPhotoError('A imagem passa de 10MB. Escolha uma imagem menor.');
      return;
    }

    setShowPhotoViewer(false);
    setPhotoBusy(true);
    try {
      const result = await changeProfilePicture(file);
      applyPhoto(result.profilePic);
    } catch (err) {
      showPhotoError(getErrorMessage(err, 'A foto não foi alterada.'));
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoBusy(true);
    try {
      const result = await removeProfilePicture();
      if (!result) return;
      applyPhoto(result.profilePic);
      setConfirmRemovePhoto(false);
      setShowPhotoViewer(false);
    } catch (err) {
      setConfirmRemovePhoto(false);
      showPhotoError(getErrorMessage(err, 'A foto não foi removida.'));
    } finally {
      setPhotoBusy(false);
    }
  };

  const copyToClipboard = (copy) => {
    if (!copy) return;
    navigator.clipboard.writeText(copy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const followers = followersList.map((u) => ({
    key: u.id, id: u.followerId, name: u.followerName, handle: u.followerHandle,
    photo: u.followerProfilePic, type: u.followerType, followedAt: u.followedAt,
  }));
  const following = followingList.map((u) => ({
    key: u.id, id: u.followingId, name: u.followingName, handle: u.followingHandle,
    photo: u.followingProfilePic, type: u.followingType, followedAt: u.followedAt,
  }));

  const iconButtonClass = "p-3 rounded-full border border-[var(--gray)] text-[var(--font-gray)] hover:text-[var(--purple-primary)] hover:bg-slate-50 transition cursor-pointer flex items-center justify-center";
  const countButtonClass = "hover:text-[var(--purple-primary)] hover:underline transition cursor-pointer";

  return (
    <>
      <article className="relative bg-white drop-shadow-md rounded-xl p-6 sm:p-8 w-full max-w-8xl z-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full min-w-0">

          <div className="relative w-26 h-26 sm:w-32 sm:h-32 xl:w-40 xl:h-40 flex-shrink-0">
            {isCurrentUser ? (
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={photoBusy}
                aria-label={hasCustomPhoto ? 'Ver foto do perfil' : 'Adicionar foto do perfil'}
                className="block w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden cursor-pointer
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple-primary)] disabled:cursor-wait"
              >
                <img src={userPhoto} alt="" className="object-cover w-full h-full hover:opacity-90 transition" />
              </button>
            ) : (
              <div className="w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden">
                <img
                  src={userPhoto}
                  alt={`Foto de ${name || 'usuária'}`}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {photoBusy && (
              <div role="status" className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <span className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                <span className="sr-only">Atualizando foto...</span>
              </div>
            )}
            {isCurrentUser && (
              <>
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={photoBusy}
                  className="absolute bottom-2 right-2 bg-[var(--purple-primary)] hover:bg-[var(--purple-secundary)] text-white p-2.5 rounded-full shadow-lg flex items-center justify-center cursor-pointer disabled:cursor-wait"
                  aria-label={hasCustomPhoto ? 'Substituir foto do perfil' : 'Adicionar foto do perfil'}
                >
                  <FaCamera size={16} aria-hidden="true" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1 w-full min-w-0 text-center sm:text-left">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className="text-2xl xl:text-4xl font-bold text-[var(--purple-primary)] break-words">
                  {name}
                </h2>
                {nameuser && (
                  <p className="text-sm xl:text-lg font-semibold text-[var(--purple-secundary)] break-words">
                    {nameuser}
                  </p>
                )}
              </div>

              {/* Ações: principal em destaque, secundárias só com ícone */}
              <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-3 flex-wrap flex-shrink-0">
                {isCurrentUser ? (
                  <BtnCallToAction variant="purple" onClick={() => handleOpenModal(statisticsComponent, 'Estatísticas')}>
                    <FaChartBar className="mr-2 flex-shrink-0" aria-hidden="true" />
                    ESTATÍSTICAS
                  </BtnCallToAction>
                ) : (
                  <button
                    type="button"
                    onClick={async () => await handleFollow()}
                    aria-pressed={!!followedUser}
                    className={`px-6 py-3 cursor-pointer rounded-2xl flex items-center gap-3 text-sm font-medium transition
                      ${followedUser ? 'bg-[var(--purple-primary)] text-white' : 'bg-[var(--gray)] text-[var(--font-gray)]'}`}
                  >
                    {followedUser ? <><Check size={16} aria-hidden="true" /> Seguindo</> : <><Plus size={16} aria-hidden="true" /> Seguir</>}
                  </button>
                )}

                {isCurrentUser && (
                  <div ref={optionsRef} className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      aria-haspopup="true"
                      aria-expanded={showOptions}
                      aria-label="Configurações"
                      title="Configurações"
                      className={iconButtonClass}
                    >
                      <FaSlidersH className="text-lg" aria-hidden="true" />
                    </button>
                    {showOptions && (
                      <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl shadow-lg flex flex-col gap-2 p-3 min-w-[160px]">
                        <BtnCallToAction variant="white" onClick={() => { setShowOptions(false); onRequestDelete?.(); }}>
                          Excluir Perfil
                        </BtnCallToAction>
                        <BtnCallToAction variant="purple" onClick={() => { setShowOptions(false); handleOpenModal(
                          <EditMyProfile
                            onClose={() => setShowModal(false)}
                            onSaved={() => { setShowModal(false); onProfileUpdated?.(); }}
                          />,
                          'Editar meu perfil'
                        ); }}>
                          Editar Perfil
                        </BtnCallToAction>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => copyToClipboard(copyMyLink)}
                  aria-label="Copiar link do perfil"
                  title="Copiar link do perfil"
                  className={iconButtonClass}
                >
                  <FaPaperPlane className="text-lg" aria-hidden="true" />
                </button>
              </div>
            </div>

            {(link || city || state) && (
              <div className="flex flex-col gap-2">
                {link && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-[var(--font-gray)] text-sm min-w-0">
                    <button
                      onClick={() => copyToClipboard(link)}
                      aria-label="Copiar link"
                      className="flex-shrink-0 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition-colors"
                      type="button"
                    >
                      {copied ? <FaCheck aria-hidden="true" /> : <FaPaperclip aria-hidden="true" />}
                    </button>
                    {toSafeUrl(link) ? (
                      <a
                        href={toSafeUrl(link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--font-gray)] text-sm break-all min-w-0"
                      >
                        {link}
                      </a>
                    ) : (
                      <span className="text-[var(--font-gray)] text-sm break-all min-w-0">{link}</span>
                    )}
                  </div>
                )}

                {(city || state) && (
                  <p className="text-[var(--font-gray)] text-sm break-words">
                    {city}{city && state ? ', ' : ''}{state}
                  </p>
                )}
              </div>
            )}

            {/* Seguidores · Seguindo: a lista só é acessível no próprio perfil (a API lista apenas os da usuária logada) */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm xl:text-base text-[var(--font-gray)] flex-wrap">
              {isCurrentUser ? (
                <>
                  <button type="button" onClick={() => openFollowList('followers')} className={countButtonClass}
                    aria-label={`Ver ${plural(followersTotal, 'seguidor', 'seguidores')}`}>
                    <strong className="text-[var(--purple-secundary)]">{followersTotal}</strong> {followersTotal === 1 ? 'seguidor' : 'seguidores'}
                  </button>
                  <span aria-hidden="true">·</span>
                  <button type="button" onClick={() => openFollowList('following')} className={countButtonClass}
                    aria-label={`Ver quem você segue (${followingTotal})`}>
                    <strong className="text-[var(--purple-secundary)]">{followingTotal}</strong> seguindo
                  </button>
                </>
              ) : (
                <p>
                  <strong className="text-[var(--purple-secundary)]">{followersTotal}</strong> {followersTotal === 1 ? 'seguidor' : 'seguidores'}
                </p>
              )}
            </div>
          </div>
        </div>
      </article>

      {copied && (
        <div role="status" className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]
                        bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          Endereço copiado!
        </div>
      )}
      {updateProfileError && (
        <div role="alert" className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]
                        bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          {updateProfileError}
        </div>
      )}

      <PopUpBlurProfile
        isOpen={showPhotoViewer}
        onClose={() => setShowPhotoViewer(false)}
        ariaLabel="Foto do perfil"
        content={
          <div className="flex flex-col items-center gap-6 p-1 sm:p-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--purple-secundary)] self-start">Foto do perfil</h2>
            <img
              src={userPhoto}
              alt={`Foto de ${name || 'usuária'}`}
              className="w-full max-w-md max-h-[60vh] aspect-square object-cover rounded-2xl border border-[var(--purple-secundary)]"
            />
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              <BtnCallToAction variant="white" onClick={() => setConfirmRemovePhoto(true)} disabled={photoBusy}>
                <FaTrashAlt className="mr-2 flex-shrink-0" aria-hidden="true" />
                REMOVER FOTO
              </BtnCallToAction>
              <BtnCallToAction variant="purple" onClick={openFilePicker} disabled={photoBusy}>
                <FaCamera className="mr-2 flex-shrink-0" aria-hidden="true" />
                SUBSTITUIR FOTO
              </BtnCallToAction>
            </div>
          </div>
        }
      />

      <ConfirmModal
        open={confirmRemovePhoto}
        title="Remover foto?"
        message="Sua foto será apagada e o perfil voltará a usar a imagem padrão."
        confirmText={photoBusy ? 'Removendo...' : 'Remover'}
        cancelText="Cancelar"
        loading={photoBusy}
        onConfirm={handleRemovePhoto}
        onCancel={() => { if (!photoBusy) setConfirmRemovePhoto(false); }}
      />

      <PopUpBlurProfile
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ariaLabel={modalLabel || undefined}
        content={modalContent}
      />

      <PopUpBlurProfile
        isOpen={openList === 'followers'}
        onClose={() => setOpenList(null)}
        ariaLabel="Seguidores"
        content={
          <FollowList
            title="Seguidores"
            status={listStatus}
            people={followers}
            emptyText="Nenhum seguidor encontrado."
            onNavigate={() => setOpenList(null)}
            onRetry={() => openFollowList('followers')}
          />
        }
      />

      <PopUpBlurProfile
        isOpen={openList === 'following'}
        onClose={() => setOpenList(null)}
        ariaLabel="Seguindo"
        content={
          <FollowList
            title="Seguindo"
            status={listStatus}
            people={following}
            emptyText="Você não está seguindo ninguém."
            onNavigate={() => setOpenList(null)}
            onRetry={() => openFollowList('following')}
            renderAction={(person) => (
              <BtnCallToAction
                variant="purple"
                onClick={() => handleUnfollow(person)}
                disabled={unfollowingId === person.id}
                aria-label={`Deixar de seguir ${person.name}`}
              >
                {unfollowingId === person.id ? 'Removendo...' : 'Deixar de seguir'}
              </BtnCallToAction>
            )}
          />
        }
      />
    </>
  )
}
