import { X } from 'lucide-react'
import { useState } from 'react';
import LabelInput from '../../../components/form/Label/LabelInput';
import { postApplication } from '../../../services/applicationService'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import { useNavigate } from 'react-router-dom';

export default function ApplyJob({applyJobModal, setApplyJobModal}){
    const navigate = useNavigate()
    const [applyFormData, setApplyFormData] = useState({
        jobPostingId: applyJobModal.id,
        githubLink: '',
        portfolioLink: '',
        resumeFile: ''
    })
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (field, value) => {
        setApplyFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = () => {
        if(applyFormData.resumeFile === ''){
            setErrorMessage('Anexe um currículo antes de continuar')
            setTimeout(() => setErrorMessage(null), 4000)
        }else{
            setErrorMessage('')
            try{
                postApplication(applyFormData)
                navigate("/candidaturas")
            }catch(err){
                setErrorMessage(err.response?.data?.message || `Erro ao se candidatar à vaga de emprego`)
                setTimeout(() => setErrorMessage(null), 4000)
            }
        }
    }

    return(
        <main className='flex flex-col'>
            <X className='cursor-pointer ml-auto' onClick={() => setApplyJobModal(false)}/>
            <p className="mx-auto text-xl font-medium px-2">Candidatar-se à vaga:</p>
            <p className="mx-auto text-xl font-bold mb-4 px-2">{applyJobModal.title}</p>

             <div className="flex flex-col gap-y-3 max-h-[65vh] pb-2 overflow-y-auto">
                <label className="block text-base text-left">Currículo: *</label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.odt"
                    onChange={(e) => handleChange('resumeFile', e.target.files[0])}
                    className="w-full rounded-lg text-sm font-normal bg-[#F7F7F7] 
                        border border-transparent shadow-md text-[#55618C]/60
                        focus:outline-none focus:ring-2 focus:ring-[#55618C]
                        file:mr-4 file:py-3 file:px-4 
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-(--purple-primary) file:text-white
                        hover:file:bg-(--purple-action)"
                />
                <LabelInput label="Link do GitHub:" placeholder="Insira o link do seu portifólio no GitHub"
                maxLength="100" value={applyFormData.title} onChange={(e) => handleChange('title', e.target.value)}/>
                <LabelInput label="Link do portifólio:" placeholder="Insira o link do seu portifólio pessoal"
                maxLength="2000" value={applyFormData.description} onChange={(e) => handleChange('description', e.target.value)}/>
            </div>
            <div className='mt-5'>
                <BtnCallToAction onClick={() => handleSubmit()}>ENVIAR</BtnCallToAction>
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