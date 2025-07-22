import { useState } from 'react';
import { Files } from 'lucide-react';

import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';

export default function ContentPost({ post, isOpen, onExpand }) {
  const media = post.media ?? [];
  const firstMedia = media[0];
  const hasMultipleMedia = media.length > 1;

  return (
    <div className="flex flex-col gap-2 overflow-auto max-h-[40vh] p-1">
      <p className="text-sm text-gray-700 break-words">{post.content}</p>

      {isOpen ? (
        media.map((m, i) => {
          if (m.mediaType === 'IMAGEM')
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
            {firstMedia.mediaType === 'IMAGEM' && (
              <img
                src={firstMedia.url}
                alt="Imagem do post"
                className="w-full max-h-64 object-contain rounded-md"
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
