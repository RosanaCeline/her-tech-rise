import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { House, MapPin, CalendarDays, Banknote, Signal } from 'lucide-react'

import { publicJobPostings, publicJobDetail } from "../../services/jobsService"
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import PopUp from "../../components/PopUp"
import ApplyJob from "./components/ApplyJob"
import { getGender } from "../../services/authService"
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"
import FeedbackModal from "../../components/ConfirmModal/FeedbackModal"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import LoadError from '../../components/LoadError/LoadError';
import { getErrorMessage } from '../../services/errorMessage';
import { CONTRACT_TYPES, JOB_MODELS, JOB_LEVELS, formatDate, formatSalaryRange } from "./jobLabels"
import defaultEnterprisePhoto from '../../assets/profile/FotoPadraoEnterprise.png';

const TARGET_GENDERS = ['MULHER', 'PESSOA_NAO_BINARIA'];

export default function ProfessionalJobsListing(){

    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [jobDetail, setJobDetail] = useState(null);
    const [detailError, setDetailError] = useState(null);
    // só a resposta do último clique vale: evita mostrar a vaga errada ao trocar rápido
    const latestRequest = useRef(0);

    // vaga que aguarda a confirmação do aviso de vaga afirmativa
    const [genderWarning, setGenderWarning] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [applied, setApplied] = useState(false);

    // ?vaga=id mantém a vaga aberta ao recarregar e permite compartilhar o link
    const requestedId = Number(searchParams.get('vaga')) || null;
    const requestedIsListed = jobs.some((job) => job.id === requestedId);
    const currentId = requestedIsListed ? requestedId : jobs[0]?.id;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setJobs(await publicJobPostings());
            } catch(err) {
                setError(getErrorMessage(err, 'Não foi possível carregar as vagas.'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, [])

    const loadDetail = useCallback(async (id) => {
        const request = ++latestRequest.current;
        setDetailError(null);
        try {
            const detail = await publicJobDetail(id);
            if (request === latestRequest.current) setJobDetail(detail);
        } catch(err) {
            if (request === latestRequest.current) setDetailError(getErrorMessage(err, 'Não foi possível abrir esta vaga.'));
        }
    }, []);

    useEffect(() => {
        if (currentId) loadDetail(currentId);
    }, [currentId, loadDetail]);

    const selectJob = (id) => setSearchParams({ vaga: id }, { replace: true });

    const handleApply = (job) => {
        if (TARGET_GENDERS.includes(getGender())) setApplyJob(job);
        else setGenderWarning(job);
    }

    const handleApplied = () => {
        setJobDetail((prev) => ({ ...prev, hasApplied: true }));
        setApplyJob(null);
        setApplied(true);
    }

    if (loading) return ( <LoadingSpinner /> );
    if (error) return <LoadError message={error} />;

    const detail = jobDetail?.id === currentId ? jobDetail : null;
    const detailPanel = <JobDetails job={detail} error={detailError} onRetry={() => loadDetail(currentId)} onApply={handleApply}/>;
    const genderUnknown = getGender() === null;

    return(
        <main className='flex flex-col bg-[var(--light)] pt-10 pb-6 px-4 sm:px-0'>
            <div className="flex flex-col w-full sm:w-5/6 p-4 sm:p-6 bg-white mx-auto rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                    <h1 className="text-xl md:text-3xl font-semibold text-[var(--purple-secundary)]">Confira vagas em destaque</h1>
                    <BtnCallToAction to="/profissional/vagas/candidaturas">MINHAS CANDIDATURAS</BtnCallToAction>
                </div>

                {requestedId && !requestedIsListed && jobs.length > 0 &&
                    <p role="status" className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
                        A vaga do link não está mais disponível. Confira as outras vagas abertas.
                    </p>
                }

                {jobs.length > 0
                    ?
                        <div className="bg-[var(--gray)] rounded-2xl flex border border-[var(--gray)] overflow-hidden md:h-[70vh] md:min-h-[28rem]">
                            <ul aria-label="Vagas disponíveis" className="w-full md:w-2/5 md:overflow-y-auto">
                                {jobs.map((job) =>
                                    <li key={job.id}>
                                        <JobItem job={job} isCurrent={currentId === job.id} onSelect={() => selectJob(job.id)}/>
                                        {currentId === job.id &&
                                            <div className="md:hidden bg-white">{detailPanel}</div>
                                        }
                                    </li>
                                )}
                            </ul>
                            <div className="hidden md:block w-3/5 overflow-y-auto bg-white">
                                {detailPanel}
                            </div>
                        </div>
                    :
                        <p className="mx-auto my-4 text-center">Não há vagas disponíveis no momento</p>
                }
            </div>

            <ConfirmModal open={!!genderWarning} title="Alerta de vaga afirmativa"
                message={genderUnknown
                    ? `Esta vaga tem foco em mulheres e, para garantir que você possa participar plenamente das vagas afirmativas,
                        recomendamos que habilite o compartilhamento do seu gênero nas configurações do perfil.
                        Isso ajuda as empresas a entenderem seu perfil e a promoverem a inclusão.`
                    : `Essa vaga tem foco em mulheres e identidades de gênero diversas,
                        como pessoas não-binárias. Seu perfil não se enquadra no público-alvo desta oportunidade.
                        Deseja prosseguir mesmo assim?`}
                confirmText="Continuar candidatura" cancelText={genderUnknown ? 'Voltar' : 'Não'}
                onConfirm={() => {
                    setApplyJob(genderWarning);
                    setGenderWarning(null);
                }}
                onCancel={() => setGenderWarning(null)}/>

            {applyJob &&
                <ApplyJob job={applyJob} onClose={() => setApplyJob(null)} onApplied={handleApplied}/>
            }

            <FeedbackModal open={applied} title="Candidatura enviada!"
                message="A empresa já pode ver seu currículo. Acompanhe o andamento em Minhas candidaturas."
                onClose={() => setApplied(false)}/>
        </main>
    )
}

function JobItem({job, isCurrent, onSelect}){
    return (
        <button type="button" onClick={onSelect} aria-current={isCurrent || undefined}
            className={`w-full text-left border-b border-slate-300 p-3 flex items-center gap-x-4 cursor-pointer transition
                hover:bg-slate-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--purple-primary)]
                ${isCurrent ? 'bg-slate-300' : ''}`}>
            <img src={job.companyProfilePic || defaultEnterprisePhoto} alt="" loading="lazy"
                className="w-12 h-12 shrink-0 object-cover rounded-full"/>
            <span className="flex flex-col min-w-0">
                <span className="font-bold break-words">{job.title}</span>
                <span className="break-words">{job.companyName}</span>
                <span className="text-sm break-words">{job.location}</span>
            </span>
        </button>
    )
}

function JobDetails({job, error, onRetry, onApply}){
    const titleId = useId();

    if (error) {
        return (
            <div role="alert" className="flex flex-col items-center gap-3 p-6 text-center">
                <p className="text-gray-600 break-words">{error}</p>
                <BtnCallToAction onClick={onRetry}>TENTAR NOVAMENTE</BtnCallToAction>
            </div>
        )
    }

    if (!job) return <p role="status" className="p-6 text-center text-gray-600">Carregando vaga...</p>;

    return(
        <article className="p-4 w-full" aria-labelledby={titleId}>
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <img src={job.companyProfilePic || defaultEnterprisePhoto} alt=""
                    className="w-16 h-16 shrink-0 object-cover rounded-full"/>
                <div className="min-w-0">
                    <h2 id={titleId} className="font-bold text-lg break-words">{job.title}</h2>
                    <p className="break-words">{job.companyName}</p>
                </div>
            </div>
            <div className="mt-4 sm:px-4">
                <h3 className="font-bold">Sobre a vaga:</h3>
                <p className="whitespace-pre-wrap break-words mb-3">{job.description}</p>

                <h3 className="font-bold">Requisitos:</h3>
                <p className="whitespace-pre-wrap break-words mb-3">{job.requirements}</p>

                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-sm">
                    <JobInfo label="Tipo de contrato">{CONTRACT_TYPES[job.contractType]}</JobInfo>
                    <JobInfo label="Nível" icon={Signal}>{JOB_LEVELS[job.jobLevel]}</JobInfo>
                    <JobInfo label="Salário" icon={Banknote}>{formatSalaryRange(job.salaryMin, job.salaryMax)}</JobInfo>
                    <JobInfo label="Modalidade" icon={House}>{JOB_MODELS[job.jobModel]}</JobInfo>
                    <JobInfo label="Localização" icon={MapPin}>{job.location}</JobInfo>
                    <JobInfo label="Data-limite" icon={CalendarDays}>{formatDate(job.applicationDeadline)}</JobInfo>
                </dl>
            </div>
            <div className="flex justify-center mt-7">
                {job.hasApplied
                    ? <BtnCallToAction disabled>JÁ CANDIDATADO</BtnCallToAction>
                    : <BtnCallToAction onClick={() => onApply(job)}>CANDIDATAR-SE</BtnCallToAction>
                }
            </div>
        </article>
    )
}

function JobInfo({label, icon: Icon, children}){
    return (
        <div>
            <dt className="font-bold">{label}:</dt>
            <dd className="flex items-center gap-1 break-words">
                {Icon && <Icon size={18} aria-hidden="true" className="shrink-0"/>}
                {children}
            </dd>
        </div>
    )
}
