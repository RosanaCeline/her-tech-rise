import React, { useState, useRef } from 'react';
import axios from 'axios';

import { FaCamera, FaPaperclip, FaCheck, FaPaperPlane, FaSlidersH } from 'react-icons/fa';

import defaultProfessional from '../../../assets/profile/FotoPadraoProfissional.png';
import defaultEnterprise from '../../../assets/profile/FotoPadraoEnterprise.png';

import BtnCallToAction from '../../btn/BtnCallToAction/BtnCallToAction';
import PopUpBlurProfile from './PopUpBlurProfile';
import EditMyProfile from '../../../pages/User/edit/EditMyProfile';

export default function CardProfile({
  photo,
  tipo_usuario,
  name,
  nameuser,
  link,
  email,
  number,
  city,
  state,
  statisticsComponent,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(photo);
  const fileInputRef = useRef();

  const defaultPhoto = tipo_usuario === 'enterprise' ? defaultEnterprise : defaultProfessional;
  const userPhoto = previewPhoto || defaultPhoto;

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewPhoto(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post('/api/user/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload sucesso', response.data);
    } catch (error) {
      console.error('Erro no upload da foto', error);
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
      <article className="relative bg-[var(--gray)] drop-shadow-md rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start w-full max-w-8xl gap-10 z-0">
        {/* Foto com botão */}
        <div className="relative w-full max-w-[250px] h-[250px] flex-shrink-0">
          <div className="w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden">
            <img
              src={userPhoto}
              alt={`Foto de ${name || 'usuária'}`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
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
          />
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-4 flex-1 min-w-[250px]">
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

          {/* Email */}
          {email && <p className="text-[var(--font-gray)] text-s break-all">{email}</p>}

          {/* Telefone */}
          {number && <p className="text-[var(--font-gray)] text-s break-all">{number}</p>}

          {/* Cidade e Estado */}
          {(city || state) && (
            <p className="text-[var(--font-gray)] text-s break-all">
              {city ? city : ''}{city && state ? ', ' : ''}{state ? state : ''}
            </p>
          )}
        </div>

        {/* Botões de ações */}
        <div className="flex flex-col gap-6 w-full max-w-[250px] mt-10 md:mt-0 order-last md:order-none items-center md:items-start">
          <button
            type="button"
            className="flex items-center gap-3 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition w-full justify-center lg:justify-start"
          >
            <FaPaperPlane size={24} className="text-[var(--font-gray)]" />
            <span className="text-xl font-medium">Compartilhar</span>
          </button>

        <div className="relative w-full flex justify-center md:justify-start">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-3 text-[var(--font-gray)] hover:text-[var(--purple-primary)] transition"
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
                w-[90vw] max-w-[200px]
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

        {showOptions && (
          <div
            className={`
              absolute flex-col gap-2 p-3 max-w-[200px]
              bg-white rounded-xl shadow-lg
              transition-all duration-300
              right-80 top-20 z-40
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
        </div>
      </article>

      <PopUpBlurProfile
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        content={modalContent}
      />
    </>
  )
}