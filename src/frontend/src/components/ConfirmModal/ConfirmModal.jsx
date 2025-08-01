import React from 'react';

export default function ConfirmModal ({ 
  open, 
  title = "Confirmar Ação", 
  message = "Tem certeza que deseja continuar?", 
  onConfirm, 
  onCancel,
  confirmText = "Sim", 
  cancelText = "Não" 
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}