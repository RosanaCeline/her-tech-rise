import { useState, useEffect } from 'react'
import { myApplicationDetail, cancelApplication, myCompanyApplicationDetail } from '../../../services/applicationService'
import { X, File, CircleX, CircleCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PopUp from '../../../components/PopUp'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction'

export default function ApplicationDetail({applicationDetail, setApplicationDetail, fetchMyApplications, user = 'professional'}){
    const navigate = useNavigate()
    const [data, setData] = useState('')
    const [cancelModalOpen, setCancelModalOpen] = useState(false)

    const fetchApplicationDetail = async (id) => {
        const response = user === 'professional' ? await myApplicationDetail(id) : await myCompanyApplicationDetail(id)
        setData(response)
    }

    useEffect(() => {
        fetchApplicationDetail(applicationDetail)
    }, [applicationDetail])
    
    const handleCancelApplication = async () => {
        await cancelApplication(applicationDetail)
        setCancelModalOpen(false)
        setApplicationDetail('')
        await fetchMyApplications()
        console.log("Fechando o PopUp!")
    }

    return(
        <PopUp>
            <X className='cursor-pointer ml-auto' onClick={() => setApplicationDetail('')}/>
            <div className="flex gap-x-7 justify-center">
                {user === 'professional' 
                ? <> 
                    <img src={data.companyProfilePic} className="w-1/9 h-1/9 my-auto rounded-xl"/>
                    <div className="flex flex-col my-auto">
                        <p className="font-bold">{data.jobTitle}</p>
                        <p>{data.companyName}</p>
                    </div>
                </> : <>
                    <img src={data.applicantProfilePic} className="w-1/9 h-1/9 my-auto rounded-full"/>
                    <div className="flex flex-col my-auto">
                        <p className="font-bold">{data.applicantName}</p>
                        <p>{data.applicantEmail}</p>
                        <p>{data.applicantPhone}</p>
                    </div>
                </>}
            </div>
            <div className="mt-4 font-bold flex flex-col gap-y-1.5">
                <p>
                    Link do portifólio:{" "}
                    {data.portfolioLink ?
                    <a href={data.portfolioLink} target="_blank" rel="noopener noreferrer" className="font-normal text-blue-600 underline break-words max-w-full">
                        {data.portfolioLink}
                    </a>
                    : <span className="font-normal">não informado</span>}
                </p>

                <p>
                    Link do GitHub:{" "}
                    {data.githubLink ?
                    <a href={data.githubLink} target="_blank" rel="noopener noreferrer" className="font-normal text-blue-600 underline break-words max-w-full">
                        {data.githubLink}
                    </a>
                    : <span className="font-normal">não informado</span>}
                </p>

                <p className="flex mx-auto">
                    Currículo:{" "}
                    <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="ml-3 gap-1 flex font-normal text-blue-600 break-words max-w-full">
                        <File/> Acessar
                    </a>
                </p>

                <p>Candidatado em: <span className="font-normal">{new Date(data.appliedAt).toLocaleDateString('pt-BR')}</span></p>

                {user === 'professional' &&
                <>{data.isActive
                ? <p className="flex mx-auto">Status da vaga: 
                    <span className="ml-2 flex font-normal gap-2">Ativa <CircleCheck size='18' className="my-auto text-green-900"/></span></p>
                : <p className="flex mx-auto">Status da vaga: 
                    <span className="ml-2 flex font-normal gap-2">Inativa <CircleX size='18' className="my-auto text-red-900"/></span></p>}
                
                {data.isExpired
                ? <p>Essa vaga não aceita mais candidaturas</p>
                : <p>Expira em: <span className="font-normal">{new Date(data.applicationDeadline).toLocaleDateString('pt-BR')}</span></p>}
                </>}
            </div>
            {user === 'professional' ? <>
            <div className="mt-5">
                <BtnCallToAction onClick={() => setCancelModalOpen(true)}>Cancelar candidatura</BtnCallToAction>
            </div>
            {cancelModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">
                Confirmar Cancelamento
                </h2>
                <p className="mb-6 text-gray-700">Tem certeza que deseja cancelar candidatura?</p>
                <div className="flex justify-center gap-6">
                <button
                    onClick={() => setCancelModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition">
                    Não
                </button>
                <button
                    onClick={() => handleCancelApplication()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
                    Sim
                </button>
                </div>
            </div>
            </div>
            )}</>
            :
            <div className="mt-5">
                <BtnCallToAction onClick={() => navigate(`/profile/professional/${data.applicantId}-${data.applicantHandle}`)}>Ver Perfil</BtnCallToAction>
            </div>}
        </PopUp>
    )
} 