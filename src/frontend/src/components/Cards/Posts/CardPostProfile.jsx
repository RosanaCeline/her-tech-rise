import { Eye, Edit, Trash2, Heart, MessageCircle, Share } from 'lucide-react';

export default function CardPostProfile({ post, isPopupView = false }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');

  // Fallback para 0 se não vier do backend
  const likes = post.likes ?? 0;
  const comments = post.comments ?? 0;
  const shares = post.shares ?? 0;

  return (
    <div
      className={`flex flex-col justify-between bg-gray-50 rounded-xl shadow-md p-4 ${
        isPopupView ? 'w-full max-w-none min-h-[auto]' : 'w-full max-w-[400px] h-[300px]'
      }`}
    >
      {/* Topo: data e ações */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>{formattedDate}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart size={16} /> <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} /> <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share size={16} /> <span>{shares}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} className="cursor-pointer" />
            <Edit size={16} className="cursor-pointer" />
            <Trash2 size={16} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Corpo do card */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Imagem da publicação"
            className="w-1/2 h-full object-cover rounded-md"
          />
        )}
        <p className="text-sm text-gray-700 overflow-hidden text-ellipsis line-clamp-6 w-full">
          {post.content}
        </p>
      </div>
    </div>
  )
}
