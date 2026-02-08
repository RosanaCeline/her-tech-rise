import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../../services/authService';
import LabelInput from '../../../../components/form/Label/LabelInput';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import { Undo2 } from 'lucide-react';
import { validateField } from '../../../../components/form/Label/validationField';


export default function ResetForm() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate();

  const handleReset = async () => {
    if(!validateFields()) return
    setLoading(true);
    try {
      await resetPassword(email);
      setFeedback('Enviamos um link de redefinição para seu e-mail.');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erro ao tentar redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
      const hasError = validateField('email', email, true)
      if(hasError)
          setErrorMsg('Preencha os campos obrigatórios e corrija os erros antes de continuar')
      else setErrorMsg('')
      return !hasError
  }

  return (
    <div className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between bg-(--purple-primary) mx-4 md:mx-0 p-9 md:rounded-r-[130px]">
      <button className='flex gap-x-3 cursor-pointer transition hover:-translate-x-1'
              onClick={() => navigate('/')}>
        <Undo2 />
        Voltar
      </button>

      <div className='text-center'>
        <p className='text-3xl sm:text-4xl md:text-5xl font-bold'>Esqueceu sua senha?</p>
        <p className='text-sm sm:text-base md:text-lg mt-4'>Informe seu e-mail e enviaremos instruções.</p>

        <div className='text-left flex flex-col gap-y-3 mt-6 sm:mt-8 mb-5'>
          <LabelInput
            label="E-mail"
            theme="white"
            type="email"
            placeholder='Informe seu email'
            validation='email'
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {feedback && <p className='text-sm mt-4'>{feedback}</p>}
      </div>

      <div className='flex flex-col'>
        <div className='flex justify-center'>
          <BtnCallToAction variant="white" onClick={handleReset} disabled={loading}>
            {loading ? 'Enviando...' : 'ENVIAR'}
          </BtnCallToAction>
        </div>
        {errorMsg && <p className='text-sm mt-4 mx-auto'>{errorMsg}</p>}
      </div>
    </div>
  );
}
