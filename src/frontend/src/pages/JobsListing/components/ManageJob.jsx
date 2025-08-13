import LabelInput from "../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../components/btn/BtnCallToAction/BtnCallToAction";
import { maskField } from "../../../components/form/Label/maskField";
import {X} from 'lucide-react'
import { useState } from "react";
import { postJob, editPostJob } from '../../../services/jobsService'
import { validateField } from "../../../components/form/Label/validationField";
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'

export default function ManageJob({jobFormData, setJobFormData, setManageJobModal, fetchMyJobs, action = 'new'}){
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const handleChange = (field, value) => {
        setJobFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async () => {
        try{
            setLoading(true)
            const payload = {
                ...jobFormData,
                salaryMin: jobFormData.salaryMin.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.'),
                salaryMax: jobFormData.salaryMax.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.'),
            }
            action === 'new' ? await postJob(payload) : await editPostJob(payload)
            setManageJobModal(false)
            fetchMyJobs()
        }catch(err){
            setErrorMessage(err.response?.data?.message || `Erro ao ${action === 'new' ? 'cadastrar nova' : 'editar'} vaga de emprego`)
            setTimeout(() => setErrorMessage(null), 4000)
        }finally{
            setLoading(false)
        }
    }

    const validateFields = () => {
        const fields = ['title', 'description', 'requirements', 'location', 'jobModel', 'salaryMin',
            'salaryMax', 'contractType', 'jobLevel', 'applicationDeadline'
        ]
        const hasError = fields.some(field => validateField(field, jobFormData[field], true))
        if(hasError) {
            setErrorMessage('Preencha os campos obrigatórios e corrija os erros antes de continuar')
            setTimeout(() => setErrorMessage(null), 4000)
        }else {
            setErrorMessage('')
            handleSubmit(); 
        }
    }

    if (loading) return ( <LoadingSpinner /> )

    return(
        <main className='flex flex-col'>
            <X className='cursor-pointer ml-auto' onClick={() => setManageJobModal('')}/>
            <p className="mx-auto text-xl font-medium mb-4 px-2">{action === 'new' ? 'Cadastre uma nova' : 'Editar'} vaga de emprego</p>
            <div className="flex flex-col gap-y-3 max-h-[65vh] pb-2 overflow-y-auto">
                <LabelInput label="Titulo da vaga" placeholder="Digite o título da vaga" required={true}
                maxLength="100" value={jobFormData.title} onChange={(e) => handleChange('title', e.target.value)}/>
                <LabelInput label="Descrição" placeholder="Digite a descrição da vaga" required={true} type="mensagem"
                maxLength="2000" value={jobFormData.description} onChange={(e) => handleChange('description', e.target.value)}/>
                <LabelInput label="Requisitos" placeholder="Digite os requisitos da vaga" required={true} type="mensagem"
                maxLength="1000" value={jobFormData.requirements} onChange={(e) => handleChange('requirements', e.target.value)}/>
                <LabelInput label="Localização" placeholder="Digite a localização da vaga" required={true}
                maxLength="100" value={jobFormData.location} onChange={(e) => handleChange('location', e.target.value)}/>
                <LabelInput label="Modelo de trabalho:" required={true} type='select' 
                options={[{value: 'REMOTO', label: 'Remoto'}, {value: 'HIBRIDO', label: 'Híbrido'}, {value: 'PRESENCIAL', label: 'Presencial'}]}
                value={jobFormData.jobModel} onChange={(e) => handleChange('jobModel', e.target.value)}/>
                <div className='flex columns-2 gap-x-5'>
                    <LabelInput label="Faixa salarial mínima" placeholder="Digite a faixa salarial mínima" required={true}
                    maxLength="100" value={jobFormData.salaryMin} onChange={(e) => handleChange('salaryMin', maskField('money', e.target.value))}/>
                    <LabelInput label="Faixa salarial máxima" placeholder="Digite a faixa salarial máxima" required={true}
                    maxLength="100" value={jobFormData.salaryMax} onChange={(e) => handleChange('salaryMax', maskField('money', e.target.value))}/>
                </div>
                <LabelInput label="Tipo de contrato:" required={true} type='select' 
                options={[
                    {value: 'CLT',        label: 'CLT'}, 
                    {value: 'PJ',         label: 'PJ'},
                    {value: 'APRENDIZ',   label: 'Aprendiz'},
                    {value: 'ESTAGIO',    label: 'Estágio'},
                    {value: 'TRAINEE',    label: 'Trainee'},
                    {value: 'TEMPORARIO', label: 'Temporário'},
                    {value: 'FREELANCER', label: 'Freelancer'},
                    {value: 'VOLUNTARIO', label: 'Voluntário'}]}
                value={jobFormData.contractType} onChange={(e) => handleChange('contractType', e.target.value)}/>
                <LabelInput label="Nivel:" required={true} type='select' 
                options={[{value: 'JUNIOR', label: 'Junior'}, {value: 'PLENO', label: 'Pleno'}, {value: 'SENIOR', label: 'Sênior'}]}
                value={jobFormData.jobLevel} onChange={(e) => handleChange('jobLevel', e.target.value)}/>
                <LabelInput label="Data-limite de candidatura" placeholder="Digite a data-limite de candidatura" required={true} type='date'
                maxLength="10" value={jobFormData.applicationDeadline} onChange={(e) => handleChange('applicationDeadline', e.target.value)}/>
            </div>
            <div>
                <BtnCallToAction onClick={() => validateFields()}>SALVAR</BtnCallToAction>
            </div>
            {errorMessage && (
            <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                           transition-opacity duration-300">
                {errorMessage}
            </div>
            )}
        </main>
    )
}