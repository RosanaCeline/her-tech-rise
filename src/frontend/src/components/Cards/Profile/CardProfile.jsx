import React, { useState, useRef } from 'react';
import axios from 'axios';

import { FaCamera, FaPaperclip, FaCheck } from 'react-icons/fa'; 
import defaultProfessional from '../../../assets/profile/FotoPadraoProfissional.png';
import defaultEnterprise from '../../../assets/profile/FotoPadraoEnterprise.png';


export default function CardProfile({ photo, tipo_usuario, name, nameuser, link, email, number, city, state }) {
    const [copied, setCopied] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(photo);
    const fileInputRef = useRef();

    const defaultPhoto = tipo_usuario === 'enterprise' ? defaultEnterprise : defaultProfessional;
    const userPhoto = previewPhoto || defaultPhoto;

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
    }

    const copyToClipboard = () => {
        if (!link) return;
        navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <article className="bg-[var(--gray)] drop-shadow-md rounded-xl p-8 flex flex-row w-full max-w-8xl lg:flex-row items-start gap-10 z-0">
            {/* Container da foto com botão upload */}
            <div className="relative w-full max-w-[250px] h-[250px]">
            {/* Container da foto com overflow-hidden e borda arredondada */}
                <div className="w-full h-full rounded-full border border-[var(--purple-secundary)] overflow-hidden">
                    <img
                    src={userPhoto}
                    alt={`Foto de ${name || 'usuária'}`}
                    className="object-cover w-full h-full rounded-full"
                    />
                </div>

                {/* Botão fora do container arredondado */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-[var(--purple-primary)] hover:bg-[var(--purple-secundary)] text-white p-3 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
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
        <div className="flex flex-col gap-3 flex-1">
            <h2 className="text-4xl font-bold text-[var(--purple-primary)]">{name}</h2>

            {nameuser && (
            <p className="text-lg font-semibold text-black">@{nameuser}</p>
            )}
            {link && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="underline break-all"
                >
                {link}
                </a>
                <button
                onClick={copyToClipboard}
                aria-label="Copiar link"
                className="text-gray-500 hover:text-[var(--purple-primary)] transition-colors"
                type="button"
                >
                {copied ? <FaCheck /> : <FaPaperclip />}
                </button>
            </div>
            )}
            {email && (
            <p className="text-[var(--text-secondary)] text-s break-all">{email}</p>
            )}
            {number && (
            <p className="text-[var(--text-secondary)] text-s break-all">{number}</p>
            )}

            {city && state && (
            <p className="text-[var(--text-secondary)] text-s break-all">{city}, {state}</p>
            )}
        </div>
        </article>
    )
}