import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Undo2 } from 'lucide-react'
import { register, verifyCNPJ, verifyCPF } from '../../../../services/authService';
import { useAuth } from '../../../../context/AuthContext';
import RegisterStep1 from './RegisterStep1'
import RegisterStep2 from './RegisterStep2'
import RegisterStep3 from './RegisterStep3'
import RegisterStep4 from './RegisterStep4'
import { validateField } from '../../../../components/form/Label/validationField'
import BtnCallToAction from '../../../../components/btn/BtnCallToAction/BtnCallToAction'


export default function RegisterForm(){
    const [step, setStep] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')
    const [registerErrorMessage, setRegisterErrorMessage] = useState('')
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tipo_usuario: '',
        nome: '',
        cpf: '',
        data_nascimento: '',
        cnpj: '',
        tipo_empresa: '',
        gender: '',
        consentGenderSharing: '',
        telefone: '',
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
        email: '',
        senha: '',
        senha_confirmada: ''
    })

    const handleChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await register(formData); 
            setSuccessModalOpen(true)
        } catch (err) {
            setRegisterErrorMessage(err.response?.data?.message || 'Erro ao registrar');
            setTimeout(() => setRegisterErrorMessage(null), 4000)
        } finally {
            setLoading(false);
        }
    }

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/');
        }
    }

    const [formHasChanged, setFormHasChanged] = useState(false);
     async function fetchCPF() {
        if (formData.cpf.length === 14) {
            try {
                const verify = await verifyCPF(formData.cpf)
                if(verify === false){
                    setErrorMessage("O CPF informado pertence a outra conta")
                    setFormHasChanged(true);
                }
                else if(verify === true) setErrorMessage('')
                return verify
            } catch (error) {
                console.error("Erro ao verificar CPF:", error);
            }
        }else if(formHasChanged){
            setFormHasChanged(false);
            setErrorMessage('')
        }
    }

    async function fetchCNPJ() {
        if (formData.cnpj.length === 18) {
            try {
                const verify = await verifyCNPJ(formData.cnpj)
                if(verify === false){
                    setErrorMessage("O CNPJ informado pertence a outra conta");
                    setFormHasChanged(true);
                } 
                else if(verify === true) setErrorMessage('')
                return verify
            } catch (error) {
                console.error("Erro ao verificar CNPJ:", error);
            }
        }else if(formHasChanged){
            setFormHasChanged(false);
            setErrorMessage('')
        }
    }

    const validateFields = async (fields, message = 'Preencha os campos obrigatórios e corrija os erros antes de continuar') => {
        const hasError = fields.some(field => validateField(field, formData[field], true))

        if (fields.includes('cpf')) {
            const isCPFValid = await fetchCPF()
            if (!isCPFValid) return
        }

        if (fields.includes('cnpj')) {
            const isCNPJValid = await fetchCNPJ()
            console.log(isCNPJValid)
            if (!isCNPJValid) return
        }

        if(hasError) 
            setErrorMessage(message)
        else {
            setErrorMessage('')
            if (step < 4) {
                setStep(step + 1);
            } else {
                handleSubmit(); // envia dados backend e redireciona 
            }
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
                        fetchCNPJ={fetchCNPJ} fetchCPF={fetchCPF}
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
                    successModalOpen={successModalOpen} errorMessage={errorMessage} 
                    registerErrorMessage={registerErrorMessage} loading={loading}
                >
                    <RegisterStep4
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange} 
                    />
                </StepWrapper>
            )

        case 5:
            return null
    }
}


function StepWrapper({ children, goBackTo, validateFields, errorMessage, registerErrorMessage, loading, successModalOpen }) {
    const { setUser } = useAuth()
    const navigate = useNavigate();

    return (
        <div className="text-white w-full md:w-1/2 h-screen flex flex-col justify-between bg-(--purple-action) p-12 md:pl-25 mx-6 md:mx-0 md:rounded-l-[130px]">
            {registerErrorMessage && (
            <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                           transition-opacity duration-300">
                {registerErrorMessage}
            </div>
            )}
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
                                        onClick={validateFields}
                                        disabled={loading}>
                    {loading ? 'Carregando...' : 'CONTINUAR'}
                                        
                    </BtnCallToAction>
                </div>
                {errorMessage && <p className='text-center mt-2'>{errorMessage}</p>}
            </div>
            {successModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-(--purple-primary)">Cadastro concluído!</h2>
                <p className="mb-6 text-gray-700">Sua conta foi criada com sucesso.</p>
                <button 
                    onClick={() => {
                        const loggedUser = JSON.parse(localStorage.getItem('user'));
                        setUser(loggedUser);
                        navigate('/timeline')
                    }} 
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
                    Continuar
                </button>
                </div>
            </div>
            )}
        </div>
    )
}
