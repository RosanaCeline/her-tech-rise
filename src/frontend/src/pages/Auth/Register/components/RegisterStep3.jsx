import { Undo2 } from 'lucide-react';
import LabelInput from '../../../../components/form/Label/LabelInput';
import { maskField } from '../../../../components/form/Label/maskField';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function RegisterStep1({formData, handleChange }){
    const estados = [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ];

    const options = estados.map(estado => ({ value: estado, label: estado }));

    const ruaInput = useRef(null)
    const cidadeInput = useRef(null)
    const bairroInput = useRef(null)
    const estadoInput = useRef(null)
    const [formHasChanged, setFormHasChanged] = useState(false)

    useEffect(() => {
        async function fetchCEP(){
            if(formData.cep.length == 9){
                const response = await axios.get(`https://viacep.com.br/ws/${formData.cep.replace("-", "")}/json/`)
                const data = response.data
                if(!data.erro){
                    setFormHasChanged(true)
                    handleChange('rua', data.logradouro)
                    ruaInput.current.disabled = true
                    handleChange('cidade', data.localidade)
                    cidadeInput.current.disabled = true
                    handleChange('bairro', data.bairro)
                    bairroInput.current.disabled = true
                    handleChange('estado', data.estado)
                    estadoInput.current.disabled = true
                }
            }else if(formHasChanged){
                setFormHasChanged(false)
                handleChange('rua', '')
                ruaInput.current.disabled = false
                handleChange('cidade', '')
                cidadeInput.current.disabled = false
                handleChange('bairro', '')
                bairroInput.current.disabled = false
                handleChange('estado', '')
                estadoInput.current.disabled = false
            }
        }
        fetchCEP()
    }, [formData.cep])
    
    return(
        <section>
                <p className='text-center text-4xl mb-2'>
                    Quase lá. Agora, seu endereço.
                </p>
                <p className='text-center text-lg'>
                    Informe os dados de localização para completar seu perfil.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <div className='grid grid-cols-3 gap-x-5'>
                        <LabelInput label="CEP:" 
                                    theme='white' 
                                    required={true} 
                                    validation='cep' 
                                    maxLength='9' 
                                    placeholder='Digite seu CEP'
                                    value={formData.cep} 
                                    onChange={(e) => handleChange('cep', maskField('cep', maskField('cep', e.target.value)))}
                        />
                        <div class="col-span-2">
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
                    <div class="grid grid-cols-2 gap-x-5">
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