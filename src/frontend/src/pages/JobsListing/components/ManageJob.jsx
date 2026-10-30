import { useId, useState } from "react";

import { X } from 'lucide-react'

import PopUp from "../../../components/PopUp";
import LabelInput from "../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../components/btn/BtnCallToAction/BtnCallToAction";
import { maskField } from "../../../components/form/Label/maskField";
import { postJob, editPostJob } from '../../../services/jobsService'
import { validateForm, focusFirstError, errorSummary } from "../../../components/form/validateForm";
import { getErrorMessage } from '../../../services/errorMessage';
import { CONTRACT_TYPES, JOB_MODELS, JOB_LEVELS, toOptions, todayISO } from "../jobLabels";

const EMPTY_JOB = {
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
};

const RULES = {
    title: { type: '', label: 'Título' },
    description: { type: '', label: 'Descrição' },
    requirements: { type: '', label: 'Requisitos' },
    location: { type: '', label: 'Localização' },
    jobModel: { type: '', label: 'Modelo de trabalho' },
    salaryMin: { type: '', label: 'Salário mínimo', required: false },
    salaryMax: { type: '', label: 'Salário máximo', required: false },
    contractType: { type: '', label: 'Tipo de contrato' },
    jobLevel: { type: '', label: 'Nível' },
    applicationDeadline: { type: '', label: 'Data-limite' },
};

// salário é opcional: apagar todos os dígitos limpa o campo em vez de mostrar "R$ 0,00"
const maskMoney = (value) => (Number(value.replace(/\D/g, '')) ? maskField('money', value) : '');
const parseMoney = (value) => (value ? Number(value.replace(/\D/g, '')) / 100 : null);

export default function ManageJob({initialData = EMPTY_JOB, action = 'new', onClose, onSaved}){

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [saving, setSaving] = useState(false);
    const titleId = useId();
    const today = todayISO();

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }

    const validate = () => {
        const found = validateForm(RULES, formData);
        const min = parseMoney(formData.salaryMin);
        const max = parseMoney(formData.salaryMax);
        if (min && max && min > max) found.salaryMax = 'O salário máximo deve ser maior ou igual ao mínimo.';
        if (formData.applicationDeadline && formData.applicationDeadline < today) {
            found.applicationDeadline = 'Escolha hoje ou uma data futura.';
        }
        return found;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) {
            focusFirstError(found, Object.keys(RULES));
            return;
        }

        setSubmitError('');
        setSaving(true);
        try {
            const payload = {
                ...formData,
                salaryMin: parseMoney(formData.salaryMin),
                salaryMax: parseMoney(formData.salaryMax),
            }
            action === 'new' ? await postJob(payload) : await editPostJob(payload);
            onSaved();
        } catch(err) {
            setSubmitError(getErrorMessage(err, action === 'new' ? 'A vaga não foi publicada.' : 'As alterações da vaga não foram salvas.'));
            setSaving(false);
        }
    }

    // durante o envio a janela não fecha, para a pessoa não perder o retorno
    const close = () => { if (!saving) onClose(); };

    const fieldProps = (name) => ({
        name,
        theme: 'black',
        errorTheme: 'dark',
        value: formData[name] ?? '',
        error: errors[name],
        onChange: (e) => handleChange(name, e.target.value),
    });

    const summary = errorSummary(errors, RULES);
    const heading = action === 'new' ? 'Cadastre uma nova vaga de emprego' : 'Editar vaga de emprego';

    return(
        <PopUp onClose={close} ariaLabel={heading}>
            <form noValidate onSubmit={handleSubmit} className='flex flex-col' aria-labelledby={titleId}>
                <button type="button" onClick={close} disabled={saving} aria-label="Fechar"
                    className='ml-auto p-1 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--purple-primary)]'>
                    <X aria-hidden="true"/>
                </button>
                <h2 id={titleId} className="mx-auto text-xl font-medium mb-4 px-2">{heading}</h2>
                <div className="flex flex-col gap-y-3 px-1 pb-2">
                    <LabelInput {...fieldProps('title')} label="Título da vaga" placeholder="Digite o título da vaga" required maxLength="100"/>
                    <LabelInput {...fieldProps('description')} label="Descrição" placeholder="Digite a descrição da vaga" required type="mensagem" maxLength="2000"/>
                    <LabelInput {...fieldProps('requirements')} label="Requisitos" placeholder="Digite os requisitos da vaga" required type="mensagem" maxLength="1000"/>
                    <LabelInput {...fieldProps('location')} label="Localização" placeholder="Ex.: Fortaleza - CE" required maxLength="100"/>
                    <LabelInput {...fieldProps('jobModel')} label="Modelo de trabalho:" required type='select' options={toOptions(JOB_MODELS)}/>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-5'>
                        <LabelInput {...fieldProps('salaryMin')} label="Salário mínimo" placeholder="R$ 0,00" inputMode="numeric"
                            hint="Opcional" maxLength="20" onChange={(e) => handleChange('salaryMin', maskMoney(e.target.value))}/>
                        <LabelInput {...fieldProps('salaryMax')} label="Salário máximo" placeholder="R$ 0,00" inputMode="numeric"
                            hint="Opcional" maxLength="20" onChange={(e) => handleChange('salaryMax', maskMoney(e.target.value))}/>
                    </div>
                    <LabelInput {...fieldProps('contractType')} label="Tipo de contrato:" required type='select' options={toOptions(CONTRACT_TYPES)}/>
                    <LabelInput {...fieldProps('jobLevel')} label="Nível:" required type='select' options={toOptions(JOB_LEVELS)}/>
                    <LabelInput {...fieldProps('applicationDeadline')} label="Data-limite de candidatura" required type='date' min={today}/>
                </div>

                {summary || submitError ? (
                    <p role="alert" className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 break-words text-left">
                        {submitError || summary}
                    </p>
                ) : null}

                <div className="mt-5">
                    <BtnCallToAction type="submit" disabled={saving} aria-busy={saving || undefined}>
                        {saving ? 'SALVANDO...' : 'SALVAR'}
                    </BtnCallToAction>
                </div>
            </form>
        </PopUp>
    )
}
