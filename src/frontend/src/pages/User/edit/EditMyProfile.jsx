import React, { useState, useEffect } from "react"

import { getCurrentUser } from "../../../services/authService"
import EditEnterprise from './forms/EditEnterprise'
import EditProfessional from './forms/EditProfessional'
import LoadingSpinner from './../../../components/LoadingSpinner/LoadingSpinner'

export default function EditMyProfile() {
    const [user, setUser] = useState(null);
    const [tipoUsuario, setTipoUsuario] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setTipoUsuario(currentUser.role);
        }
    }, []);

    return (
        <section>
        <h1 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">EDITAR MEU PERFIL</h1>
        <p className="mt-2 mb-6 text-lg max-w-3xl text-[var(--font-gray)]">
            Atualize suas informações e mantenha seu perfil sempre relevante.
        </p>

        {tipoUsuario === "COMPANY" && <EditEnterprise user={user} />}
        {tipoUsuario === "PROFESSIONAL" && <EditProfessional user={user} />}

        {!tipoUsuario && (
            <LoadingSpinner />
        )}
        </section>
    )
}