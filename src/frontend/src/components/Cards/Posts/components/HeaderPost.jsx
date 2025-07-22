import { Edit, Trash2, Globe, Users } from 'lucide-react';

export default function HeaderPost({ photo, name, communityId, date, isOpen = false }) {
  const onEdit = (e) => {
    e.stopPropagation();
    console.log('Edit');
  };

  const onDelete = (e) => {
    e.stopPropagation();
    console.log('Delete');
  };

  const isCommunity = Boolean(communityId);

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-4">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-start">
          <p className="font-semibold text-base">{name}</p>
          <p className="text-xs text-[var(--purple-primary)] capitalize flex items-center gap-1">
            {isCommunity ? <Users size={14} /> : <Globe size={14} />}
            {isCommunity ? 'Comunidade' : 'Público'}
          </p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      {isOpen && (
        <div className="flex items-center gap-2">
          <Edit size={18} onClick={onEdit} className="cursor-pointer hover:text-gray-700" />
          <Trash2 size={18} onClick={onDelete} className="cursor-pointer hover:text-red-500" />
        </div>
      )}
    </div>
  );
}
