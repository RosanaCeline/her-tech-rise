import React, { useState, useEffect } from "react";

import { useAuth } from '../../../context/AuthContext'
import EditEnterprise from './forms/EditEnterprise'
import EditProfessional from './forms/EditProfessional'

export default function EditMyProfile () {
    const { user } = useAuth()
    const [tipoUsuario, setTipoUsuario] = useState(null)

    useEffect(() => {
        if (user) {
            setTipoUsuario(user.tipo_usuario);
        }
    }, [user])

    return (
        <section>
            <h1 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">EDITAR MEU PERFIL</h1>
            <p className="mt-2 mb-6 text-lg max-w-3xl text-[var(--font-gray)]">Atualize suas informações e mantenha seu perfil sempre relevante.</p>

            {tipoUsuario === "enterprise" && <EditEnterprise user={user} />}
            {tipoUsuario === "professional" && <EditProfessional user={user} />}

            {!tipoUsuario && (
                <p className="text-[var(--gray)] mt-4">Carregando informações do usuário...</p>
            )}
        </section>
    )
}
//           titulo: "Desenvolvedora Full Stack",
//           empresa: "DevWave Solutions",
//           modalidade: "Remoto",
//           datainicial: "2024-01-15",
//           datafinal: "",
//           atualxp: true,
//           descricao: "Responsável pelo desenvolvimento e manutenção de aplicações web escaláveis...",