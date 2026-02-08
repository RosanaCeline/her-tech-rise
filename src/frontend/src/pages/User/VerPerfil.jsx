import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { followUser, unfollowUser, verifyFollowUser } from '../../services/userService';
import { getProfileById, listFollowers, listFollowing  } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';

import SeeStatistics from './statistics/SeeStatistics'
import CardProfile from '../../components/Cards/Profile/CardProfile';
import CardDescriptionsProfile from '../../components/Cards/Profile/CardDescriptionsProfile';
import CardPublicationsProfile from '../../components/Cards/Profile/CardPublicationsProfile'
import CardExperienceProfile from '../../components/Cards/Profile/CardExperienceProfile'

import PopUp from '../../components/PopUp';
import AttachFile from '../../components/posts/AttachFile';
import ManagePost from '../../components/posts/ManagePost';
import LoadingSpinner from './../../components/LoadingSpinner/LoadingSpinner'

const baseUrl = import.meta.env.VITE_API_URL;

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

    // const [followersCount, setFollowersCount] = useState(0);
    const [followedUser, setFollowedUser] = useState(false);
    const [statistics, setStatistics] = useState({
        profileVisits: 0,
        followers: 0,
        following: 0,
        likes: 0
    });

    const fetchStatistics = useCallback(async () => {
        try {
            const followers = await listFollowers();
            const following = await listFollowing();
            setStatistics({
                profileVisits: user?.statistics?.profilevisits || 0,
                followers: followers.length || 0,
                following: following.length || 0,
                likes: user?.statistics?.likes || 0
            });
        } catch (err) {
            console.error("Erro ao buscar estatísticas:", err);
        }
    }, [user]);

    const fetchProfile = useCallback(async () => {
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
            endereco: {
                cidade: response.city,
                estado: response.uf,
            },
            posts: response.posts ?? [], 
            ...(isProfessional && {
                tecnologias: response.technology,
                biografia: response.biography,
                experiencias: response.experiences,
            }),
            ...(isCompany && {
                description: response.description,
                aboutUs: response.aboutUs,
            }),
            };

            setUser(userMapped);
        } catch (err) {
            setError('Erro ao carregar perfil.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, user_type, isProfessional, isCompany]);
    useEffect(() => {
        fetchProfile().then(() => fetchStatistics());
    }, [fetchProfile, fetchStatistics])

    useEffect(() => {
        const checkFollow = async () => {
            try {
                const res = await verifyFollowUser(userId)
                setFollowedUser(res.isFollowing === true || res.isFollowing === "True");
            } catch (err) {
                console.log(err)
            }
        }
        if (user?.id && !isCurrentUser) checkFollow()
    }, [user?.id, isCurrentUser, userId])

    const handleFollow = async (id = userId, isFollowing = followedUser) => {
        try {
            setLoading(true)
            if (id === userId) {
                if (followedUser) {
                    await unfollowUser(userId);
                    setFollowedUser(false);
                    // setFollowersCount((prev) => prev - 1);
                } else {
                    await followUser(userId);
                    setFollowedUser(true);
                    // setFollowersCount((prev) => prev + 1);
                }
            } else {
                if (isFollowing) {
                    await unfollowUser(id);
                } else {
                    await followUser(id);
                }
            }
            fetchProfile();
        } catch (err) {
            console.log(err);
        }
    };


    if (loading) return ( <LoadingSpinner /> )
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
            copyMyLink={
                user.externalLink && user.externalLink !== ''
                ? user.externalLink
                : user.tipo_usuario === 'company'
                ? `${baseUrl}/profile/company/${user.id}-@${user.username}`
                : `${baseUrl}/profile/professional/${user.id}-@${user.username}`
            }
            city={user.endereco.cidade}
            state={user.endereco.estado}
            followersCount={user.followersCount}
            handleFollow={handleFollow}
            followedUser={followedUser}
            statisticsComponent={
                <SeeStatistics
                    profilevisits={statistics.profileVisits}
                    followers={statistics.followers}
                    following={statistics.following}
                    posts={user.posts}
                    likes={statistics.likes}
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
        <CardPublicationsProfile title="Publicações" 
                                posts={user.posts} 
                                photo={user.photo} 
                                name={user.nome} 
                                onPostsUpdated={fetchProfile} 
                                setActivePopUp={setActivePopUp}
                                isCurrentUser={isCurrentUser}
        />
        {activePopUp && (
          <PopUp>
              {activePopUp === 'post' && <ManagePost user={{profileURL: user.profilePic, userName: user.name}} setActivePopUp={setActivePopUp} 
              formData={postFormData} setFormData={setPostFormData}/>}
              {activePopUp === 'image' && <AttachFile type='image' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
              {activePopUp === 'video' && <AttachFile type='video' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
              {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
          </PopUp>
      )}
    {loading && (
        <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
        <LoadingSpinner />
        </div>
    )}
    </main>
  );
}