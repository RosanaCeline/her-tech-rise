import { useState } from 'react';
import ImageLightbox from './ImageLightbox';

const MAX_PREVIEW = 3;

/**
 * Fotos do post. No card mostra até 3 (com "+N" na última se houver mais);
 * aberto (isOpen) mostra todas. Clicar em qualquer uma amplia, navegando por todas.
 */
export default function ImageGallery({ images, isOpen, altFor }) {
  const [viewIndex, setViewIndex] = useState(null);

  const items = images.map((m, i) => ({ src: m.url, alt: altFor(i) }));
  const visible = isOpen ? items : items.slice(0, MAX_PREVIEW);
  const hiddenCount = items.length - visible.length;

  const open = (e, i) => { e.stopPropagation(); setViewIndex(i); };

  const thumb = (item, i, className = '') => (
    <button
      key={i}
      type="button"
      onClick={(e) => open(e, i)}
      aria-label={`Ampliar ${item.alt.charAt(0).toLowerCase()}${item.alt.slice(1)}`}
      className={`relative block overflow-hidden rounded-md bg-gray-100 border border-black/10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple-primary)] ${className}`}
    >
      <img src={item.src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
      {!isOpen && hiddenCount > 0 && i === visible.length - 1 && (
        <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold" aria-hidden="true">
          +{hiddenCount}
        </span>
      )}
    </button>
  );

  let layout;
  if (isOpen) {
    layout = (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visible.map((item, i) => thumb(item, i, 'aspect-square'))}
      </div>
    );
  } else if (visible.length === 1) {
    layout = (
      <button
        type="button"
        onClick={(e) => open(e, 0)}
        aria-label={`Ampliar ${visible[0].alt.charAt(0).toLowerCase()}${visible[0].alt.slice(1)}`}
        className="block w-full rounded-md cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple-primary)]"
      >
        <img src={visible[0].src} alt="" loading="lazy" decoding="async" className="block w-auto max-w-full max-h-96 mx-auto object-contain rounded-md border border-black/10" />
      </button>
    );
  } else if (visible.length === 2) {
    layout = (
      <div className="grid grid-cols-2 gap-1.5">
        {visible.map((item, i) => thumb(item, i, 'aspect-square'))}
      </div>
    );
  } else {
    // 3 fotos: uma grande à esquerda e duas empilhadas à direita
    layout = (
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 h-64 sm:h-96">
        {thumb(visible[0], 0, 'row-span-2')}
        {thumb(visible[1], 1)}
        {thumb(visible[2], 2)}
      </div>
    );
  }

  return (
    <>
      {layout}
      <ImageLightbox
        images={items}
        index={viewIndex}
        onIndexChange={setViewIndex}
        onClose={() => setViewIndex(null)}
        label="Fotos da publicação"
      />
    </>
  );
}
