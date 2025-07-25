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

import { useParams } from 'react-router-dom';
import { followUser, unfollowUser } from '../../services/userService';

export default function VerPerfil() {
    const { user_type, user_info } = useParams()
    const userId = (user_info === 'me') ? getCurrentUser().id : user_info.split('-')[0];
    const isCurrentUser = userId === getCurrentUser().id
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isProfessional = user_type === 'professional';
    const isCompany = user_type === 'company';

    const [activePopUp, setActivePopUp] = useState(null)
    const [postFormData, setPostFormData] = useState({
        content: '',
        media: [],
        visibility: 'public'
    })
    async function fetchProfile() {
        try {
            const response = await getProfileById(userId, user_type);

            const userMapped = {
            ...response,
            nome: response.name,
            nameuser: response.handle,
            telefone: response.phoneNumber,
            email: response.email,
            photo: response.profilePic,
            externalLink: response.externalLink,
            followersCount: response.followersCount,
            followedUser: false,
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
    useEffect(() => {
        fetchProfile();
    }, [])

    const handleFollow = async () => {
    try{
      if(user.followedUser){
        await unfollowUser(user.id)
        setUser((prev) => ({...prev, followedUser: false}))
      }else{
        await followUser(user.id)
        setUser((prev) => ({...prev, followedUser: true}))
      }
      fetchProfile()
    }catch(err){
      console.log(err)
    }
  }

    if (loading) return <main className="...">Carregando perfil...</main>;
    if (error) return <main className="..."><p className="text-red-600">{error}</p></main>;
    if (!user) return <main className="...">Nenhum perfil encontrado.</main>;

    return (
    <main className="flex flex-col items-center px-6 lg:px-30 pt-40 pb-10 gap-10 max-w-8xl mx-auto bg-(--gray)">
        <CardProfile
            isCurrentUser={isCurrentUser}
            tipo_usuario={user_type}
            id={user.id}
            photo={user.photo}
            name={user.nome}
            nameuser={user.nameuser}
            email={user.email}
            number={user.telefone}
            link={user.externalLink}
            city={user.endereco.cidade}
            state={user.endereco.estado}
            followersCount={user.followersCount}
            handleFollow={handleFollow}
            followedUser={user.followedUser}
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