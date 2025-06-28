import { useNavigate } from "react-router-dom";
import { Undo2 } from 'lucide-react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../components/form/Label/LabelInput';

export default function LoginForm( { resetPass, registerPath, enter }){
    const navigate = useNavigate();
    
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
                />
                <LabelInput 
                    label="Senha" 
                    theme='white' 
                />
            </div>

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
                onClick={() => navigate(enter)}>
                ENTRAR
            </BtnCallToAction>
        </div>

    </div>
    )
}