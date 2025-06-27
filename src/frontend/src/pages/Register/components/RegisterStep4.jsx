import LabelInput from '../../../components/form/Label/LabelInput';
import { useState } from 'react';

export default function RegisterStep1({formData, handleChange }){
    const [erroSenha, setErroSenha] = useState(false)

    const comparePasswords = (senha, senhaConfirmada) => {
        setErroSenha(senhaConfirmada && (senhaConfirmada !== senha));
    }

    return(
        <section>
                <p className='text-center text-4xl mb-2'>
                    Pronto para começar?
                </p>
                <p className='text-center text-lg'>
                    Crie sua senha e finalize o cadastro na plataforma.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <LabelInput label="Email:" 
                                theme='white' 
                                required={true} 
                                maxLength='100' 
                                placeholder='Digite seu email' 
                                type='email' 
                                validation='email'
                                value={formData.email} 
                                onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <LabelInput label="Senha:" 
                                theme='white' 
                                required={true} 
                                placeholder='Digite sua senha' 
                                maxLength='25' 
                                type='senha'
                                value={formData.senha} 
                                onChange={(e) => {
                                    handleChange('senha', e.target.value)
                                    if(formData.senha_confirmada) 
                                        comparePasswords(e.target.value, formData.senha_confirmada)
                    }}/>
                    <LabelInput label="Confirmar Senha:" 
                                theme='white' 
                                required={true} 
                                maxLength='25' 
                                placeholder='Confirme sua senha' 
                                type='senha'
                                value={formData.senha_confirmada} 
                                onChange={(e) => {
                                    handleChange('senha_confirmada', e.target.value)
                                    comparePasswords(formData.senha, e.target.value)
                    }}/>
                    {erroSenha && <p className="text-sm text-theme-white">As senhas não coincidem.</p>}
                </div>
        </section>
    )
}