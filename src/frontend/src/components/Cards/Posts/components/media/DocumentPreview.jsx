import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Files, Download, ChevronLeft, ChevronRight } from 'lucide-react';

import ImageLightbox from './ImageLightbox';
import { fileName, isPreviewablePdf, pdfPageUrl, downloadUrl } from '../../../../../services/mediaUrl';
import { toSafeUrl } from '../../../../../services/safeUrl';

const MAX_PAGES = 5;

function DownloadLink({ url, label, children, className = '' }) {
  return (
    <a
      href={downloadUrl(url)}
      target="_blank"
      rel="noopener noreferrer"
      download
      onClick={(e) => e.stopPropagation()}
      aria-label={`Baixar ${label}`}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-[var(--purple-primary)] hover:underline whitespace-nowrap ${className}`}
    >
      <Download size={16} aria-hidden="true" />
      {children}
    </a>
  );
}

// arquivo sem prévia (ex.: .docx): nome + baixar
function DocumentLink({ url, label }) {
  return (
    <div className="flex items-center justify-between gap-3 w-full border border-[var(--purple-secundary)] rounded-md p-3 shadow-sm text-[var(--purple-primary)] min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <Files size={20} className="flex-shrink-0" aria-hidden="true" />
        <span className="text-xs break-all">{label}</span>
      </div>
      <DownloadLink url={url} label={label}>Baixar</DownloadLink>
    </div>
  );
}

/**
 * PDF: até 5 páginas lado a lado com rolagem horizontal; se houver mais,
 * o último cartão pede para baixar o arquivo. Outros formatos mostram só o link.
 */
function PdfPreview({ url, label }) {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  const scrollerRef = useRef(null);
  // quantas páginas existem até a 6ª (descoberto pelas imagens que carregam ou falham)
  const [pageCount, setPageCount] = useState(MAX_PAGES + 1);
  const [failed, setFailed] = useState(false);
  const [viewIndex, setViewIndex] = useState(null);

  const pagesToShow = Math.min(pageCount, MAX_PAGES);
  const hasMorePages = pageCount > MAX_PAGES;
  const pages = Array.from({ length: pagesToShow }, (_, i) => ({
    src: pdfPageUrl(url, i + 1),
    alt: `Página ${i + 1} de ${label}`,
  }));

  const handlePageError = (page) => {
    if (page === 1) setFailed(true);
    else setPageCount((prev) => Math.min(prev, page - 1));
  };

  const scroll = (direction) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (failed) return <DocumentLink url={url} label={label} />;

  const arrowClass = "hidden sm:flex absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md text-[var(--purple-primary)] hover:bg-white transition cursor-pointer";

  return (
    <section
      ref={inViewRef}
      aria-label={`Prévia do documento ${label}`}
      onClick={(e) => e.stopPropagation()}
      className="w-full border border-[var(--purple-secundary)] rounded-md shadow-sm min-w-0 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-slate-200 text-[var(--purple-primary)]">
        <div className="flex items-center gap-2 min-w-0">
          <Files size={18} className="flex-shrink-0" aria-hidden="true" />
          <span className="text-xs truncate" title={label}>{label}</span>
        </div>
        <DownloadLink url={url} label={label}>Baixar</DownloadLink>
      </div>

      <div className="relative bg-gray-100">
        <ul ref={scrollerRef} className="flex gap-2 overflow-x-auto snap-x snap-mandatory p-2 sm:p-3 scroll-smooth">
          {inView && pages.map((page, i) => (
            <li key={page.src} className="snap-start shrink-0 w-[75%] sm:w-[55%]">
              <button
                type="button"
                onClick={() => setViewIndex(i)}
                aria-label={`Ampliar página ${i + 1}`}
                className="relative block w-full bg-white rounded border border-black/10 shadow cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple-primary)]"
              >
                <img
                  src={page.src}
                  alt={page.alt}
                  loading="lazy"
                  decoding="async"
                  onError={() => handlePageError(i + 1)}
                  className="w-full h-auto rounded"
                />
                <span className="absolute top-1.5 left-1.5 text-xs text-white bg-black/60 rounded px-1.5 py-0.5" aria-hidden="true">
                  {i + 1}
                </span>
              </button>
            </li>
          ))}

          {inView && hasMorePages && (
            <li className="snap-start shrink-0 w-[75%] sm:w-[55%] flex">
              <div className="flex flex-col items-center justify-center gap-3 w-full min-h-48 bg-white rounded shadow p-4 text-center">
                <p className="text-sm text-[var(--font-gray)]">Baixe o arquivo para ver as demais páginas.</p>
                <DownloadLink url={url} label={label} className="px-4 py-2 rounded-lg border border-[var(--purple-primary)] hover:no-underline hover:bg-slate-50">
                  Baixar documento
                </DownloadLink>
              </div>
            </li>
          )}
        </ul>

        {/* sonda a 6ª página: se ela existir, o documento tem mais do que o mostrado */}
        {inView && pageCount > MAX_PAGES && (
          <img src={pdfPageUrl(url, MAX_PAGES + 1, 50)} alt="" aria-hidden="true" className="hidden"
            onError={() => handlePageError(MAX_PAGES + 1)} />
        )}

        {pagesToShow > 1 && (
          <>
            <button type="button" onClick={() => scroll(-1)} aria-label="Páginas anteriores" className={`${arrowClass} left-2`}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Próximas páginas" className={`${arrowClass} right-2`}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <ImageLightbox
        images={pages}
        index={viewIndex}
        onIndexChange={setViewIndex}
        onClose={() => setViewIndex(null)}
        label={`Páginas de ${label}`}
      />
    </section>
  );
}

export default function DocumentPreview({ url }) {
  const href = toSafeUrl(url);
  if (!href) return null;
  const label = fileName(href);
  return isPreviewablePdf(href) ? <PdfPreview url={href} label={label} /> : <DocumentLink url={href} label={label} />;
}
