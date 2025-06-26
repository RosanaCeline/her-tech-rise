import { useState } from 'react'
import RegisterStep1 from '../components/RegisterStep1'
import RegisterStep2 from '../components/RegisterStep2'
import RegisterStep3 from '../components/RegisterStep3'
import RegisterStep4 from '../components/RegisterStep4'
import { validateField } from '../../../components/form/Label/validationField'


export default function RegisterForm(){
    const [step, setStep] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        tipo_usuario: '',
        nome: '',
        cpf: '',
        data_nascimento: '',
        cnpj: '',
        tipo_empresa: '',
        telefone: '',
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        email: '',
        senha: '',
        senha_confirmada: ''
    })

    const validateFields= (fields, message = 'Preencha os campos obrigatórios e corrija os erros antes de continuar') => {
        const hasError = fields.some(field => validateField(field, formData[field], true))
        if(hasError) 
            setErrorMessage(message)
        else {
            setErrorMessage('')
            setStep(step + 1)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    switch(step){
        case 1:
            return <RegisterStep1 formData={formData} setFormData={setFormData} handleChange={handleChange}
            validateFields={() => validateFields(['tipo_usuario'], 'Selecione um tipo de perfil antes de continuar')} 
            prevStep={() => window.location.href = '/'} errorMessage={errorMessage}/>
        case 2: 
            return <RegisterStep2 formData={formData} setFormData={setFormData} handleChange={handleChange}
            validateFields={() => {
                if(formData.tipo_usuario === 'empresa') validateFields(['nome', 'cnpj', 'tipo_empresa', 'telefone'])
                else validateFields(['nome', 'cpf', 'data_nascimento', 'telefone'])
            }} 
            prevStep={() => setStep(step - 1)} errorMessage={errorMessage}/>
        case 3:
            return <RegisterStep3 formData={formData} setFormData={setFormData} handleChange={handleChange}
            validateFields={() => validateFields(['cep', 'cidade', 'rua', 'bairro'])} 
            prevStep={() => setStep(step - 1)} errorMessage={errorMessage}/>
        case 4:
            return <RegisterStep4 formData={formData} setFormData={setFormData} handleChange={handleChange}
            validateFields={() => validateFields(['email', 'senha', 'senha_confirmada'])} 
            prevStep={() => setStep(step - 1)} errorMessage={errorMessage}/>
        case 5:
            console.log(formData)
    }
}