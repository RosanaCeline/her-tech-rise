import { useId } from 'react';
import { createPortal } from 'react-dom';

import useModalA11y from '../../services/hooks/useModalA11y';

// modal de aviso com um único botão (ex.: "Perfil atualizado!")
export default function FeedbackModal({ open, title, message, buttonText = "Continuar", onClose }) {
  const dialogRef = useModalA11y(open, onClose);
  const titleId = useId();
  const messageId = useId();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} tabIndex={-1}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center max-w-sm w-full focus:outline-none">
        <h2 id={titleId} className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">{title}</h2>
        <p id={messageId} className="mb-6 text-gray-700">{message}</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(e); }}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>,
    document.body
  );
}
