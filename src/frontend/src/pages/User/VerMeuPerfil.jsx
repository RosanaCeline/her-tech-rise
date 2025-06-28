import React from 'react';

import { useAuth } from '../../context/AuthContext'
import CardDescriptionsProfile from '../../components/Cards/Profile/CardDescriptionsProfile';
import CardProfile from '../../components/Cards/Profile/CardProfile';

export default function VerMeuPerfil() {
    const { user } = useAuth();

    if (!user) {
        return (
            <main className="flex flex-col items-center px-6 lg:px-30 pt-40 pb-10 gap-10">
            <p className="text-xl text-[var(--text-secondary)]">
                Carregando perfil...
            </p>
            </main>
        )
    }

    const tipoUsuario = user?.tipo_usuario || 'professional'; 
    const isProfissional = tipoUsuario === 'professional';
    const isEnterprise = tipoUsuario === 'enterprise';

    return (
        <main className="flex flex-col items-center px-6 lg:px-30 pt-40 pb-10 gap-10 max-w-8xl mx-auto">
        {isProfissional && (
            <>
            <CardProfile
                tipo_usuario={user.tipo_usuario}
                photo={user.photo}
                name={user.nome}
                nameuser={user.nameuser}
                email={user.email}
                number={user.telefone}
                link={user.link}
                city={user.endereco?.cidade}
                state={user.endereco?.estado}
            />
            <CardDescriptionsProfile
                title="Tecnologias"
                content={user.tecnologias}
            />
            <CardDescriptionsProfile
                title="Biografia"
                content={user.biografia}
            />
            </>
        )}

        {isEnterprise && (
            <>
            <CardProfile
                tipo_usuario={user.tipo_usuario}
                photo={user.photo}
                name={user.nome}
                nameuser={user.nameuser}
                email={user.email}
                number={user.telefone}
                link={user.link}
                city={user.endereco?.cidade}
                state={user.endereco?.estado}
            />

            <CardDescriptionsProfile
                title="Descrição"
                content={user.descricao}
            />
            <CardDescriptionsProfile
                title="Sobre nós"
                content={user.sobrenos}
            />
            </>
        )}
        </main>
    )
}