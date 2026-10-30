import { useState } from 'react';

import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';
import CardPostProfile from '../CardPostProfile';
import ImageGallery from './media/ImageGallery';
import DocumentPreview from './media/DocumentPreview';
import { toSafeUrl } from '../../../../services/safeUrl';

const LONG_TEXT_CHARS = 280;
const LONG_TEXT_LINES = 5;
const MAX_PREVIEW_IMAGES = 3;

export default function ContentPost({ post, authorName = '', isShare = false, postShare = null, isOpen, onExpand }) {

  const media = (post.media ?? []).filter((m) => toSafeUrl(m.url));
  const images = media.filter((m) => m.mediaType === 'IMAGE');
  const documents = media.filter((m) => m.mediaType === 'DOCUMENT');
  // fechado: até 3 fotos + 1 documento; o resto fica para o "ver mais"
  const visibleDocuments = isOpen ? documents : documents.slice(0, 1);
  const hiddenCount = isOpen ? 0
    : media.length - Math.min(images.length, MAX_PREVIEW_IMAGES) - visibleDocuments.length;

  const content = post.content ?? '';
  const isLongText = content.length > LONG_TEXT_CHARS || content.split('\n').length > LONG_TEXT_LINES;
  const [expanded, setExpanded] = useState(false);
  const showFullText = isOpen || expanded || !isLongText;

  const imageAlt = (index) => `Imagem ${index + 1} da publicação${authorName ? ` de ${authorName}` : ''}`;

  return (
    <div className="flex flex-col gap-2 h-fit p-1 min-w-0">
      {content && (
        <div>
          <p className={`text-sm text-gray-700 break-words whitespace-pre-wrap ${showFullText ? '' : 'line-clamp-5'}`}>{content}</p>
          {isLongText && !isOpen && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpanded((prev) => !prev); }}
              aria-expanded={expanded}
              className="mt-1 text-sm font-semibold text-[var(--purple-primary)] hover:underline"
            >
              {expanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>
      )}

      {isShare && postShare && (
        <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-w-0">
          <p className="text-xs text-gray-500 mb-2">
            <span aria-hidden="true">📌 </span>Compartilhando um post de{" "}
            <span className="font-semibold">{postShare?.author?.name}</span>
          </p>

          <CardPostProfile
            photo={postShare?.author?.profilePic}
            name={postShare?.author?.name}
            handle={postShare?.author?.handle}
            idAuthor={postShare?.author?.id}
            authorType={postShare?.author?.type}
            post={postShare}
            isShare={false}
            hideInteractions={true}
            isOwner={false}
            isPopupView={true}
            isOpen={isOpen}
            onCardClick={onExpand}
          />
        </div>
      )}

      {images.length > 0 && <ImageGallery images={images} isOpen={isOpen} altFor={imageAlt} />}

      {visibleDocuments.map((m, i) => <DocumentPreview key={m.id ?? i} url={m.url} />)}

      {hiddenCount > 0 && onExpand && (
        <div className="flex justify-center m-3">
          <BtnCallToAction
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            aria-label={`Ver todos os ${media.length} anexos da publicação`}
          >
            VER MAIS ({media.length})
          </BtnCallToAction>
        </div>
      )}
    </div>
  );
}
