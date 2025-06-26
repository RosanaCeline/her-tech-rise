import { Undo2 } from 'lucide-react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import LabelInput from '../../../components/form/Label/LabelInput';
import { maskField } from '../../../components/form/Label/maskField';

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
                <p className='text-center text-4xl mb-2'>Quase lá. Agora, seu endereço.</p>
                <p className='text-center text-lg'>Informe os dados de localização para completar seu perfil.</p>
                <div className='flex flex-col gap-y-2'>
                    <div className='flex columns-2 gap-x-5'>
                        <LabelInput label="CEP:" theme='white' required={true} validation='cep' maxLength='9' placeholder='Digite seu CEP'
                        value={formData.cep} onChange={(e) => handleChange('cep', maskField('cep', maskField('cep', e.target.value)))}/>
                        <LabelInput label="Cidade:" theme='white' required={true} placeholder='Digite o nome da sua cidade' maxLength='50'
                        value={formData.cidade} onChange={(e) => handleChange('cidade', e.target.value)}/>
                    </div>
                    <LabelInput label="Rua:" theme='white' required={true} placeholder='Digite o nome da sua rua' maxLength='100'
                    value={formData.rua} onChange={(e) => handleChange('rua', e.target.value)}/>
                    <LabelInput label="Bairro:" theme='white' required={true} placeholder='Digite o nome do seu bairro' maxLength='50'
                    value={formData.bairro} onChange={(e) => handleChange('bairro', e.target.value)}/>
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