import { useState } from 'react';
import { Eye, Edit, Trash2, Heart, MessageCircle, Share, Files } from 'lucide-react';
import PopUpBlurProfile from '../../PopUp'

export default function CardPostProfile({ post, isPopupView = false }) {
  const [showPopup, setShowPopup] = useState(false);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');

  const mappedMedia = post.media?.map((media) => ({
    mediaType: media.mediaType,
    url: media.url,
  })) || [];

  const likes = post.likes ?? 0;
  const comments = post.comments ?? 0;
  const shares = post.shares ?? 0;

  const hasMedia = mappedMedia.length > 0;
  const hasMultipleMedia = mappedMedia.length > 1;
  const firstMedia = mappedMedia[0];

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div
        className={`flex flex-col justify-between bg-gray-50 rounded-xl shadow-md p-6 ${
          isPopupView
            ? 'w-full max-w-none min-h-[auto]'
            : `w-full max-w-[460vh] ${hasMedia ? 'h-[32vh]' : 'min-h-[20vh] max-h-[32vh]'}`
        }`}
      >
        {/* Ações */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Heart size={16} /> <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} /> <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share size={16} /> <span>{shares}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="cursor-pointer" />
              <Edit size={16} className="cursor-pointer" />
              <Trash2 size={16} className="cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex flex-col gap-2 overflow-auto h-ful">
          <p
            className={`text-sm text-gray-700 break-words ${
              !hasMedia ? 'flex-grow' : ''
            }`}
          >
            {post.content}
          </p>

          {firstMedia && (
            <div className="rounded-lg p-3 text-sm space-y-3">
              {firstMedia.mediaType === 'IMAGEM' && (
                <img
                  src={firstMedia.url}
                  alt="Imagem do post"
                  className="w-full max-h-64 object-contain rounded-md"
                />
              )}

              {firstMedia.mediaType === 'VIDEO' && (
                <video
                  controls
                  className="w-full max-h-64 rounded-md"
                >
                  <source src={firstMedia.url} type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
              )}

              {firstMedia.mediaType === 'DOCUMENTO' && (
                <div className="flex items-center justify-between w-full border border-[var(--purple-secunday)] rounded-md p-3 shadow-sm text-[var(--purple-primary)]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Files size={20} />
                    <span className="text-xs break-all max-w-[200px]">
                      {firstMedia.url.split('/').pop()}
                    </span>
                  </div>
                  <a
                    href={firstMedia.url}
                    download
                    className="text-sm font-medium hover:underline ml-4 whitespace-nowrap"
                  >
                    Baixar
                  </a>
                </div>
              )}
            </div>
          )}

          {hasMultipleMedia && (
            <button
              onClick={openPopup}
              className="mt-2 text-sm text-cyan-600 hover:underline font-medium"
            >
              Ver mais...
            </button>
          )}
        </div>
      </div>

      {/* Mostrar o post completo */}
      {showPopup && (
        <PopUpBlurProfile post={post} onClose={closePopup} />
      )}
    </>
  );
}
