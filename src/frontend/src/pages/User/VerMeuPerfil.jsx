import React, { useEffect, useState } from 'react';

import { getProfessionalById  } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import CardDescriptionsProfile from '../../components/Cards/Profile/CardDescriptionsProfile';
import CardProfile from '../../components/Cards/Profile/CardProfile';
import CardPublicationsProfile from '../../components/Cards/Profile/CardPublicationsProfile'
import CardExperienceProfile from '../../components/Cards/Profile/CardExperienceProfile'
import SeeStatistics from './statistics/SeeStatistics'

export default function VerMeuPerfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await getProfessionalById();
                console.log(response)
                console.log('user', getCurrentUser())
                
                const userMapped = {
                    ...response,
                    tecnologias: response.technology,
                    biografia: response.biography,
                    experiencias: response.experiences,
                    telefone: response.phoneNumber,
                    nome: response.name,
                    nameuser: response.handle,
                    photo: response.profilePic,
                    endereco: {
                        cidade: response.city,
                        estado: response.uf,
                    },
                    statistics: {
                        profilevisits: response.profileVisits ?? 0,
                        followers: response.followersCount ?? 0,
                        following: response.followingCount ?? 0,
                        posts: response.posts?.length ?? 0,
                        likes: response.likesCount ?? 0,
                    },
                }
                setUser(userMapped);
            } catch (err) {
                setError('Erro ao carregar perfil.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading) return <main className="flex ...">Carregando perfil...</main>;
    if (error) return <main className="flex ..."><p className="text-red-600">{error}</p></main>;
    if (!user) return <main className="flex ...">Nenhum perfil encontrado.</main>;

    const tipoUsuario = getCurrentUser().role; 
    const isProfissional = tipoUsuario === 'PROFESSIONAL';
    const isEnterprise = tipoUsuario === 'COMPANY';

  return (
    <main className="flex flex-col items-center px-6 lg:px-30 pt-40 pb-10 gap-10 max-w-8xl mx-auto">
        <CardProfile
            tipo_usuario={tipoUsuario}
            photo={user.photo}
            name={user.nome}
            nameuser={user.nameuser}
            email={user.email}
            number={user.telefone}
            link={user.externalLink}
            city={user.endereco.cidade}
            state={user.endereco.estado}
            statisticsComponent={
                <SeeStatistics
                profilevisits={user.statistics.profilevisits}
                followers={user.statistics.followers}
                following={user.statistics.following}
                posts={user.statistics.posts}
                likes={user.statistics.likes}
                />
            }
        />

        {isProfissional && (
        <>
            <CardDescriptionsProfile title="Tecnologias" content={user.tecnologias} />
            <CardDescriptionsProfile title="Biografia" content={user.biografia} />
            <CardPublicationsProfile title="Publicações" content="inserir publicações" />
            <CardExperienceProfile title="Experiência" experiencias={user.experiencias} />
        </>
        )}

        {isEnterprise && (
            <>
            <CardDescriptionsProfile title="Descrição" content={user.description} />
            <CardDescriptionsProfile title="Sobre nós" content={user.aboutUs} />
            </>
        )}
    </main>
  );
}