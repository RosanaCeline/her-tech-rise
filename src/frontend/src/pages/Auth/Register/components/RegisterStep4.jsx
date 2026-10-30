import LabelInput from '../../../../components/form/Label/LabelInput';
import { useState } from 'react';

export default function RegisterStep4({formData, handleChange }){
    const [erroSenha, setErroSenha] = useState(false)

    const comparePasswords = (senha, senhaConfirmada) => {
        setErroSenha(senhaConfirmada && (senhaConfirmada !== senha));
    }

    return(
        <section>
                <h1 className='text-center text-3xl sm:text-4xl mb-2'>
                    Pronto para começar?
                </h1>
                <p className='text-center text-base sm:text-lg'>
                    Crie sua senha e finalize o cadastro na plataforma.
                </p>
                <div className='flex flex-col gap-y-3 mt-4'>
                    <LabelInput label="Email:" 
                                name='email'
                                autoComplete='email'
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
                                name='senha'
                                autoComplete='new-password'
                                theme='white' 
                                required={true} 
                                placeholder='Digite sua senha' 
                                maxLength='25' 
                                type='senha'
                                validation='senha'
                                value={formData.senha} 
                                onChange={(e) => {
                                    handleChange('senha', e.target.value)
                                    if(formData.senha_confirmada) 
                                        comparePasswords(e.target.value, formData.senha_confirmada)
                    }}/>
                    <LabelInput label="Confirmar Senha:" 
                                name='senha_confirmada'
                                autoComplete='new-password'
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
                    <div role="alert">
                        {erroSenha && <p className="text-sm text-error">As senhas não coincidem.</p>}
                    </div>
                    <div className='mt-4'>
                        {formData.tipo_usuario === 'profissional' &&
                        <LabelInput type="checkbox" theme='white' value={formData.consentGenderSharing} 
                            onChange={(e) => handleChange('consentGenderSharing', e.target.checked)}
                            label="Autorizo que meu gênero seja compartilhado com empresas nas candidaturas a vagas, 
                            para apoiar ações afirmativas e promover diversidade. "/>}
                    </div>
                </div>
        </section>
    )
}