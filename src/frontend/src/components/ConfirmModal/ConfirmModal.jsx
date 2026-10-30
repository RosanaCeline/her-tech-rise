import { useId } from 'react';
import { createPortal } from 'react-dom';

import useModalA11y from '../../services/hooks/useModalA11y';

export default function ConfirmModal ({
  open,
  title = "Confirmar Ação",
  message = "Tem certeza que deseja continuar?",
  onConfirm,
  onCancel,
  confirmText = "Sim",
  cancelText = "Não",
  loading = false
}) {
  const dialogRef = useModalA11y(open, onCancel);
  const titleId = useId();
  const messageId = useId();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId} tabIndex={-1}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center max-w-sm w-full focus:outline-none">
        <h2 id={titleId} className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">{title}</h2>
        <p id={messageId} className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onCancel(e); }}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            aria-busy={loading || undefined}
            onClick={(e) => { e.stopPropagation(); onConfirm(e); }}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
