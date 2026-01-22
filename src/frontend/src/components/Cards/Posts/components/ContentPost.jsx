import { useState } from 'react';
import { Files } from 'lucide-react';

import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';
import CardPostProfile from '../CardPostProfile';

export default function ContentPost({ post, isShare = false, postShare = null, isOpen, onExpand, cardWidth }) {
  const isCompact = cardWidth < 600;
  const media = post.media ?? [];
  const firstMedia = media[0];
  const hasMultipleMedia = media.length > 1;

  const postViewShare = isShare && postShare
    ? {
        id: postShare.id,
        content: postShare.content,
        media: postShare.media || [],
        createdAt: postShare.createdAt,
      }
    : null;

  return (
    <div className="flex flex-col gap-2 overflow-auto h-fit p-1">
      <p className="h-fit overflow-y-auto text-sm text-gray-700 break-words">{post.content}</p>

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
        media.map((m, i) => {
          if (m.mediaType === 'IMAGE')
            return (
              <img
                key={i}
                src={m.url}
                alt={`Imagem ${i + 1}`}
                className="w-full max-h-64 object-contain rounded-md"
              />
            );
          if (m.mediaType === 'VIDEO')
            return (
              <video key={i} controls className="w-full max-h-64 rounded-md">
                <source src={m.url} type="video/mp4" />
              </video>
            );
          if (m.mediaType === 'DOCUMENTO')
            return (
              <div
                key={i}
                className="flex items-center justify-between w-full border border-[var(--purple-secunday)] rounded-md p-3 shadow-sm text-[var(--purple-primary)]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Files size={20} />
                  <span className="text-xs break-all max-w-[200px]">
                    {m.url.split('/').pop()}
                  </span>
                </div>
                <a
                  href={m.url}
                  download
                  className="text-sm font-medium hover:underline ml-4 whitespace-nowrap"
                >
                  Baixar
                </a>
              </div>
            );
          return null;
        })
      ) : (
        firstMedia && (
          <div className="relative">
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

            {hasMultipleMedia && (
                <BtnCallToAction 
                    onClick={(e) => {
                        e.stopPropagation();
                        onExpand?.();
                    }}>
                        VER MAIS
                </BtnCallToAction>
            )}
          </div>
        )
      )}
    </div>
  );
}
