import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { deactivateAccount, followUser, unfollowUser, verifyFollowUser } from '../../services/userService';
import { getProfileById, listFollowers, listFollowing  } from '../../services/userService';
import { getCurrentUser, logout as logoutService } from '../../services/authService';

import SeeStatistics from './statistics/SeeStatistics'
import CardProfile from '../../components/Cards/Profile/CardProfile';
import CardDescriptionsProfile from '../../components/Cards/Profile/CardDescriptionsProfile';
import CardPublicationsProfile from '../../components/Cards/Profile/CardPublicationsProfile'
import CardExperienceProfile from '../../components/Cards/Profile/CardExperienceProfile'

import PopUp from '../../components/PopUp';
import AttachFile from '../../components/posts/AttachFile';
import ManagePost from '../../components/posts/ManagePost';
import LoadingSpinner from './../../components/LoadingSpinner/LoadingSpinner'
import PopUpBlurProfile from '../../components/Cards/Profile/PopUpBlurProfile';
import LoadError from '../../components/LoadError/LoadError';
import { getErrorMessage } from '../../services/errorMessage';

export default function VerPerfil() {

    const navigate = useNavigate();
    const { user_type, user_info } = useParams();
    const userId = (user_info === 'me') ? getCurrentUser().id : user_info.split('-')[0];
    const isCurrentUser = String(userId) === String(getCurrentUser().id);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const followPending = useRef(false);

    const isProfessional = user_type === 'professional';
    const isCompany = user_type === 'company';

    const [activePopUp, setActivePopUp] = useState(null);
    const [postFormData, setPostFormData] = useState({
        content: '',
        media: [],
        visibility: 'PUBLICO'
    });

    const [followedUser, setFollowedUser] = useState(false);
    const [statistics, setStatistics] = useState({
        profileVisits: 0,
        followers: 0,
        following: 0,
        likes: 0
    });

    const fetchStatistics = useCallback(async (userData) => {
        try {
            const followers = await listFollowers();
            const following = await listFollowing();
            setStatistics({
                profileVisits: userData?.statistics?.profilevisits || 0,
                followers: followers.length || 0,
                following: following.length || 0,
                likes: userData?.statistics?.likes || 0
            });
        } catch (err) {
            console.error("Erro ao buscar estatísticas:", err);
        }
    }, []);

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
            return userMapped;
        } catch (err) {
            setError(getErrorMessage(err, 'Não foi possível carregar este perfil.'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, user_type, isProfessional, isCompany]);

    useEffect(() => {
        fetchProfile().then((userData) => fetchStatistics(userData));
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

    const handleDeleteAccount = async () => {
        try {
            await deactivateAccount();
            logoutService();
            navigate('/login', { replace: true, state: { accountDeleted: true } });
        } catch (err) {
            console.error("Erro ao deletar conta:", err);
        }
    };

    // sem trocar a página inteira pelo spinner; ignora cliques repetidos enquanto a requisição anda
    const handleFollow = async (id = userId, isFollowing = followedUser) => {
        if (followPending.current) return;
        followPending.current = true;
        try {
            if (id === userId) {
                if (followedUser) {
                    await unfollowUser(userId);
                    setFollowedUser(false);
                } else {
                    await followUser(userId);
                    setFollowedUser(true);
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
        } finally {
            followPending.current = false;
        }
    };

    if (loading) return ( <LoadingSpinner /> );
    if (error) return <LoadError message={error} />;
    if (!user) return <div className="flex-1 flex items-center justify-center p-8"><p>Nenhum perfil encontrado.</p></div>;

    const profileLink = `${window.location.origin}/hertechrise/profile/${user_type}/${user.id}-@${user.nameuser?.replace('@','')}`;
    
    return (
        <div className="flex flex-col bg-[var(--light)] pt-10 pb-10 min-h-full">
            <div className="w-full px-4 sm:px-0 sm:w-4/5 lg:w-3/5 mx-auto flex flex-col gap-8">
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
                    onRequestDelete={() => setDeleteModalOpen(true)}
                    onProfileUpdated={fetchProfile}
                    copyMyLink={profileLink}
                    city={user.endereco.cidade}
                    state={user.endereco.estado}
                    followersCount={user.followersCount}
                    followingCount={isCurrentUser ? statistics.following : undefined}
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
                    <PopUp onClose={() => setActivePopUp(null)} ariaLabel="Nova publicação">
                        {activePopUp === 'post' && <ManagePost user={{profileURL: user.profilePic, userName: user.name}} setActivePopUp={setActivePopUp} 
                        formData={postFormData} setFormData={setPostFormData} onSuccess={() => fetchProfile()}/>}
                        {activePopUp === 'image' && <AttachFile type='image' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
                        {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setPostFormData} setActivePopUp={setActivePopUp}/>}
                    </PopUp>
                )}
            </div>

            {deleteModalOpen && (
                <PopUpBlurProfile
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    content={
                        <div className="w-full flex items-center justify-center">
                            <div className="p-6 w-full max-w-md text-center">                        
                                <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">
                                    Confirmar Exclusão
                                </h2>
                                <p className="mb-6 text-gray-700">
                                    Tem certeza que deseja excluir seu perfil? Esta ação não poderá ser desfeita.
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
                                    >
                                        Não
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
                                    >
                                        Sim
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                />
            )}
        </div>
    );
}
