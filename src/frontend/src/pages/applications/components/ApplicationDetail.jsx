import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { X, File } from 'lucide-react'

import { myApplicationDetail, cancelApplication, myCompanyApplicationDetail } from '../../../services/applicationService'
import PopUp from '../../../components/PopUp'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction'
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import { toSafeUrl } from '../../../services/safeUrl'
import { getErrorMessage } from '../../../services/errorMessage';
import JobStatusBadge from '../../JobsListing/components/JobStatusBadge';
import { formatDate } from '../../JobsListing/jobLabels';

export default function ApplicationDetail({applicationDetail, setApplicationDetail, fetchMyApplications, user = 'professional'}){

    const navigate = useNavigate();
    const [data, setData] = useState('');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canceling, setCanceling] = useState(false);
    const [cancelError, setCancelError] = useState('');

    const fetchApplicationDetail = async (id) => {
        try {
            const response = user === 'professional' ? await myApplicationDetail(id) : await myCompanyApplicationDetail(id)
            setData(response)
        } catch(err){
            setError(getErrorMessage(err, 'Não foi possível carregar os detalhes da candidatura.'));
            console.error(err);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplicationDetail(applicationDetail)
    }, [applicationDetail]);
    
    const handleCancelApplication = async () => {
        setCanceling(true)
        setCancelError('')
        try {
            await cancelApplication(applicationDetail)
            setCancelModalOpen(false)
            setApplicationDetail('')
            await fetchMyApplications()
        } catch(err) {
            setCancelModalOpen(false)
            setCancelError(getErrorMessage(err, 'Sua candidatura não foi cancelada.'))
        } finally {
            setCanceling(false)
        }
    };

    if (loading) return ( <LoadingSpinner /> );
    if (error) return (
        <PopUp onClose={() => setApplicationDetail('')} ariaLabel="Detalhes da candidatura">
            <button type="button" onClick={() => setApplicationDetail('')} aria-label="Fechar" className='ml-auto cursor-pointer'>
                <X aria-hidden="true"/>
            </button>
            <p role="alert" className="my-4 break-words">{error}</p>
        </PopUp>
    );

    return(
        <PopUp>
            <X className='cursor-pointer ml-auto' onClick={() => setApplicationDetail('')}/>
            <div className="flex gap-x-7 justify-center">
                {user === 'professional' 
                    ? 
                        <> 
                            <img src={data.companyProfilePic} className="w-1/9 h-1/9 my-auto rounded-xl"/>
                            <div className="flex flex-col my-auto">
                                <p className="font-bold">{data.jobTitle}</p>
                                <p>{data.companyName}</p>
                            </div>
                        </> 
                    : 
                        <>
                            <img src={data.applicantProfilePic} className="w-1/9 h-1/9 my-auto rounded-full"/>
                            <div className="flex flex-col my-auto">
                                <p className="font-bold">{data.applicantName}</p>
                                <p>{data.applicantEmail}</p>
                                <p>{data.applicantPhone}</p>
                            </div>
                        </>
                }
            </div>
            <div className="mt-4 font-bold flex flex-col gap-y-1.5">
                <p>
                    Link do portfólio:{" "}
                    {toSafeUrl(data.portfolioLink) 
                        ?
                            <a href={toSafeUrl(data.portfolioLink)} target="_blank" rel="noopener noreferrer" className="font-normal text-blue-600 underline break-words max-w-full">
                                {data.portfolioLink}
                            </a>
                        : 
                            <span className="font-normal break-words">{data.portfolioLink || 'não informado'}</span>
                    }
                </p>

                <p>
                    Link do GitHub:{" "}
                    {toSafeUrl(data.githubLink) 
                        ?
                            <a href={toSafeUrl(data.githubLink)} target="_blank" rel="noopener noreferrer" className="font-normal text-blue-600 underline break-words max-w-full">
                                {data.githubLink}
                            </a>
                        : 
                            <span className="font-normal break-words">{data.githubLink || 'não informado'}</span>
                    }
                </p>

                <p className="flex mx-auto">
                    Currículo:{" "}
                    <a href={toSafeUrl(data.resumeUrl) ?? undefined} target="_blank" rel="noopener noreferrer" className="ml-3 gap-1 flex font-normal text-blue-600 break-words max-w-full">
                        <File/> Acessar
                    </a>
                </p>

                <p>Candidatura enviada em:{" "}
                    <span className="font-normal">{formatDate(data.appliedAt)}</span>
                </p>

                <p>Data-limite da vaga:{" "}
                    <span className="font-normal">{formatDate(data.applicationDeadline)}</span>
                </p>

                <p className="flex items-center justify-center gap-2">Status da vaga:
                    <JobStatusBadge isActive={data.isActive} isExpired={data.isExpired}/>
                </p>
                {(!data.isActive || data.isExpired) &&
                    <p className="font-normal text-sm text-gray-600">Esta vaga não recebe mais candidaturas.</p>
                }

                {cancelError &&
                    <p role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-normal px-4 py-3 break-words">{cancelError}</p>
                }
            </div>

            {user === 'professional' 
                ? 
                    <>
                        <div className="mt-5">
                            <BtnCallToAction onClick={() => setCancelModalOpen(true)}>Cancelar candidatura</BtnCallToAction>
                        </div>
                        {cancelModalOpen && (
                            <ConfirmModal open={cancelModalOpen} title="Confirmar cancelamento"
                                message="Tem certeza que deseja cancelar candidatura?" 
                                confirmText={canceling ? 'Cancelando...' : 'Sim'} cancelText="Não" loading={canceling}
                                onConfirm={() => handleCancelApplication()}
                                onCancel={() => { if (!canceling) setCancelModalOpen(false); }}/>
                        )}
                    </>
                :
                    <div className="mt-5">
                        <BtnCallToAction onClick={() => navigate(`/profile/professional/${data.applicantId}-${data.applicantHandle}`)}>Ver Perfil</BtnCallToAction>
                    </div>
            }
        </PopUp>
    )
} 