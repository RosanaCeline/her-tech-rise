import LabelInput from '../../../../components/form/Label/LabelInput';
import { maskField } from '../../../../components/form/Label/maskField';

export default function RegisterStep1({formData, handleChange }){

    return(
        <section>
                <p className='text-center text-4xl mb-2'>
                    Agora, nos conte um pouco mais sobre você.
                </p>
                <p className='text-center text-lg'>
                    Precisamos de algumas informações para criar sua conta.
                </p>
                <div className='flex flex-col gap-y-2 mt-4'>
                    <LabelInput label="Nome:" 
                                theme='white' 
                                placeholder='Digite seu nome' 
                                required={true} 
                                maxLength='180'
                                value={formData.nome} 
                                onChange={(e) => handleChange('nome', e.target.value)}/>
                                {formData.tipo_usuario === 'profissional'
                                    ? <LabelInput   label="CPF:"            theme='white' 
                                                    required={true}         validation='cpf' 
                                                    maxLength='14'          placeholder='Digite seu CPF'
                                                    value={formData.cpf}    onChange={(e) => handleChange('cpf', maskField('cpf', e.target.value))}/>
                                    : <LabelInput   label="CNPJ:"           theme='white' 
                                                    required={true}         validation='cnpj' 
                                                    maxLength='14'          placeholder='Digite seu CNPJ'
                                                    value={formData.cnpj}   onChange={(e) => handleChange('cnpj', maskField('cnpj', e.target.value))}/>
                                }
                    <div className='flex columns-2 gap-x-5'>
                        {formData.tipo_usuario === 'profissional'
                            ? <LabelInput   label="Data de Nascimento:"         theme='white' 
                                            required={true}                     validation='data' 
                                            maxLength='10'                      placeholder='Digite sua data de nascimento'
                                            value={formData.data_nascimento}    onChange={(e) => handleChange('data_nascimento', maskField('data', e.target.value))}/>
                            : <LabelInput   label="Tipo de Empresa:"            theme='white' 
                                            required={true}                     type='select' 
                                            options={[{value: 'nacional', label: 'Nacional'}, {value: 'internacional', label: 'Internacional'}]}
                                            value={formData.tipo_empresa}          onChange={(e) => handleChange('tipo_empresa', e.target.value)}/>
                        }
                        <LabelInput         label="Telefone:"               theme='white' 
                                            required={true}                 validation='telefone' 
                                            maxLength='15'                  placeholder='Digite seu telefone'
                                            value={formData.telefone}       onChange={(e) => handleChange('telefone', maskField('telefone', e.target.value))}/>
                    </div>
                </div>
        </section>
    )
}