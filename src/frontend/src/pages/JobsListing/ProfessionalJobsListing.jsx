import { useEffect, useState } from "react"
import { publicJobPostings, publicJobDetail } from "../../services/jobsService"
import { House, MapPin, CalendarDays } from 'lucide-react'
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import PopUp from "../../components/PopUp"
import ApplyJob from "./components/ApplyJob"
import { useNavigate } from "react-router-dom"
import { getGender } from "../../services/authService"
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"

export default function ProfessionalJobsListing(){
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [jobDetail, setJobDetail] = useState('')
    const [currentJobDetail, setCurrentJobDetail] = useState(0)
    const [applyJobModal, setApplyJobModal] = useState(false)

    const fetchJobs = async () => {
        const response = await publicJobPostings()
        setJobs(response)
        if(response.length > 0){
            const detail = await publicJobDetail(response[0].id)
            setJobDetail(detail)
            setCurrentJobDetail(detail.id)
        }
    }

    const fetchJobDetail = async (id) => {
        return await publicJobDetail(id)
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    return(
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            <div className="flex flex-col mb-6 w-5/6 p-6 bg-white mx-auto rounded-xl">
                <div className="flex flex-col md:flex-row justify-between mb-5 gap-y-2">
                    <h1 className="text-3xl font-semibold text-[var(--purple-secundary)] pt-2">Confira vagas em destaque</h1>
                    <BtnCallToAction onClick={() => navigate('/profissional/vagas/candidaturas')}>MINHAS CANDIDATURAS</BtnCallToAction>
                </div>
                {jobs.length > 0
                ? <div className="max-h-[65vh] bg-(--gray) rounded-2xl flex border border-(--gray)">
                    <div className="w-full md:w-2/5 overflow-y-auto">
                        {jobs.map((job) => 
                        <div>
                            <JobItem key={job.id} job={job} 
                            fetchJobDetail={fetchJobDetail} setJobDetail={setJobDetail} isCurrent={currentJobDetail === job.id}
                            setCurrentJobDetail={setCurrentJobDetail}/>
                            {currentJobDetail === job.id && 
                            <div className="md:hidden">
                                <JobDetails setApplyJobModal={setApplyJobModal} job={jobDetail}/>
                            </div>}
                        </div>
                        )}
                    </div>
                    <div className="hidden md:flex w-3/5 overflow-y-auto">
                        <JobDetails setApplyJobModal={setApplyJobModal} job={jobDetail}/>
                    </div>
                </div>
                : <p className="mx-auto my-4">Não há vagas disponíveis no momento</p>}
            </div>
            {applyJobModal !== false &&
            <PopUp><ApplyJob setApplyJobModal={setApplyJobModal} applyJobModal={applyJobModal}/></PopUp>}
        </main>
    )
}

function JobItem({job, setJobDetail, fetchJobDetail, isCurrent, setCurrentJobDetail}){
    return (
        <div className={`border-b-1 border-slate-300 p-2 px-3 flex gap-x-4 cursor-pointer ${isCurrent && 'bg-slate-300'}`}
        onClick={async () => {
            const detail = await fetchJobDetail(job.id)
            setJobDetail(detail)
            setCurrentJobDetail(detail.id)
        }}>
            <img src={job.companyProfilePic} className="w-1/9 h-1/9 my-auto rounded-full"/>
            <div className="flex flex-col">
                <p className="font-bold">{job.title}</p>
                <p>{job.companyName}</p>
                <p>{job.location}</p>
            </div>
        </div>
    )
}

function JobDetails({job, setApplyJobModal}){
    const contractTypes = {
        CLT: "CLT", PJ: "PJ",
        APRENDIZ: "Aprendiz", ESTAGIO: "Estágio",
        TRAINEE: "Trainee", TEMPORARIO: "Temporário",
        FREELANCER: "Freelancer", VOLUNTARIO: "Voluntário"
    }

    const jobModels = {
        REMOTO: 'Remoto', HIBRIDO: 'Híbrido', PRESENCIAL: 'Presencial'
    }

    const [genderWarning, setGenderWarning] = useState(false)
    const gender = getGender()

    return(
        <div className="p-4 bg-white w-full">
            <div className="flex justify-center gap-x-8 border-b-1 border-slate-200 pb-4">
                <img src={job.companyProfilePic} className="w-1/8 h-1/8 my-auto rounded-full"/>
                <div className="my-auto"> 
                    <p className="font-bold">{job.title}</p>
                    <p>{job.companyName}</p>
                </div>
            </div>
            <div className="mt-4 px-4">
                <p className="font-bold">Sobre a vaga: </p>
                {job.description}
                <p className="font-bold">Requisitos:</p>
                {job.requirements}
                <p className="font-bold">Tipo de contrato: <span className="font-normal">{contractTypes[job.contractType]}</span></p>
                <div className="grid sm:grid-cols-3 mt-3 text-sm">
                    <div>
                        <p className="font-bold">Modalidade:</p>
                        <p className="flex items-center gap-1"><House size={18}/>{jobModels[job.jobModel]}</p>
                    </div>
                    <div>
                        <p className="font-bold">Localização:</p>
                        <p className="flex items-center gap-1"><MapPin size={18}/>{job.location}</p>
                    </div>
                    <div>
                        <p className="font-bold">Data-limite:</p>
                        <p className="flex items-center gap-1"><CalendarDays size={18}/>{new Date(job.applicationDeadline).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            </div>
            <div className={`flex justify-center mt-7 ${job.hasApplied && 'grayscale opacity-60'}`}>
                {job.hasApplied
                ? <BtnCallToAction>JÁ CANDIDATADO</BtnCallToAction>
                : <BtnCallToAction onClick={() => {
                    if(gender !== 'MULHER' && gender !== 'PESSOA_NAO_BINARIA') setGenderWarning(true)
                    else setApplyJobModal(job)
                }}>CANDIDATAR-SE</BtnCallToAction>}
            </div>
            {genderWarning &&
            gender === null
            ? <ConfirmModal open={genderWarning} title="Alerta de vaga afirmativa"
                            message="Esta vaga tem foco em mulheres e, para garantir que você possa participar plenamente das vagas afirmativas,
                             recomendamos que habilite o compartilhamento do seu gênero nas configurações do perfil. 
                             Isso ajuda as empresas a entenderem seu perfil e a promoverem a inclusão." 
                            confirmText="Continuar candidatura" cancelText="Voltar"  
                            onConfirm={() => setApplyJobModal(job)}
                            onCancel={() => setGenderWarning(false)}/> 
            : <ConfirmModal open={genderWarning} title="Alerta de vaga afirmativa"
                            message="Essa vaga tem foco em mulheres e identidades de gênero diversas, 
                            como pessoas não-binárias. Seu perfil não se enquadra no público-alvo desta oportunidade. 
                            Deseja prosseguir mesmo assim? "
                            confirmText="Continuar candidatura" cancelText="Não"  
                            onConfirm={() => setApplyJobModal(job)}
                            onCancel={() => setGenderWarning(false)}/>}
        </div>
    )
}