// import { useState } from 'react';
import { Files } from 'lucide-react';

import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';
import CardPostProfile from '../CardPostProfile';
import { useState } from 'react';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';

export default function ContentPost({ post, isShare = false, postShare = null, isOpen, onExpand, cardWidth }) {
  const isCompact = cardWidth < 600;
  const media = post.media ?? [];
  const firstMedia = media[0];
  const hasMultipleMedia = media.length > 1;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // const postViewShare = isShare && postShare
  //   ? {
  //       id: postShare.id,
  //       content: postShare.content,
  //       media: postShare.media || [],
  //       createdAt: postShare.createdAt,
  //     }
  //   : null;

  const handleDownloadClick = (url) => {
    setDownloadUrl(url);
    setConfirmOpen(true);
  };

  const handleConfirmDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setConfirmOpen(false);
    setDownloadUrl(null);
  };

  return (
    <>
    <div className="flex flex-col gap-2 overflow-auto h-fit p-1">
      <p className={`min-h-fit ${!isOpen && 'max-h-[100px]'} overflow-y-auto text-sm text-gray-700 break-words`}>{post.content}</p>

      {isShare && postShare && (
        <>
          {isCompact ? (
            <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500"> 📌 Compartilhando um post de{" "}
                <span className="font-semibold">{postShare?.author?.name}</span>
              </p>
            </div>
          ) : (
            <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500 mb-2"> 📌 Compartilhando um post de{" "}
                <span className="font-semibold">{postShare?.author?.name}</span>.
              </p>

              <CardPostProfile
                photo={postShare?.author.profilePic}
                name={postShare?.author.name}
                handle={postShare?.author.handle}
                idAuthor={postShare?.author.id}
                post={postShare}
                isShare={false}
                hideInteractions={true}
                isOwner={false}
                isPopupView={true}
              />
            </div>
          )}
        </>
      )}
      {isOpen ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
          {media.map((m, i) => {
            if (m.mediaType === 'IMAGE')
              return (
                <img
                  key={i}
                  src={m.url}
                  alt={`Imagem ${i + 1}`}
                  className="w-full h-full my-auto object-cover rounded-md cursor-pointer hover:opacity-90 transition"
                />
              );

            if (m.mediaType === 'VIDEO')
              return (
                <video
                  key={i}
                  controls
                  className="w-full h-full my-auto object-cover rounded-md"
                >
                  <source src={m.url} type="video/mp4" />
                </video>
              );

            if (m.mediaType === 'DOCUMENT')
              return (
                <div
                  key={i}
                  className="col-span-2 sm:col-span-3 flex items-center justify-between border border-[var(--purple-secunday)] rounded-md p-3 shadow-sm text-[var(--purple-primary)]"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Files size={20} />
                    <span className="text-xs break-all max-w-[200px]">
                      {m.url.split('/').pop()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadClick(m.url)}
                    className="text-sm font-medium hover:underline ml-4 whitespace-nowrap"
                  >
                    Baixar
                  </button>
                </div>
              );

            return null;
          })}
        </div>
      ) : (

        firstMedia && (
          <div className="relative flex flex-col justify-center items-center">
            {firstMedia.mediaType === 'IMAGE' && (
              <img
                src={firstMedia.url}
                alt="Imagem do post"
                className="w-full max-h-90 object-contain rounded-md"
              />
            )}

            {firstMedia.mediaType === 'VIDEO' && (
              <video controls className="w-full max-h-64 rounded-md">
                <source src={firstMedia.url} type="video/mp4" />
              </video>
            )}

            {firstMedia.mediaType === 'DOCUMENT' && (
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

            {hasMultipleMedia && (
              <div className="m-3">
                <BtnCallToAction onClick={onExpand}>
                        VER MAIS
                </BtnCallToAction>
                </div>
            )}
          </div>
        )
      )}
    </div>
    <ConfirmModal
      open={confirmOpen}
      title="Iniciando download"
      message="Deseja baixar este arquivo agora?"
      confirmText="Baixar"
      cancelText="Cancelar"
      onCancel={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDownload}
    />
</>
  );
}
