import { getCurrentUser } from "../../../services/authService"
import EditEnterprise from './forms/EditEnterprise'
import EditProfessional from './forms/EditProfessional'

export default function EditMyProfile({ onClose, onSaved }) {

    const tipoUsuario = getCurrentUser()?.role;

    return (
        <section className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--purple-secundary)] mb-2 sm:mb-4">EDITAR MEU PERFIL</h1>
            <p className="mb-4 sm:mb-6 text-base sm:text-lg max-w-3xl text-[var(--font-gray)]">
                Atualize suas informações e mantenha seu perfil sempre relevante.
            </p>

            {tipoUsuario === "COMPANY" && <EditEnterprise onClose={onClose} onSaved={onSaved} />}
            {tipoUsuario === "PROFESSIONAL" && <EditProfessional onClose={onClose} onSaved={onSaved} />}
        </section>
    )
}
