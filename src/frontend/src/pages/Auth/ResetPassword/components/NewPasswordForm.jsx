import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newPassword } from '../../../../services/authService';
import LabelInput from '../../../../components/form/Label/LabelInput';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import { Undo2 } from 'lucide-react';
import { validateField } from '../../../../components/form/Label/validationField';
import { useQueryParams } from '../../../../services/useQueryParams';

export default function NewPasswordForm(){
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const [erroSenha, setErroSenha] = useState(false)
    const navigate = useNavigate();
    const query = useQueryParams()
    const [successModalOpen, setSuccessModalOpen] = useState(false);


    const handleNewPassword = async () => {
        if(!validateFields()){
            console.log("Tem erro")
            return
        }
        setLoading(true);
        try {
            const token = query.get('token')
            await newPassword(token, senha);
            setSuccessModalOpen(true)
        } catch (err) {
            setFeedback(err.response?.data?.message && 'Erro ao tentar redefinir senha: token inválido ou expirado');
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        const hasError = validateField('senha', senha, true) || validateField('senha', confirmaSenha, true)
        if(hasError || erroSenha)
            setErrorMsg('Preencha os campos obrigatórios e corrija os erros antes de continuar')
        else setErrorMsg('')
        return !(hasError || erroSenha)
    }

    const comparePasswords = (senha, senhaConfirmada) => {
        setErroSenha(senhaConfirmada && (senhaConfirmada !== senha));
    }
    return (
        <div className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between bg-(--purple-primary) mx-4 md:mx-0 p-9 md:rounded-r-[130px]">
            <button className='flex gap-x-3 cursor-pointer transition hover:-translate-x-1'
                onClick={() => navigate('/')}>
                <Undo2 />
                Voltar
            </button>

            <div className='text-center'>
            <p className='text-3xl sm:text-4xl md:text-5xl font-bold'>Defina sua nova senha</p>
            <p className='text-sm sm:text-base md:text-lg mt-4'>Digite uma nova senha segura para acessar sua conta.</p>

            <div className='text-left flex flex-col gap-y-3 mt-6 sm:mt-8 mb-5'>
                <LabelInput label="Senha:" 
                    theme='white' 
                    required={true} 
                    placeholder='Digite sua senha' 
                    maxLength='25' 
                    type='senha'
                    validation='senha'
                    value={senha} 
                    onChange={(e) => {
                        setSenha(e.target.value)
                        if(confirmaSenha) 
                            comparePasswords(e.target.value, confirmaSenha)
                }}/>
                <LabelInput label="Confirmar Senha:" 
                    theme='white' 
                    required={true} 
                    maxLength='25' 
                    placeholder='Confirme sua senha' 
                    type='senha'
                    value={confirmaSenha} 
                    onChange={(e) => {
                        setConfirmaSenha(e.target.value)
                        comparePasswords(senha, e.target.value)
                }}/>
                {erroSenha && <p className="text-sm text-theme-white">As senhas não coincidem.</p>}
            </div>

            {feedback && <p className='text-sm mt-4'>{feedback}</p>}
            </div>

            <div className='flex flex-col'>
            <div className='flex justify-center'>
            <BtnCallToAction variant="white" onClick={handleNewPassword} disabled={loading}>
                {loading ? 'Enviando...' : 'ENVIAR'}
            </BtnCallToAction>
            </div>
            {errorMsg && <p className='text-sm mt-4 mx-auto'>{errorMsg}</p>}
            </div>

            {successModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-(--purple-primary)">Senha alterada com sucesso!</h2>
                <p className="mb-6 text-gray-700">Prossiga para a tela de login para continuar</p>
                <button 
                    onClick={() => navigate('/login')} 
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
                    Continuar
                </button>
                </div>
            </div>
            )}
    </div>
  );
}