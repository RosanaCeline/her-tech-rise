import { useState, useEffect } from 'react'
import { applicationsById } from '../../services/applicationService'
import { useNavigate, useParams } from 'react-router-dom';
import { Undo2, CircleX, CircleCheck } from 'lucide-react';
import ApplicationDetail from './components/ApplicationDetail'

export default function CompanyApplications(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [jobApplications, setJobApplications] = useState([])
    const [applicationDetail, setApplicationDetail] = useState('')

    const fetchApplications = async () =>{
        const response = await applicationsById(id)
        setJobApplications(response)
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    return(
        <main className='flex flex-col min-h-[83vh] bg-(--gray) pt-34 pb-6'>
            <div className="flex flex-col mb-6 w-5/6 p-8 bg-white mx-auto rounded-xl">
                <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' 
                onClick={() => navigate('/empresa/vagas')}>
                    <Undo2/>
                    Voltar
                </button>

                <h1 className="text-3xl font-semibold text-[var(--purple-secundary)] pt-2 mx-auto mb-4">Candidaturas recebidas</h1>

                <div className="flex justify-center mt-2">
                    <div className="w-1/10">
                        <img src={jobApplications.companyProfilePic} className="w-full object-cover rounded-xl"/>
                    </div>
                    <div className="ml-3 my-auto">
                        <p className="font-bold">{jobApplications.jobTitle}</p>
                        <p className="font-medium">{jobApplications.companyName}</p>
                        <p>Candidatado em {new Date(jobApplications.applicationDeadline).toLocaleDateString('pt-BR')}</p>
                        {jobApplications.isActive
                        ? <p className="flex gap-2">Status da vaga: Ativa <CircleCheck size='18' className="my-auto text-green-900"/></p>
                        : <p className="flex gap-2">Status da vaga: Inativa <CircleX size='18' className="my-auto text-red-900"/></p>}
                    </div>
                </div>

                <p className='mx-auto mt-6 font-medium'>{jobApplications.totalApplications > 1
                ? `${jobApplications.totalApplications} candidaturas recebidas`
                : `${jobApplications.totalApplications === 0 ? 'Nenhuma' : '1'} candidatura recebida`}</p>

                {jobApplications.totalApplications > 0 &&
                <div className="flex flex-col gap-y-4 mt-3">
                {jobApplications.applications.map((application) => 
                    <div className='flex grid grid-cols-10 hover:bg-slate-50 border rounded-xl border-(--gray) p-3'>
                        <div className="">
                            <img src={application.applicantProfilePic} className="w-full object-cover rounded-full"/>
                        </div>
                        <div className="text-sm pl-4 col-span-9 flex flex-col lg:flex-row w-full">
                            <div className="w-7/9 pr-6 flex flex-col my-auto">
                                <p className="font-bold">Nome:  
                                    <span className='font-normal'> {application.applicantName}</span>
                                </p>
                                <p className="font-bold">Telefone:  
                                    <span className='font-normal'> {application.applicantPhone}</span>
                                </p>
                                <p className="font-bold">Email:  
                                    <span className='font-normal'> {application.applicantEmail}</span>
                                </p>
                                <p className="font-bold">Biografia:  
                                    <span className='font-normal'> {application.applicantTechnology || 'Não informada'}</span>
                                </p>

                                {(application.gender === 'MULHER' || application.gender === 'PESSOA_NAO_BINARIA') &&
                                <p className="font-bold">Gênero:  
                                    <span className='font-normal'> {application.gender === 'MULHER' ? 'Mulher' : 'Pessoa não binária'}</span>
                                </p>}
                            </div>

                            <div className='lg:w-2/9 text-sm flex flex-col md:flex-row lg:flex-col gap-y-3 items-end justify-around mt-4 lg:mt-0'>
                                <div className="lg:ml-auto">
                                <button className="border border-(--purple-primary) text-(--purple-primary) cursor-pointer rounded-2xl py-2 px-6
                                transition duration-300 hover:bg-(--purple-primary) hover:text-white hover:scale-110"
                                onClick={() => setApplicationDetail(application.applicationId)}>
                                    Ver candidatura
                                </button></div>
                            </div>
                        </div>
                    </div>)}
                </div>}
            </div>
            {applicationDetail && 
            <ApplicationDetail applicationDetail={applicationDetail} setApplicationDetail={setApplicationDetail} user="company"/>}
        </main>
    )
}