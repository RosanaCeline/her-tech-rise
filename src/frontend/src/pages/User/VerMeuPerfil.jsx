import React, { useEffect, useState } from 'react';

import { getProfileById  } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';

import CardDescriptionsProfile from '../../components/Cards/Profile/CardDescriptionsProfile';
import CardProfile from '../../components/Cards/Profile/CardProfile';
import CardPublicationsProfile from '../../components/Cards/Profile/CardPublicationsProfile'
import CardExperienceProfile from '../../components/Cards/Profile/CardExperienceProfile'
import SeeStatistics from './statistics/SeeStatistics'

import PopUp from '../../components/PopUp';
import AttachFile from '../../components/posts/AttachFile';
import ManagePost from '../../components/posts/ManagePost';

export default function VerMeuPerfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tipoUsuario = getCurrentUser()?.role;
    const isProfessional = tipoUsuario === 'PROFESSIONAL';
    const isCompany = tipoUsuario === 'COMPANY';

    const [activePopUp, setActivePopUp] = useState(null)
    const [postFormData, setPostFormData] = useState({
        content: '',
        media: [],
        visibility: 'public'
    })
    useEffect(() => {
        async function fetchProfile() {
        try {
            const response = await getProfileById();

            const userMapped = {
            ...response,
            nome: response.name,
            nameuser: response.handle,
            telefone: response.phoneNumber,
            email: response.email,
            photo: response.profilePic,
            externalLink: response.externalLink,
            endereco: {
                cidade: response.city,
                estado: response.uf,
            },
            posts: response.posts ?? [], 
            ...(isProfessional && {
                tecnologias: response.technology,
                biografia: response.biography,
                experiencias: response.experiences,
                statistics: {
                    profilevisits: response.profileVisits ?? 0,
                    followers: response.followersCount ?? 0,
                    following: response.followingCount ?? 0,
                    posts: response.posts?.length ?? 0,
                    likes: response.likesCount ?? 0,
                },
            }),
            ...(isCompany && {
                description: response.description,
                aboutUs: response.aboutUs,
                statistics: {
                    profilevisits: response.profileVisits ?? 0,
                    followers: response.followersCount ?? 0,
                    following: response.followingCount ?? 0,
                    posts: response.posts?.length ?? 0,
                    likes: response.likesCount ?? 0,
                },
            }),
            };

            setUser(userMapped);
        } catch (err) {
            setError('Erro ao carregar perfil.');
            console.error(err);
        } finally {
            setLoading(false);
        }
        }

        fetchProfile();
    }, [tipoUsuario]);

    if (loading) return <main className="...">Carregando perfil...</main>;
    if (error) return <main className="..."><p className="text-red-600">{error}</p></main>;
    if (!user) return <main className="...">Nenhum perfil encontrado.</main>;

    return (
    <main className="flex flex-col items-center px-6 lg:px-30 pt-40 pb-10 gap-10 max-w-8xl mx-auto bg-(--gray)">
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

        {isProfessional && (
            <>
            <CardDescriptionsProfile title="Tecnologias" content={user.tecnologias} />
            <CardDescriptionsProfile title="Biografia" content={user.biografia} />
            <CardExperienceProfile title="Experiência" experiencias={user.experiencias} />
            </>
        )}

        {isCompany && (
            <>
            <CardDescriptionsProfile title="Descrição" content={user.description} />
            <CardDescriptionsProfile title="Sobre nós" content={user.aboutUs} />
            </>
        )}
        <CardPublicationsProfile title="Publicações" posts={user.posts} setActivePopUp={setActivePopUp}/>
        {activePopUp && (
          <PopUp>
              {activePopUp === 'post' && <ManagePost user={{profileURL: user.profilePic, userName: user.name}} setActivePopUp={setActivePopUp} 
              formData={postFormData} setFormData={setPostFormData}/>}
              {activePopUp === 'image' && <AttachFile type='image' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
              {activePopUp === 'video' && <AttachFile type='video' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
              {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
          </PopUp>
      )}
    </main>
  );
}