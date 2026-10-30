import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Undo2 } from 'lucide-react';

import { isTokenExpired, newPassword } from '../../../../services/authService';
import LabelInput from '../../../../components/form/Label/LabelInput';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import { validateField } from '../../../../components/form/Label/validationField';
import { useQueryParams } from '../../../../services/useQueryParams';

export default function NewPasswordForm(){

    const navigate = useNavigate();
    const query = useQueryParams();
    const token = query.get('token');
    const linkExpired = !!token && isTokenExpired(token);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [linkInvalid, setLinkInvalid] = useState(!token || linkExpired);
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const senhasDiferentes = confirmaSenha !== '' && confirmaSenha !== senha;

    const handleNewPassword = async () => {
        if (loading) return;
        if (!validateFields()) return;
        setErrorMsg('');
        setLoading(true);
        try {
            await newPassword(token, senha);
            setSuccessModalOpen(true);
        } catch (err) {
            setErrorMsg(err.message);
            if (/link/i.test(err.message)) setLinkInvalid(true);
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        const hasError = validateField('senha', senha, true) || validateField('senha', confirmaSenha, true);
        if (hasError) {
            setErrorMsg('Preencha os campos obrigatórios e corrija os erros antes de continuar');
            return false;
        }
        if (senhasDiferentes) {
            setErrorMsg('As senhas não coincidem.');
            return false;
        }
        return true;
    }

    const linkClasses = 'w-fit mx-auto rounded-sm transition duration-300 hover:-translate-y-0.75 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleNewPassword()
            }}
            noValidate
            className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between gap-6 bg-(--purple-primary) px-6 py-8 sm:p-9 md:rounded-r-[130px]">

            <Link to="/login" className='flex w-fit gap-x-3 rounded-sm transition duration-300 hover:-translate-x-1 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
                <Undo2 aria-hidden="true"/>
                Voltar para o login
            </Link>

            <div className='flex flex-col text-center py-4 w-full max-w-md mx-auto'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Defina sua nova senha</h1>
                <p className='text-sm sm:text-base md:text-lg mt-4'>Digite uma nova senha segura para acessar sua conta.</p>

                {!token ? (
                    <p role="alert" className="mt-8 text-left bg-red-700 text-white p-4 rounded-md">
                        Este link de redefinição está incompleto. Abra o link exatamente como chegou no e-mail ou solicite um novo.
                    </p>
                ) : linkExpired ? (
                    <p role="alert" className="mt-8 text-left bg-red-700 text-white p-4 rounded-md">
                        Este link de redefinição expirou. Por segurança, ele vale por 30 minutos. Solicite um novo para continuar.
                    </p>
                ) : (
                    <div className='text-left flex flex-col gap-y-3 mt-6 sm:mt-8 mb-5'>
                        <LabelInput label="Nova senha"
                            name="nova_senha"
                            theme='red'
                            required={true}
                            placeholder='Digite sua nova senha'
                            maxLength='70'
                            type='senha'
                            validation='senha'
                            autoComplete="new-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}/>
                        <LabelInput label="Confirmar nova senha"
                            name="confirmar_senha"
                            theme='red'
                            required={true}
                            maxLength='70'
                            placeholder='Confirme sua nova senha'
                            type='senha'
                            autoComplete="new-password"
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}/>
                        <div role="alert">
                            {senhasDiferentes && <p className="text-sm text-white bg-red-700 px-3 py-2 rounded-md">As senhas não coincidem.</p>}
                        </div>
                    </div>
                )}

                <div role="alert" aria-live="assertive">
                    {errorMsg && (
                        <p className="mb-4 text-left bg-red-700 text-white px-4 py-3 rounded-md">
                            {errorMsg}
                        </p>
                    )}
                </div>

                {linkInvalid && (
                    <Link to="/redefinirsenha" className={`${linkClasses} mt-2`}>
                        Solicitar um novo link
                    </Link>
                )}
            </div>

            <div className='flex justify-center'>
                {token && !linkExpired && (
                    <BtnCallToAction variant="white" type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'SALVAR NOVA SENHA'}
                    </BtnCallToAction>
                )}
            </div>

            {successModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
                    <div role="dialog"
                         aria-modal="true"
                         aria-labelledby="new-password-success-title"
                         className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                        <h2 id="new-password-success-title" className="text-2xl font-bold mb-4 text-(--purple-primary)">Senha alterada com sucesso!</h2>
                        <p className="mb-6 text-gray-700">Por segurança, encerramos as sessões abertas. Entre novamente com a nova senha.</p>
                        <BtnCallToAction type="button" onClick={() => navigate('/login')}>
                            IR PARA O LOGIN
                        </BtnCallToAction>
                    </div>
                </div>
            )}
        </form>
    );
}
