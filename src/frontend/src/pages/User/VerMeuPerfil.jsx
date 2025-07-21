import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService'; // Exemplo

export default function VerMeuPerfil() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser(); 
        if (user) {
            const user_type = user.role === 'PROFESSIONAL' ? 'professional' : 'company';
            navigate(`/profile/${user_type}/me`, { replace: true });
        } else {
            navigate('/login');
        }
    }, []);

    return null; 
}
