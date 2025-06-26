import { Undo2 } from 'lucide-react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../components/form/Label/LabelInput';
import { use, useState } from 'react';
import { validateField } from '../../../components/form/Label/validationField';

export default function RegisterStep1({formData, setFormData, handleChange, validateFields, prevStep, errorMessage}){
    const [erroSenha, setErroSenha] = useState('')

    const comparePasswords = (senha, senhaConfirmada) => {
        setErroSenha(senhaConfirmada && (senhaConfirmada !== senha));
    }

    return(
        <div className="text-white w-1/2 h-screen flex flex-col justify-between bg-(--purple-action) p-12 pl-25 rounded-l-[130px]">
            <div className='flex justify-around'>
                <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' onClick={prevStep}>
                    <Undo2/>
                    Voltar
                </button>
                <button className='text-lg text-md w-fit ml-auto transition duration-300 hover:-translate-y-0.75'>Já tenho uma conta!</button>
            </div>
            <div>
                <p className='text-center text-4xl mb-2'>Pronto para começar?</p>
                <p className='text-center text-lg'>Crie sua senha e finalize o cadastro na plataforma.</p>
                <div className='flex flex-col gap-y-2'>
                    <LabelInput label="Email:" theme='white' required={true} maxLength='100' placeholder='Digite seu email' type='email' validation='email'
                    value={formData.email} onChange={(e) => handleChange('email', e.target.value)}/>
                    <LabelInput label="Senha:" theme='white' required={true} placeholder='Digite sua senha' maxLength='25' type='senha'
                    value={formData.senha} onChange={(e) => {
                        handleChange('senha', e.target.value)
                        if(formData.senha_confirmada) comparePasswords(e.target.value, formData.senha_confirmada)
                    }}/>
                    <LabelInput label="Confirmar Senha:" theme='white' required={true} maxLength='25' placeholder='Confirme sua senha' type='senha'
                    value={formData.senha_confirmada} onChange={(e) => {
                        handleChange('senha_confirmada', e.target.value)
                        comparePasswords(formData.senha, e.target.value)
                    }}/>
                    {erroSenha && <p className="text-sm text-theme-white">As senhas não coincidem.</p>}
                </div>
            </div>
            <div>
                <p className='text-center mb-3'>Preencha <strong>todas</strong> as fases para concluir seu cadastro. *</p>
                <div className='flex justify-center'><BtnCallToAction variant="white" onClick={validateFields}>CADASTRAR-SE</BtnCallToAction></div>
                {errorMessage && <p className='text-center mt-2'>{errorMessage}</p>}
            </div>
        </div>
    )
}