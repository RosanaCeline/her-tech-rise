import { Undo2 } from 'lucide-react';
import LabelInput from '../../../components/form/Label/LabelInput';
import { maskField } from '../../../components/form/Label/maskField';

export default function RegisterStep1({formData, handleChange }){

    return(
        <section>
                <p className='text-center text-4xl mb-2'>
                    Quase lá. Agora, seu endereço.
                </p>
                <p className='text-center text-lg'>
                    Informe os dados de localização para completar seu perfil.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <div className='flex columns-2 gap-x-5'>
                        <LabelInput label="CEP:" 
                                    theme='white' 
                                    required={true} 
                                    validation='cep' 
                                    maxLength='9' 
                                    placeholder='Digite seu CEP'
                                    value={formData.cep} 
                                    onChange={(e) => handleChange('cep', maskField('cep', maskField('cep', e.target.value)))}
                        />
                        <LabelInput label="Cidade:" 
                                    theme='white' 
                                    required={true} 
                                    placeholder='Digite o nome da sua cidade' 
                                    maxLength='50'
                                    value={formData.cidade} 
                                    onChange={(e) => handleChange('cidade', e.target.value)}
                        />
                    </div>
                    
                    <LabelInput label="Rua:"    
                                theme='white' 
                                required={true} 
                                placeholder='Digite o nome da sua rua' 
                                maxLength='100'
                                value={formData.rua} 
                                onChange={(e) => handleChange('rua', e.target.value)}
                    />
                    <LabelInput label="Bairro:" 
                                theme='white' 
                                required={true} 
                                placeholder='Digite o nome do seu bairro' 
                                maxLength='50'
                                value={formData.bairro} 
                                onChange={(e) => handleChange('bairro', e.target.value)}
                    />
                </div>
        </section>
    )
}