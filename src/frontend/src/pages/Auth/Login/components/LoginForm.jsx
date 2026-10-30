import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { Undo2 } from 'lucide-react';

import { useAuth } from '../../../../context/AuthContext';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../../components/form/Label/LabelInput';
import { validateField } from '../../../../components/form/Label/validationField';

export default function LoginForm( { resetPass, registerPath, enter, sessionExpired, accountDeleted }){

    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        if (loading) return;
        if(!validateFields()) return;
        setErrorMsg('');
        setLoading(true);
        try {
            await login(email, senha, rememberMe);
            navigate(enter);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        const hasError = validateField('email', email, true) || validateField('senha', senha, true);
        if(hasError)
            setErrorMsg('Preencha os campos obrigatórios e corrija os erros antes de continuar');
        return !hasError;
    }

    const linkClasses = 'w-fit ml-auto rounded-sm transition duration-300 hover:-translate-y-0.75 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

    return(
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
            }}
            noValidate
            className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between gap-6 bg-(--purple-primary) px-6 py-8 sm:p-9 md:rounded-r-[130px]">

            <Link to="/" className='flex w-fit gap-x-3 rounded-sm transition duration-300 hover:-translate-x-1 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
                <Undo2 aria-hidden="true"/>
                Voltar
            </Link>

            <div className='flex flex-col text-center py-4 w-full max-w-md mx-auto'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>
                    Faça seu login!
                </h1>
                <p className='text-sm sm:text-base md:text-lg mt-4'>
                    Bem-vinda de volta. Sua jornada continua aqui.
                </p>

                {sessionExpired && (
                    <p role="status" className="mt-6 text-base text-left bg-red-700 text-white p-4 rounded-md">
                        Sua sessão expirou. Faça login novamente para continuar.
                    </p>
                )}

                {accountDeleted && (
                    <p role="status" className="mt-6 text-base text-left bg-green-700 text-white p-4 rounded-md">
                        Sua conta foi excluída com sucesso.
                    </p>
                )}

                <div className='text-left flex flex-col gap-y-3 mt-6 sm:mt-8 mb-5'>
                    <LabelInput
                        label="E-mail"
                        name="email"
                        type="email"
                        theme='red'
                        value={email}
                        required={true}
                        placeholder='Digite seu email'
                        validation='email'
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <LabelInput
                        label="Senha"
                        name="senha"
                        type="senha"
                        theme='red'
                        required={true}
                        placeholder='Digite sua senha'
                        validation='senha'
                        autoComplete="current-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <label className="flex items-center gap-2 text-sm mt-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-white w-4 h-4"
                        />
                        Manter-me conectada
                    </label>
                </div>

                <div role="alert" aria-live="assertive">
                    {errorMsg && (
                        <p className="mb-4 text-left bg-red-700 text-white px-4 py-3 rounded-md">
                            {errorMsg}
                        </p>
                    )}
                </div>

                <div className='flex flex-col gap-y-2 justify-end'>
                    <Link to={resetPass} className={linkClasses}>
                        Esqueci a senha
                    </Link>
                    <Link to={registerPath} className={linkClasses}>
                        Não tenho conta ainda
                    </Link>
                </div>
            </div>

            <div className='flex justify-center'>
                <BtnCallToAction variant="white"
                    disabled={loading}
                    type="submit">
                    {loading ? 'Entrando...' : 'ENTRAR'}
                </BtnCallToAction>
            </div>

        </form>
    )
}
