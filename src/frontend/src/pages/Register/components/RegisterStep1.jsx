import { Undo2 } from 'lucide-react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function RegisterStep1({formData, setFormData, handleChange, validateFields, prevStep, errorMessage}){
    return(
        <div className="text-white w-1/2 h-screen flex flex-col justify-between bg-(--purple-action) p-12 pl-25 rounded-l-[130px]">
            <div className='flex justify-around'>
                <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' onClick={prevStep}>
                    <Undo2/>
                    Voltar
                </button>
                <button className='text-lg text-md w-fit ml-auto transition duration-300 hover:-translate-y-0.75'>Já tenho uma conta!</button>
            </div>
            <div>
                <p className='text-center text-4xl mb-2'>Antes de começar, nos conte quem é você.</p>
                <p className='text-center text-lg'>Selecione o seu perfil para personalizarmos a sua experiência na plataforma."</p>
                <div className='flex flex-col gap-y-6 w-fit mx-auto mt-8'>
                    <button onClick={() => handleChange('tipo_usuario', 'profissional')} className={`w-full mx-auto cursor-pointer py-4 px-9 rounded-3xl
                        ${(formData.tipo_usuario == 'profissional'
                            ? 'bg-(--purple-primary) text-(--light)'
                            : 'bg-white text-(--purple-primary)'
                        )}`}>
                        SOU PROFISSIONAL
                    </button>
                    <button onClick={() => handleChange('tipo_usuario', 'empresa')} className={`w-full mx-auto cursor-pointer px-9 py-4 rounded-3xl
                        ${(formData.tipo_usuario == 'empresa' 
                            ? 'bg-(--purple-primary) text-(--light)'
                            : 'bg-white text-(--purple-primary) '
                        )}`}>
                        SOU EMPRESA
                    </button>
                </div>
                
            </div>
            <div>
                <p className='text-center mb-3'>Preencha <strong>todas</strong> as fases para concluir seu cadastro. *</p>
                <div className='flex justify-center'><BtnCallToAction variant="white" onClick={validateFields}>CONTINUAR</BtnCallToAction></div>
                {errorMessage && <p className='text-center mt-2'>{errorMessage}</p>}
            </div>
        </div>
    )
}