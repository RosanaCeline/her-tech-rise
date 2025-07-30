import { useNavigate } from "react-router-dom"
import { Undo2 , CircleCheck, CircleX, X, File} from "lucide-react"
import { myApplications, myApplicationDetail, cancelApplication } from "../../services/applicationService"
import { useEffect, useState } from "react"
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import PopUp from "../../components/PopUp"

export default function ProfessionalApplications(){
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [applicationDetail, setApplicationDetail] = useState('')

    const fetchMyApplications = async () => {
        const response = await myApplications()
        setApplications(response)
    }

    useEffect(() => {
        fetchMyApplications()
    }, [])

    return(
        <main className='flex flex-col min-h-[83vh] bg-(--gray) pt-34 pb-6'>
            <div className="flex flex-col mb-6 w-5/6 p-8 bg-white mx-auto rounded-xl">
                <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' 
                onClick={() => navigate('/profissional/vagas')}>
                    <Undo2/>
                    Voltar
                </button>

                <h1 className="text-3xl font-semibold text-[var(--purple-secundary)] pt-2 mx-auto mb-4">Minhas candidaturas</h1>

                {applications.length > 0
                ? <div className="grid grid-cols-2 gap-x-10 px-10 gap-y-5">
                    {applications.map((application) => <ApplicationItem application={application} setApplicationDetail={setApplicationDetail}/>)}
                </div>
                : <p className="mx-auto my-4">Nenhuma candidatura realizada.</p>}
            </div>
            {applicationDetail !== '' && 
            <PopUp>
                <ApplicationDetail applicationDetail={applicationDetail} setApplicationDetail={setApplicationDetail} fetchMyApplications={fetchMyApplications}/>
            </PopUp>}
        </main>
    )
}

function ApplicationItem({application, setApplicationDetail}){
    return(
        <div className="border border-(--gray) rounded-xl p-4 hover:bg-slate-50">
            <div className="flex">
                <div className="w-1/5">
                    <img src={application.companyProfilePic} className="w-full object-cover rounded-xl"/>
                </div>
                <div className="ml-3">
                    <p className="font-bold">{application.jobTitle}</p>
                    <p className="font-medium">{application.companyName}</p>
                    <p>Candidatado em {new Date(application.appliedAt).toLocaleDateString('pt-BR')}</p>
                    {application.isActive
                    ? <p className="flex gap-2">Status da vaga: Ativa <CircleCheck size='18' className="my-auto text-green-900"/></p>
                    : <p className="flex gap-2">Status da vaga: Inativa <CircleX size='18' className="my-auto text-red-900"/></p>}
                </div>
            </div>
            <div className="flex justify-center mt-3">
                <BtnCallToAction onClick={() => setApplicationDetail(application.applicationId)}>Ver detalhes</BtnCallToAction>
            </div>
        </div>
    )
}

function ApplicationDetail({applicationDetail, setApplicationDetail, fetchMyApplications}){
    const [data, setData] = useState('')
    const [cancelModalOpen, setCancelModalOpen] = useState(false)

    const fetchApplicationDetail = async (id) => {
        const response = await myApplicationDetail(id)
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
        <div>
            <X className='cursor-pointer ml-auto' onClick={() => setApplicationDetail('')}/>
            <div className="flex gap-x-7 justify-center">
                <img src={data.companyProfilePic} className="w-1/9 h-1/9 my-auto rounded-xl"/>
                <div className="flex flex-col my-auto">
                    <p className="font-bold">{data.jobTitle}</p>
                    <p>{data.companyName}</p>
                </div>
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

                {data.isActive
                ? <p className="flex mx-auto">Status da vaga: 
                    <span className="ml-2 flex font-normal gap-2">Ativa <CircleCheck size='18' className="my-auto text-green-900"/></span></p>
                : <p className="flex mx-auto">Status da vaga: 
                    <span className="ml-2 flex font-normal gap-2">Inativa <CircleX size='18' className="my-auto text-red-900"/></span></p>}
                
                {data.isExpired
                ? <p>Essa vaga não aceita mais candidaturas</p>
                : <p>Expira em: <span className="font-normal">{new Date(data.applicationDeadline).toLocaleDateString('pt-BR')}</span></p>}
                
            </div>
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
            )}
        </div>
    )
} 