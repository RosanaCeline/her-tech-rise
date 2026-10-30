import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Undo2 } from 'lucide-react';

import { resetPassword } from '../../../../services/authService';
import LabelInput from '../../../../components/form/Label/LabelInput';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import { validateField } from '../../../../components/form/Label/validationField';

export default function ResetForm() {

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async () => {
    if (loading) return;
    if (!validateFields()) return;
    setErrorMsg('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const hasError = validateField('email', email, true);
    if (hasError) setErrorMsg('Informe um e-mail válido para continuar');
    return !hasError;
  }

  const linkClasses = 'w-fit mx-auto rounded-sm transition duration-300 hover:-translate-y-0.75 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleReset()
      }}
      noValidate
      className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between gap-6 bg-(--purple-primary) px-6 py-8 sm:p-9 md:rounded-r-[130px]">

      <Link to="/login" className='flex w-fit gap-x-3 rounded-sm transition duration-300 hover:-translate-x-1 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
        <Undo2 aria-hidden="true"/>
        Voltar para o login
      </Link>

      <div className='flex flex-col text-center py-4 w-full max-w-md mx-auto'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Esqueceu sua senha?</h1>
        <p className='text-sm sm:text-base md:text-lg mt-4'>Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>

        {sent ? (
          <div role="status" className="mt-8 text-left bg-green-700 text-white p-4 rounded-md">
            <p className="font-semibold">Pedido recebido!</p>
            <p className="mt-2">
              Se houver uma conta com o e-mail <strong className="break-all">{email.trim()}</strong>, você receberá
              um link para redefinir a senha em alguns minutos. O link vale por 30 minutos.
            </p>
            <p className="mt-2 text-sm">Não chegou? Confira a caixa de spam ou tente de novo daqui a alguns minutos.</p>
          </div>
        ) : (
          <div className='text-left flex flex-col gap-y-3 mt-6 sm:mt-8 mb-5'>
            <LabelInput
              label="E-mail"
              name="email"
              type="email"
              theme="red"
              placeholder='Digite seu e-mail'
              validation='email'
              autoComplete="email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        <div role="alert" aria-live="assertive">
          {errorMsg && (
            <p className="mt-4 text-left bg-red-700 text-white px-4 py-3 rounded-md">
              {errorMsg}
            </p>
          )}
        </div>

        {sent && (
          <button type="button"
                  onClick={() => setSent(false)}
                  className={`${linkClasses} mt-6 cursor-pointer`}>
            Usar outro e-mail
          </button>
        )}
      </div>

      <div className='flex justify-center'>
        {sent ? (
          <BtnCallToAction variant="white" to="/login">
            IR PARA O LOGIN
          </BtnCallToAction>
        ) : (
          <BtnCallToAction variant="white" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'ENVIAR LINK'}
          </BtnCallToAction>
        )}
      </div>
    </form>
  );
}
