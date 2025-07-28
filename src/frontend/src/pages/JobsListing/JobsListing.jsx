import { useEffect, useState } from "react"
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import ManageJob from "./components/ManageJob"
import PopUp from "../../components/PopUp"
import { companyJobPostings, companyJobPostingDetail, deactivateJobPosting } from "../../services/jobsService"
import { House, MapPin, CalendarDays, PopcornIcon } from 'lucide-react'
import { maskField } from "../../components/form/Label/maskField";


export default function JobsListing(){
    const [manageJobModal, setManageJobModal] = useState('')
    const [jobs, setJobs] = useState([])
    const emptyJobFormData = {
        title: '',
        description: '',
        requirements: '',
        location: '',
        jobModel: '',
        salaryMin: '',
        salaryMax: '',
        contractType: '',
        jobLevel: '',
        applicationDeadline: ''
    }
    const [jobFormData, setJobFormData] = useState(emptyJobFormData)

    const fetchMyJobs = async () => {
        const response = await companyJobPostings()
        setJobs(response)
    }

    useEffect(() => {
        fetchMyJobs()
    }, [])

    const handleDeactivate = async (id) => {
        await deactivateJobPosting(id)
        fetchMyJobs()
    }

    return(
        <main className='flex flex-col bg-(--gray) pt-34 pb-6'>
            <div className="flex flex-col mb-6 w-5/6 p-6 bg-white mx-auto rounded-xl">
                <div className="flex justify-between items-center"> 
                    <h2 className="text-4xl font-semibold text-[var(--purple-secundary)]">Minhas vagas publicadas</h2>
                    <BtnCallToAction 
                    onClick={() => {
                        setJobFormData(emptyJobFormData)
                        setManageJobModal('new')
                    }}>
                    Nova Vaga
                    </BtnCallToAction>
                </div>
                <section className="flex flex-col my-3 gap-y-3">
                    {jobs.length > 0 
                    ? jobs.map((job) => <CompanyJobDetails key={job.id} job={job} handleDeactivate={handleDeactivate} 
                    setManageJobModal={setManageJobModal} setJobFormData={setJobFormData}/>)
                    : <p className="mx-auto mt-4">Sua empresa ainda não publicou nenhuma vaga de emprego</p>}
                </section>
            </div>
            {manageJobModal === 'new' || manageJobModal === 'edit' ? (
            <PopUp>
                <ManageJob
                setJobFormData={setJobFormData}
                jobFormData={jobFormData}
                setManageJobModal={setManageJobModal}
                fetchMyJobs={fetchMyJobs}
                action={manageJobModal}
                />
            </PopUp>
            ) : null}
        </main>
    )
}

function CompanyJobDetails({job, setManageJobModal, setJobFormData, handleDeactivate}){
    const contractTypes = {
        CLT: "CLT", PJ: "PJ",
        APRENDIZ: "Aprendiz", ESTAGIO: "Estágio",
        TRAINEE: "Trainee", TEMPORARIO: "Temporário",
        FREELANCER: "Freelancer", VOLUNTARIO: "Voluntário"
    }

    const jobModels = {
        REMOTO: 'Remoto', HIBRIDO: 'Híbrido', PRESENCIAL: 'Presencial'
    }

    return(
        <div className="flex grid grid-cols-10 border rounded-xl hover:bg-slate-50 border-(--gray) p-3">
            <div className="">
                <img src={job.companyProfilePic} className="w-full object-cover rounded-xl"/>
            </div>
            <div className="text-xs pl-4 col-span-9 flex flex-col lg:flex-row w-full">
                <div className="w-7/9 pr-6"> 
                    <p className="font-bold">{job.title}</p>
                    <p className="font-bold">{job.companyName}</p>

                    <p className="font-bold">Sobre a vaga:</p>
                    {job.description}

                    <p className="font-bold">Requisitos:</p>
                    {job.requirements}

                    <p className="font-bold">Tipo de contrato: <span className="font-normal">{contractTypes[job.contractType]}</span></p>

                    <div className="grid sm:grid-cols-3 mt-3">
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

                    {!job.isActive && <p>Vaga desativada</p>}
                </div>
                <div className="lg:w-2/9 text-sm flex flex-col md:flex-row lg:flex-col gap-y-3 items-end justify-around mt-4 lg:mt-0">
                    <div className="lg:ml-auto">
                    <button className="border border-(--purple-primary) text-(--purple-primary) cursor-pointer rounded-2xl py-2 px-6
                    transition duration-300 hover:bg-(--purple-primary) hover:text-white hover:scale-110"
                    onClick={async () => {
                        const jobDetail = await companyJobPostingDetail(job.id)
                        setJobFormData({
                            ...jobDetail,
                            salaryMin: maskField('money', Number(jobDetail.salaryMin).toFixed(2)),
                            salaryMax: maskField('money', Number(jobDetail.salaryMax).toFixed(2))
                        })
                        setManageJobModal('edit')
                    }}>
                        Editar
                    </button></div>

                    <div className="lg:ml-auto">
                    <button className="border border-(--purple-primary) text-(--purple-primary) cursor-pointer rounded-2xl py-2 px-6
                    transition duration-300 hover:bg-(--purple-primary) hover:text-white hover:scale-110">
                        Ver candidaturas
                    </button></div>

                    {job.isActive && <div className="lg:ml-auto"> 
                    <button className="bg-(--purple-action) text-white cursor-pointer rounded-2xl py-2 px-6
                    transition duration-300 hover:bg-(--purple-primary) hover:text-white hover:scale-110"
                    onClick={() => handleDeactivate(job.id)}>
                        Desativar
                    </button></div>}
                </div>
            </div>
        </div>
    )
} 