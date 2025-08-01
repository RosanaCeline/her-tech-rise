import { useNavigate } from "react-router-dom"
import { Undo2 , CircleCheck, CircleX, X, File} from "lucide-react"
import { myApplications } from "../../services/applicationService"
import ApplicationDetail from "./components/ApplicationDetail"
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
                ? <div className="grid lg:grid-cols-2 gap-x-10 px-10 gap-y-5">
                    {applications.map((application) => <ApplicationItem application={application} setApplicationDetail={setApplicationDetail}/>)}
                </div>
                : <p className="mx-auto my-4">Nenhuma candidatura realizada.</p>}
            </div>
            {applicationDetail !== '' && 
                <ApplicationDetail applicationDetail={applicationDetail} setApplicationDetail={setApplicationDetail} 
                fetchMyApplications={fetchMyApplications}/>}
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