import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { House, MapPin, CalendarDays } from 'lucide-react'

import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction"
import ManageJob from "./components/ManageJob"
import JobStatusBadge from "./components/JobStatusBadge"
import { companyJobPostings, companyJobPostingDetail, deactivateJobPosting } from "../../services/jobsService"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import LoadError from '../../components/LoadError/LoadError';
import { getErrorMessage } from '../../services/errorMessage';
import { CONTRACT_TYPES, JOB_MODELS, formatDate, moneyToField } from "./jobLabels"
import defaultEnterprisePhoto from '../../assets/profile/FotoPadraoEnterprise.png';

const outlineButton = "border border-(--purple-primary) text-(--purple-primary) cursor-pointer rounded-2xl py-2 px-6 " +
    "transition duration-300 hover:bg-(--purple-primary) hover:text-white disabled:opacity-60 disabled:cursor-wait " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--purple-primary)";

export default function CompanyJobsListing(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // aviso único da página (sucesso ou erro), em vez de um por card
    const [notice, setNotice] = useState(null);

    // null = fechado; { action: 'new' } ou { action: 'edit', data }
    const [manageJob, setManageJob] = useState(null);
    const [openingEditId, setOpeningEditId] = useState(null);
    const [jobToDeactivate, setJobToDeactivate] = useState(null);
    const [deactivating, setDeactivating] = useState(false);

    const fetchMyJobs = async () => {
        try {
            setJobs(await companyJobPostings());
        } catch(err) {
            setError(getErrorMessage(err, 'Não foi possível carregar suas vagas.'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyJobs();
    }, [])

    const handleEdit = async (id) => {
        setOpeningEditId(id);
        setNotice(null);
        try {
            const jobDetail = await companyJobPostingDetail(id);
            setManageJob({
                action: 'edit',
                data: {
                    ...jobDetail,
                    salaryMin: moneyToField(jobDetail.salaryMin),
                    salaryMax: moneyToField(jobDetail.salaryMax)
                }
            });
        } catch(err) {
            setNotice({ type: 'error', text: getErrorMessage(err, 'Não foi possível abrir a vaga para edição.') });
        } finally {
            setOpeningEditId(null);
        }
    }

    const handleSaved = () => {
        setNotice({ type: 'success', text: manageJob.action === 'new' ? 'Vaga publicada com sucesso.' : 'Alterações da vaga salvas.' });
        setManageJob(null);
        fetchMyJobs();
    }

    const handleDeactivate = async () => {
        setDeactivating(true);
        try {
            await deactivateJobPosting(jobToDeactivate.id);
            setJobs(prev => prev.map(j => j.id === jobToDeactivate.id ? { ...j, isActive: false } : j));
            setNotice({ type: 'success', text: `A vaga "${jobToDeactivate.title}" foi desativada.` });
        } catch (err) {
            setNotice({ type: 'error', text: getErrorMessage(err, 'A vaga não foi desativada.') });
        } finally {
            setDeactivating(false);
            setJobToDeactivate(null);
        }
    };

    if (loading) return ( <LoadingSpinner /> );
    if (error) return <LoadError message={error} />;

    return(
        <main className='flex flex-col bg-[var(--light)] pt-10 pb-6 px-4 sm:px-0 min-h-full'>
            <div className="flex flex-col mb-6 w-full sm:w-5/6 p-4 sm:p-6 bg-white mx-auto rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-xl md:text-3xl font-semibold text-[var(--purple-secundary)]">Minhas vagas publicadas</h1>
                    <BtnCallToAction onClick={() => { setNotice(null); setManageJob({ action: 'new' }); }}>
                        NOVA VAGA
                    </BtnCallToAction>
                </div>

                {notice &&
                    <p role={notice.type === 'error' ? 'alert' : 'status'}
                        className={`mt-4 rounded-lg border text-sm px-4 py-3 break-words ${notice.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-green-50 border-green-200 text-green-800'}`}>
                        {notice.text}
                    </p>
                }

                <section aria-label="Vagas publicadas" className="flex flex-col my-3 gap-y-3">
                    {jobs.length > 0
                        ?
                            jobs.map((job) => <CompanyJobDetails key={job.id} job={job} opening={openingEditId === job.id}
                                onEdit={() => handleEdit(job.id)} onDeactivate={() => setJobToDeactivate(job)}/>)
                        :
                            <p className="mx-auto mt-4 text-center">Sua empresa ainda não publicou nenhuma vaga de emprego</p>
                    }
                </section>
            </div>

            {manageJob &&
                <ManageJob action={manageJob.action} initialData={manageJob.data}
                    onClose={() => setManageJob(null)} onSaved={handleSaved}/>
            }

            <ConfirmModal open={!!jobToDeactivate} title="Desativar vaga"
                message={`Tem certeza que deseja desativar a vaga "${jobToDeactivate?.title ?? ''}"? Ela deixa de aparecer para as profissionais e não poderá ser editada.`}
                confirmText={deactivating ? 'Desativando...' : 'Sim'} cancelText="Não" loading={deactivating}
                onConfirm={handleDeactivate}
                onCancel={() => { if (!deactivating) setJobToDeactivate(null); }}
            />
        </main>
    )
}

function CompanyJobDetails({job, opening, onEdit, onDeactivate}){
    return(
        <article aria-label={job.title}
            className={`flex flex-col sm:flex-row gap-4 border rounded-xl border-(--gray) p-4 ${!job.isActive ? 'bg-slate-50' : ''}`}>
            <img src={job.companyProfilePic || defaultEnterprisePhoto} alt="" loading="lazy"
                className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-cover rounded-xl ${!job.isActive ? 'grayscale opacity-60' : ''}`}/>
            <div className="flex flex-col lg:flex-row gap-4 w-full min-w-0 text-sm">
                <div className={`flex-1 min-w-0 ${!job.isActive ? 'text-gray-600' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-bold text-base break-words">{job.title}</h2>
                        <JobStatusBadge isActive={job.isActive} isExpired={job.isExpired}/>
                    </div>

                    <h3 className="font-bold mt-2">Sobre a vaga:</h3>
                    <p className="whitespace-pre-wrap break-words">{job.description}</p>

                    <h3 className="font-bold mt-2">Requisitos:</h3>
                    <p className="whitespace-pre-wrap break-words">{job.requirements}</p>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
                        <div>
                            <dt className="font-bold">Tipo de contrato:</dt>
                            <dd>{CONTRACT_TYPES[job.contractType]}</dd>
                        </div>
                        <div>
                            <dt className="font-bold">Modalidade:</dt>
                            <dd className="flex items-center gap-1"><House size={18} aria-hidden="true"/>{JOB_MODELS[job.jobModel]}</dd>
                        </div>
                        <div>
                            <dt className="font-bold">Localização:</dt>
                            <dd className="flex items-center gap-1 break-words"><MapPin size={18} aria-hidden="true" className="shrink-0"/>{job.location}</dd>
                        </div>
                        <div>
                            <dt className="font-bold">Data-limite:</dt>
                            <dd className="flex items-center gap-1"><CalendarDays size={18} aria-hidden="true"/>{formatDate(job.applicationDeadline)}</dd>
                        </div>
                    </dl>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-center lg:w-48 shrink-0">
                    {job.isActive &&
                        <button type="button" className={outlineButton} onClick={onEdit} disabled={opening} aria-busy={opening || undefined}>
                            {opening ? 'Abrindo...' : 'Editar'}
                        </button>
                    }

                    <Link to={`/empresa/vagas/${job.id}`} className={`${outlineButton} text-center`}
                        aria-label={`Ver candidaturas da vaga ${job.title}`}>
                        Ver candidaturas
                    </Link>

                    {job.isActive &&
                        <button type="button" onClick={onDeactivate}
                            className="bg-(--purple-action) text-white cursor-pointer rounded-2xl py-2 px-6 transition duration-300
                                hover:bg-(--purple-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--purple-primary)">
                            Desativar
                        </button>
                    }
                </div>
            </div>
        </article>
    )
}
