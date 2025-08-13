import LabelInput from '../../../../components/form/Label/LabelInput';
import { maskField } from '../../../../components/form/Label/maskField';
import { useRef } from 'react';
import { useCepAutoComplete } from '../../../../services/hooks/useCepAutoComplete';

export default function RegisterStep1({formData, handleChange }){      
    const ruaInput = useRef(null)
    const cidadeInput = useRef(null)
    const bairroInput = useRef(null)
    const estadoInput = useRef(null)
    
    const { estados} = useCepAutoComplete({cep: formData.cep, handleChange, refs: {
        rua: ruaInput,
        cidade: cidadeInput,
        bairro: bairroInput,
        estado: estadoInput
    }});
    
    const options = estados.map(estado => ({ value: estado, label: estado }));
    
    return(
        <section>
                <p className='text-center text-3xl md:text-4xl mb-2'>
                    Quase lá. Agora, seu endereço.
                </p>
                <p className='text-center text-lg'>
                    Informe os dados de localização para completar seu perfil.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2'>
                        <LabelInput label="CEP:" 
                                    theme='white' 
                                    required={true} 
                                    validation='cep' 
                                    maxLength='9' 
                                    placeholder='Digite seu CEP'
                                    value={formData.cep} 
                                    onChange={(e) => handleChange('cep', maskField('cep', maskField('cep', e.target.value)))}
                        />
                        <div className="sm:col-span-2">
                        <LabelInput label="Rua:" 
                                    theme='white' 
                                    required={true} 
                                    placeholder='Digite o nome da sua rua' 
                                    maxLength='50'
                                    value={formData.rua}
                                    ref={ruaInput} 
                                    onChange={(e) => handleChange('rua', e.target.value)}
                        />
                        </div>
                    </div>
                    
                    <LabelInput label="Bairro:" 
                                theme='white' 
                                required={true} 
                                placeholder='Digite o nome do seu bairro' 
                                maxLength='50'
                                value={formData.bairro} 
                                ref={bairroInput}
                                onChange={(e) => handleChange('bairro', e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                        <LabelInput label="Cidade:"    
                                    theme='white' 
                                    required={true} 
                                    placeholder='Digite o nome da sua cidade' 
                                    maxLength='100'
                                    value={formData.cidade} 
                                    ref={cidadeInput}
                                    onChange={(e) => handleChange('cidade', e.target.value)}
                        />
                        <LabelInput label="Estado:"    
                                    theme='white' 
                                    required={true} 
                                    type='select'
                                    value={formData.estado}
                                    ref={estadoInput} 
                                    onChange={(e) => handleChange('estado', e.target.value)}
                                    options={options}
                        />
                    </div>
                </div>
        </section>
    )
}