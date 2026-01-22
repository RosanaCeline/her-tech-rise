import React from 'react';

export default function PopUpBlurProfile({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo escuro com blur */}
      <div
        className="absolute inset-0 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      {/* Conteúdo */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-7xl w-full max-h-[95vh] p-6 overflow-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--purple-primary)] hover:text-[var(--purple-action)] text-3xl font-bold"
          aria-label="Fechar modal"
        >
          ×
        </button>
        {content}
      </div>
    </div>
  );
}
