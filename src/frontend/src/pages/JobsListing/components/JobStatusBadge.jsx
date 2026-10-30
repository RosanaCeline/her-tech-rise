// mesmo status em todas as telas de vagas: desativada pela empresa, prazo encerrado ou recebendo candidaturas
export default function JobStatusBadge({isActive, isExpired}){
    const status = !isActive
        ? { text: 'Vaga desativada', className: 'bg-gray-200 text-gray-700' }
        : isExpired
            ? { text: 'Prazo encerrado', className: 'bg-amber-100 text-amber-800' }
            : { text: 'Vaga ativa', className: 'bg-green-100 text-green-800' };
    return <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.text}</span>;
}
