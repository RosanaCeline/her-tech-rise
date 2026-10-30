import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import useModalA11y from '../../../../../services/hooks/useModalA11y';

/**
 * Visualização ampliada de imagens (fotos do post ou páginas de PDF).
 * images: [{ src, alt }]; navega com as setas do teclado, os botões ou deslizando no celular.
 */
export default function ImageLightbox({ images, index, onIndexChange, onClose, label = 'Imagem ampliada' }) {
  const isOpen = index !== null && index >= 0;
  const dialogRef = useModalA11y(isOpen, onClose);
  const touchStartX = useRef(null);

  if (!isOpen) return null;

  const total = images.length;
  const current = images[index];
  const go = (step) => onIndexChange((index + step + total) % total);

  const handleKeyDown = (e) => {
    if (total < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || total < 2) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) go(deltaX < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const navButtonClass = "absolute top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 ring-1 ring-white/30 text-white transition cursor-pointer";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 sm:p-12 focus:outline-none"
    >
      <img
        src={current.src}
        alt={current.alt}
        className="max-w-full max-h-[85vh] object-contain rounded-md select-none"
        draggable={false}
      />

      <button type="button" onClick={onClose} aria-label="Fechar" className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 ring-1 ring-white/30 text-white transition cursor-pointer">
        <X size={24} aria-hidden="true" />
      </button>

      {total > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className={`${navButtonClass} left-2 sm:left-4`}>
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className={`${navButtonClass} right-2 sm:right-4`}>
            <ChevronRight size={28} aria-hidden="true" />
          </button>
          <p aria-live="polite" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white bg-black/50 rounded-full px-3 py-1">
            {index + 1} de {total}
          </p>
        </>
      )}
    </div>,
    document.body
  );
}
