import LabelInput from '../../../../components/form/Label/LabelInput';
import { maskField } from '../../../../components/form/Label/maskField';
import { useEffect } from 'react';

export default function RegisterStep1({formData, handleChange, fetchCPF, fetchCNPJ}){

    useEffect(() => {
        formData.tipo_usuario === 'profissional' ? fetchCPF() : fetchCNPJ()
    }, [formData.cnpj, formData.cpf]);

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
                        ?   <div className='flex columns-2 gap-x-5'>
                                <LabelInput   label="CPF:"            theme='white' 
                                    required={true}         validation='cpf' 
                                    maxLength='14'          placeholder='Digite seu CPF'
                                    value={formData.cpf}    onChange={(e) => handleChange('cpf', maskField('cpf', e.target.value))}/>
                                <LabelInput   label="Você se identifica como:"            theme='white' 
                                    required={true}         type="select"
                                    options={[
                                        {value: 'MULHER', label: 'Mulher'}, 
                                        {value: 'HOMEM', label: 'Homem'},
                                        {value: 'PESSOA_NAO_BINARIA', label: 'Pessoa não binária'},
                                        {value: 'OUTRO', label: 'Outro'},
                                        {value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar'}]}
                                    value={formData.gender}    onChange={(e) => handleChange('gender', e.target.value)}/>
                            </div>
                        : <LabelInput   label="CNPJ:"           theme='white' 
                                        required={true}         validation='cnpj' 
                                        maxLength='18'          placeholder='Digite seu CNPJ'
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
                                            options={[{value: 'NACIONAL', label: 'Nacional'}, {value: 'INTERNACIONAL', label: 'Internacional'}]}
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