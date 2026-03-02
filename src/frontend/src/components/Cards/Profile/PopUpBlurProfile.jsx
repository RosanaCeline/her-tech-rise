import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function PopUpBlurProfile({ isOpen, onClose, content, children = null }) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()} >
      {/* Fundo escuro com blur */}
      <div
        className="absolute inset-0 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      {/* Conteúdo */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-7xl w-full max-h-[95vh] p-6 z-10 m-5 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--purple-primary)] hover:text-[var(--purple-action)] hover:bg-gray-100 
                      text-xl sm:text-3xl font-bold flex items-center justify-center w-10 h-10 rounded-md"
          aria-label="Fechar modal"
        >
          <X/>
        </button>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 min-w-0">
          {content}
          {children}
        </div>
      </div>
    </div>
  );
}
