import { Pencil, Trash2 } from 'lucide-react';

export default function CardExperienceItem({ experience, onEdit, onDelete }) {
  const subtitle = [experience.company, experience.modality].filter(Boolean).join(' · ');

  return (
    <div className="w-full flex justify-between items-center gap-3 bg-[#F7F7F7] text-[#55618C] px-3 sm:px-4 py-3 rounded-lg shadow-md">
      <div className="min-w-0">
        <p className="text-sm font-medium break-words">{experience.title}</p>
        {subtitle && <p className="text-xs opacity-80 break-words">{subtitle}</p>}
      </div>
      <div className="flex gap-1 shrink-0">
        {/* type="button": estes botões ficam dentro do <form> do perfil e não podem enviá-lo */}
        <button
          type="button"
          onClick={() => onEdit(experience)}
          className="p-2 rounded-md hover:text-[#303F3C] hover:bg-gray-200 transition"
          aria-label={`Editar experiência ${experience.title}`}
          title="Editar experiência"
        >
          <Pencil size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(experience)}
          className="p-2 rounded-md hover:text-red-600 hover:bg-gray-200 transition"
          aria-label={`Excluir experiência ${experience.title}`}
          title="Excluir experiência"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
