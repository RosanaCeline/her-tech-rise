import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Undo2 } from 'lucide-react'

import RegisterStep1 from '../components/RegisterStep1'
import RegisterStep2 from '../components/RegisterStep2'
import RegisterStep3 from '../components/RegisterStep3'
import RegisterStep4 from '../components/RegisterStep4'
import { validateField } from '../../../components/form/Label/validationField'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction'


export default function RegisterForm(){
    const navigate = useNavigate()
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

    const handleChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const validateFields= (fields, message = 'Preencha os campos obrigatórios e corrija os erros antes de continuar') => {
        const hasError = fields.some(field => validateField(field, formData[field], true))
        if(hasError) 
            setErrorMessage(message)
        else {
            setErrorMessage('')
            if (step < 4) {
                setStep(step + 1);
            } else {
                navigate('/login');
            }
        }
    }

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            // navigate('/');
            window.location.href = '/'
        }
    }

    switch (step) {
        case 1:
            return (
                <StepWrapper
                    goBackTo={handlePrevStep}
                    validateFields={() =>
                        validateFields(['tipo_usuario'], 'Selecione um tipo de perfil antes de continuar')
                    }
                    errorMessage={errorMessage}
                >
                    <RegisterStep1
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                    />
                </StepWrapper>
            )

        case 2:
            return (
                <StepWrapper
                    goBackTo={handlePrevStep}
                    validateFields={() => {
                        if (formData.tipo_usuario === 'empresa')
                            validateFields(['nome', 'cnpj', 'tipo_empresa', 'telefone'])
                        else
                            validateFields(['nome', 'cpf', 'data_nascimento', 'telefone'])
                    }}
                    errorMessage={errorMessage}
                >
                    <RegisterStep2
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                    />
                </StepWrapper>
            )

        case 3:
            return (
                <StepWrapper
                    goBackTo={handlePrevStep}
                    validateFields={() =>
                        validateFields(['cep', 'cidade', 'rua', 'bairro'])
                    }
                    errorMessage={errorMessage}
                >
                    <RegisterStep3
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                    />
                </StepWrapper>
            )

        case 4:
            return (
                <StepWrapper
                    goBackTo={handlePrevStep}
                    validateFields={() =>
                        validateFields(['email', 'senha', 'senha_confirmada'])
                    }
                    errorMessage={errorMessage}
                >
                    <RegisterStep4
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                    />
                </StepWrapper>
            )

        case 5:
            console.log(formData)
            return null
    }
}


function StepWrapper({ children, goBackTo, validateFields, errorMessage }) {
    const navigate = useNavigate();

    return (
        <div className="text-white w-1/2 h-screen flex flex-col justify-between bg-(--purple-action) p-12 pl-25 rounded-l-[130px]">
            <div className='flex justify-around'>
                <button className='flex gap-x-3 cursor-pointer transition duration-300  hover:-translate-x-1 will-change-transform' 
                        onClick={goBackTo}>
                            <Undo2/>
                            Voltar
                </button>
                <button className='text-lg text-md w-fit ml-auto transition duration-300 hover:-translate-y-0.75' 
                        onClick={() => navigate('/login')}>
                    Já tenho uma conta!
                </button>
            </div>

            <section className="flex-1 flex flex-col justify-center">{children}</section>

            <div>
                <p className='text-center mb-3'>Preencha <strong>todas</strong> as fases para concluir seu cadastro. *</p>
                <div className='flex justify-center'>
                    <BtnCallToAction    variant="white" 
                                        onClick={validateFields}>
                                            CONTINUAR
                    </BtnCallToAction>
                </div>
                {errorMessage && <p className='text-center mt-2'>{errorMessage}</p>}
            </div>
        </div>
    )
}
