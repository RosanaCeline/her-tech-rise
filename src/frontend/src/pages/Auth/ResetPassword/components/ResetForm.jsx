import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../../services/authService';
import LabelInput from '../../../../components/form/Label/LabelInput';
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction';
import { Undo2 } from 'lucide-react';

export default function ResetForm() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
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

  return (
    <div className="text-white w-full md:w-1/2 h-screen flex flex-col justify-between bg-(--purple-primary) mx-6 md:mx-0 p-9 md:rounded-r-[130px]">
      <button className='flex gap-x-3 cursor-pointer transition hover:-translate-x-1'
              onClick={() => navigate('/')}>
        <Undo2 />
        Voltar
      </button>

      <div className='text-center'>
        <p className='text-4xl font-bold'>Esqueceu sua senha?</p>
        <p className='text-lg mt-4'>Informe seu e-mail e enviaremos instruções.</p>

        <div className='mt-10 mb-5'>
          <LabelInput
            label="E-mail"
            theme="white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {feedback && <p className='text-sm mt-4'>{feedback}</p>}
      </div>

      <div className='flex justify-center'>
        <BtnCallToAction variant="white" onClick={handleReset} disabled={loading}>
          {loading ? 'Enviando...' : 'ENVIAR'}
        </BtnCallToAction>
      </div>
    </div>
  );
}
