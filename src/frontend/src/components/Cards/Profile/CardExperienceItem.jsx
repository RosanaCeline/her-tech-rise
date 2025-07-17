import { Pencil, Trash2 } from 'lucide-react';

export default function CardExperienceItem({ experience, onEdit, onDelete }) {
  return (
    <div className="w-full flex justify-between items-center bg-[#F7F7F7] text-[#55618C] px-4 py-3 rounded-lg shadow-md">
      <p className="text-sm font-medium">{experience.title}</p>
      <div className="flex gap-4">
        <button
          onClick={() => onEdit(experience)}
          className="hover:text-[#303F3C] transition"
          title="Editar experiência"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(experience)}
          className="hover:text-red-600 transition"
          title="Excluir experiência"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
