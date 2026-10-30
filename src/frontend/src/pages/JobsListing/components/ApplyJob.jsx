import { useId, useState } from 'react';

import { X } from 'lucide-react'

import PopUp from '../../../components/PopUp';
import LabelInput from '../../../components/form/Label/LabelInput';
import { postApplication } from '../../../services/applicationService'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import { getErrorMessage } from '../../../services/errorMessage';
import { normalizeUrl } from '../../../components/form/Label/validationField';
import { validateForm, focusFirstError, errorSummary } from '../../../components/form/validateForm';

// mesmas regras do back-end (CloudinaryService.uploadResumeFile)
const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'];
const RESUME_MAX_BYTES = 10 * 1024 * 1024;

const RULES = {
    githubLink: { type: 'url', label: 'Link do GitHub', required: false },
    portfolioLink: { type: 'url', label: 'Link do portfólio', required: false },
};

function validateResume(file) {
    if (!file) return 'Anexe seu currículo.';
    const extension = file.name.split('.').pop().toLowerCase();
    if (!RESUME_EXTENSIONS.includes(extension)) return 'Envie o currículo em PDF, DOC ou DOCX.';
    if (file.size > RESUME_MAX_BYTES) return 'O currículo deve ter até 10MB.';
    return null;
}

export default function ApplyJob({job, onClose, onApplied}){

    const [formData, setFormData] = useState({ githubLink: '', portfolioLink: '', resumeFile: null });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [sending, setSending] = useState(false);
    const titleId = useId();

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;

        const found = validateForm(RULES, formData);
        const resumeError = validateResume(formData.resumeFile);
        if (resumeError) found.resumeFile = resumeError;
        setErrors(found);
        if (Object.keys(found).length > 0) {
            focusFirstError(found, ['resumeFile', ...Object.keys(RULES)]);
            return;
        }

        setSubmitError('');
        setSending(true);
        try {
            await postApplication({
                jobPostingId: job.id,
                githubLink: normalizeUrl(formData.githubLink),
                portfolioLink: normalizeUrl(formData.portfolioLink),
                resumeFile: formData.resumeFile,
            });
            onApplied();
        } catch(err) {
            setSubmitError(getErrorMessage(err, 'Sua candidatura não foi enviada.'));
        } finally {
            setSending(false);
        }
    }

    // durante o envio a janela não fecha, para a pessoa não perder o retorno
    const close = () => { if (!sending) onClose(); };
    const summary = errorSummary(errors, { ...RULES, resumeFile: { label: 'Currículo' } });

    return(
        <PopUp onClose={close} ariaLabel={`Candidatar-se à vaga ${job.title}`}>
            <form noValidate onSubmit={handleSubmit} className='flex flex-col' aria-labelledby={titleId}>
                <button type="button" onClick={close} disabled={sending} aria-label="Fechar"
                    className='ml-auto p-1 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--purple-primary)]'>
                    <X aria-hidden="true"/>
                </button>
                <h2 id={titleId} className="mx-auto mb-4 px-2 text-xl">
                    <span className="block font-medium">Candidatar-se à vaga:</span>
                    <span className="block font-bold break-words">{job.title}</span>
                </h2>

                <div className="flex flex-col gap-y-3 pb-2 text-left">
                    <div>
                        <label htmlFor="resumeFile" className="block mb-1 text-base">Currículo: *</label>
                        <input
                            id="resumeFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            aria-required="true"
                            aria-invalid={errors.resumeFile ? true : undefined}
                            aria-describedby={errors.resumeFile ? 'resumeFile-erro' : 'resumeFile-dica'}
                            onChange={(e) => handleChange('resumeFile', e.target.files[0] ?? null)}
                            className="w-full rounded-lg text-sm font-normal bg-[#F7F7F7]
                                border border-transparent shadow-md text-[#55618C]
                                focus:outline-none focus:ring-2 focus:ring-[#55618C]
                                file:mr-4 file:py-3 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-(--purple-primary) file:text-white
                                hover:file:bg-(--purple-action)"
                        />
                        {errors.resumeFile
                            ? <p id="resumeFile-erro" className="mt-2 text-sm text-error-dark">{errors.resumeFile}</p>
                            : <p id="resumeFile-dica" className="mt-2 text-sm text-gray-600">PDF, DOC ou DOCX, com até 10MB.</p>
                        }
                    </div>
                    <LabelInput name="githubLink" label="Link do GitHub:" placeholder="github.com/seu-usuario" validation="url" errorTheme="dark"
                            autoComplete="url" maxLength="1000" value={formData.githubLink} error={errors.githubLink}
                            onChange={(e) => handleChange('githubLink', e.target.value)}/>
                    <LabelInput name="portfolioLink" label="Link do portfólio:" placeholder="seu-portfolio.com" validation="url" errorTheme="dark"
                            autoComplete="url" maxLength="1000" value={formData.portfolioLink} error={errors.portfolioLink}
                            onChange={(e) => handleChange('portfolioLink', e.target.value)}/>
                </div>

                {summary || submitError ? (
                    <p role="alert" className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 break-words">
                        {submitError || summary}
                    </p>
                ) : null}

                <div className='mt-5'>
                    <BtnCallToAction type="submit" disabled={sending} aria-busy={sending || undefined}>
                        {sending ? 'ENVIANDO...' : 'ENVIAR'}
                    </BtnCallToAction>
                </div>
            </form>
        </PopUp>
    )
}
