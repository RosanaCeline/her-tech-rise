import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from "../../../../context/AuthContext";  
import { getTokenRemainingMs } from '../../../../services/authService';

export default function SessionWarningBanner() {
    const { user, logout, dismissWarning } = useAuth();
    const [minutesLeft, setMinutesLeft] = useState(null);

    useEffect(() => {
        if (!user?.token) return;
        const update = () => {
            const ms = getTokenRemainingMs(user.token);
            setMinutesLeft(Math.max(0, Math.ceil(ms / 60000)));
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [user?.token]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md
                        bg-yellow-50 border border-yellow-300 text-yellow-800
                        rounded-xl shadow-lg px-5 py-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                <p className="text-sm leading-relaxed">
                    <span className="font-semibold">
                        Sua sessão expira em {minutesLeft} {minutesLeft === 1 ? 'minuto' : 'minutos'}.
                    </span>{' '}
                    Faça login novamente para continuar.
                </p>
            </div>
            <div className="flex gap-2 justify-end">
                <button onClick={dismissWarning} className="text-xs text-yellow-700 hover:underline px-3 py-1" >
                    Ignorar
                </button>
                <button onClick={logout} className="text-xs bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition" >
                    Fazer login agora
                </button>
            </div>
        </div>
    );
}