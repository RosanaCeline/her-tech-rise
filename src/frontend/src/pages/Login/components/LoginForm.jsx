import { Undo2 } from 'lucide-react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../components/form/Label/LabelInput';

function LoginForm(){
    return(
    <div className="text-white w-1/2 h-screen flex flex-col justify-between bg-(--purple-primary) p-9 rounded-r-[130px]">
        <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' onClick={() => window.location.href = '/'}>
            <Undo2/>
            Voltar
        </button>
        <div className='flex flex-col text-center'>
            <p className='text-4xl font-medium'>Faça seu login!</p>
            <p className='text-lg'>Bem-vinda de volta. Sua jornada continua aqui.</p>
            <div className='flex flex-col gap-y-3 mt-10 mb-5'>
                <LabelInput label="E-mail"></LabelInput>
                <LabelInput label="Senha"></LabelInput>
            </div>
            <div className='flex flex-col gap-y-1 justify-end'>
                <button className='w-fit ml-auto transition duration-300 hover:-translate-y-0.75'>Esqueci a senha</button>
                <button className='w-fit ml-auto transition duration-300 hover:-translate-y-0.75'>Não tenho conta ainda</button>
            </div>
        </div>
        <div className='flex justify-center'><BtnCallToAction variant="white">ENTRAR</BtnCallToAction></div>
    </div>
    )
}

export default LoginForm