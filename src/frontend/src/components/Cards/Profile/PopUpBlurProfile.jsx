import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import useModalA11y from '../../../services/hooks/useModalA11y';

export default function PopUpBlurProfile({ isOpen, onClose, content, children = null, ariaLabel = "Janela de detalhes" }) {

  const dialogRef = useModalA11y(isOpen, onClose);

  if (!isOpen) return null;

  // portal no <body>: o modal não fica preso a ancestrais com filter/transform/overflow (ex.: cards do perfil)
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()} >
      {/* Fundo escuro com blur */}
      <div
        className="absolute inset-0 backdrop-blur-lg"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Conteúdo */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}
        className="relative bg-white rounded-xl shadow-lg max-w-7xl w-full max-h-[95vh] p-4 sm:p-6 z-10 m-3 sm:m-5 overflow-hidden flex flex-col focus:outline-none">
        <div className="flex justify-end mb-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--purple-primary)] hover:text-[var(--purple-action)] hover:bg-gray-100
                        text-xl sm:text-3xl font-bold flex items-center justify-end rounded-md cursor-pointer"
            aria-label="Fechar"
          >
            <X aria-hidden="true"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 sm:px-6 pb-6 min-w-0">
          {content}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
