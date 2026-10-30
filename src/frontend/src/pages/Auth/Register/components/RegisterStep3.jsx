import LabelInput from '../../../../components/form/Label/LabelInput';
import { maskField } from '../../../../components/form/Label/maskField';
import { useCepAutoComplete } from '../../../../services/hooks/useCepAutoComplete';

const cepMessages = {
    loading: 'Buscando endereço...',
    error: 'Não foi possível buscar o CEP agora. Preencha o endereço manualmente.',
}

export default function RegisterStep3({formData, handleChange }){      
    const { estados, status } = useCepAutoComplete({ cep: formData.cep, handleChange });
    
    const options = estados.map(estado => ({ value: estado, label: estado }));
    
    return(
        <section>
                <h1 className='text-center text-3xl md:text-4xl mb-2'>
                    Quase lá. Agora, seu endereço.
                </h1>
                <p className='text-center text-base sm:text-lg'>
                    Informe os dados de localização para completar seu perfil.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2'>
                        <div>
                            <LabelInput label="CEP:" 
                                        name='cep'
                                        theme='white' 
                                        required={true} 
                                        validation='cep' 
                                        maxLength='9' 
                                        inputMode='numeric'
                                        autoComplete='postal-code'
                                        placeholder='Digite seu CEP'
                                        value={formData.cep} 
                                        onChange={(e) => handleChange('cep', maskField('cep', e.target.value))}
                            />
                            <p aria-live='polite' className='text-sm mt-1 min-h-5'>
                                {cepMessages[status] ?? ''}
                            </p>
                        </div>
                        <div className="sm:col-span-2">
                        <LabelInput label="Rua:" 
                                    name='rua'
                                    theme='white' 
                                    required={true} 
                                    placeholder='Digite o nome da sua rua' 
                                    maxLength='50'
                                    autoComplete='address-line1'
                                    value={formData.rua}
                                    onChange={(e) => handleChange('rua', e.target.value)}
                        />
                        </div>
                    </div>
                    
                    <LabelInput label="Bairro:" 
                                name='bairro'
                                theme='white' 
                                required={true} 
                                placeholder='Digite o nome do seu bairro' 
                                maxLength='50'
                                value={formData.bairro} 
                                onChange={(e) => handleChange('bairro', e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                        <div>
                            <LabelInput label="Cidade:"    
                                        name='cidade'
                                        theme='white' 
                                        required={true} 
                                        placeholder='Digite o nome da sua cidade' 
                                        maxLength='100'
                                        autoComplete='address-level2'
                                        value={formData.cidade} 
                                        onChange={(e) => handleChange('cidade', e.target.value)}
                            />
                        </div>
                        <div>
                            <LabelInput label="Estado:"    
                                        name='estado'
                                        theme='white' 
                                        required={true} 
                                        type='select'
                                        autoComplete='address-level1'
                                        value={formData.estado}
                                        onChange={(e) => handleChange('estado', e.target.value)}
                                        options={options}
                            />
                        </div>
                    </div>
                </div>
        </section>
    )
}
