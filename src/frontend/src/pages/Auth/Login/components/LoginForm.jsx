import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../../context/AuthContext';

import { Undo2 } from 'lucide-react';

import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../../components/form/Label/LabelInput';

export default function LoginForm( { resetPass, registerPath, enter }){
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        setErrorMsg('');
        setLoading(true);
        try {
            await login(email, senha);
            navigate(enter); 
        } catch (err) {
            setErrorMsg(err.message);
            setTimeout(() => setErrorMsg(null), 4000);
        } finally {
            setLoading(false);
        }
    };
    
    return(
    <div className="text-white w-full md:w-1/2 h-screen flex flex-col justify-between bg-(--purple-primary) mx-6 md:mx-0 p-9 md:rounded-r-[130px]">

        <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' 
                onClick={() => navigate('/')}>
            <Undo2/>
            Voltar
        </button>

        <div className='flex flex-col text-center'>
            <p className='text-5xl font-bold'>
                Faça seu login!
            </p>
            <p className='text-lg mt-4'>
                Bem-vinda de volta. Sua jornada continua aqui.
            </p>

            <div className='flex flex-col gap-y-3 mt-10 mb-5'>
                <LabelInput 
                    label="E-mail" 
                    theme='white' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <LabelInput 
                    label="Senha" 
                    type="senha"
                    theme='white' 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
            </div>

            {errorMsg && <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                  transition-opacity duration-300">
                {errorMsg}
            </div>}

            <div className='flex flex-col gap-y-1 justify-end'>
                <button className='w-fit ml-auto transition duration-300 hover:-translate-y-0.75'
                    onClick={() => navigate(resetPass)}>
                    Esqueci a senha
                </button>
                <button className='w-fit ml-auto transition duration-300 hover:-translate-y-0.75'
                    onClick={() => navigate(registerPath)}>
                    Não tenho conta ainda
                </button>
            </div>
        </div>

        <div className='flex justify-center'>
            <BtnCallToAction variant="white"
                onClick={handleLogin} 
                disabled={loading}>
                {loading ? 'Carregando...' : 'ENTRAR'}
            </BtnCallToAction>
        </div>

    </div>
    )
}