import { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Undo2 } from 'lucide-react'
import { register, verifyCNPJ, verifyCPF } from '../../../../services/authService';
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
        setRegisterErrorMessage('');
        try {
            await register(formData); 
            setSuccessModalOpen(true)
        } catch (err) {
            setRegisterErrorMessage(err.response?.data?.message || 'Não foi possível concluir o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    const handlePrevStep = () => {
        setErrorMessage('')
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
        if (loading) return
        const hasError = fields.some(field => validateField(field, formData[field], true))

        if (hasError) {
            setErrorMessage(message)
            return
        }

        if (fields.includes('senha_confirmada') && formData.senha !== formData.senha_confirmada) {
            setErrorMessage('As senhas não coincidem.')
            return
        }

        if (fields.includes('cpf') || fields.includes('cnpj')) {
            const isCPF = fields.includes('cpf')
            setLoading(true)
            const isAvailable = isCPF ? await fetchCPF() : await fetchCNPJ()
            setLoading(false)
            if (isAvailable === false) return
            if (isAvailable !== true) {
                setErrorMessage(`Não foi possível verificar o ${isCPF ? 'CPF' : 'CNPJ'} agora. Tente novamente em instantes.`)
                return
            }
        }

        setErrorMessage('')
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSubmit(); 
        }
    }

    switch (step) {
        case 1:
            return (
                <StepWrapper
                    step={step}
                    loading={loading}
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
                    step={step}
                    loading={loading}
                    goBackTo={handlePrevStep}
                    validateFields={() => {
                        if (formData.tipo_usuario === 'empresa')
                            return validateFields(['nome', 'cnpj', 'tipo_empresa', 'telefone'])
                        else
                            return validateFields(['nome', 'cpf', 'gender', 'data_nascimento', 'telefone'])
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
                    step={step}
                    loading={loading}
                    goBackTo={handlePrevStep}
                    validateFields={() =>
                        validateFields(['cep', 'rua', 'bairro', 'cidade', 'estado'])
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
                    step={step}
                    loading={loading}
                    goBackTo={handlePrevStep}
                    validateFields={() =>
                        validateFields(['email', 'senha', 'senha_confirmada'])
                    }
                    successModalOpen={successModalOpen} errorMessage={errorMessage} 
                    registerErrorMessage={registerErrorMessage}
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


function StepWrapper({ children, step, goBackTo, validateFields, errorMessage, registerErrorMessage, loading, successModalOpen }) {
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        contentRef.current?.focus();
    }, [step]);

    return (
        <form
            noValidate
            onSubmit={(e) => {
                e.preventDefault()
                validateFields()
            }}
            className="text-white w-full md:w-1/2 min-h-screen flex flex-col justify-between gap-4 bg-(--purple-action) px-6 py-8 sm:p-9 md:rounded-l-[130px]"
        >
            <div className='flex flex-wrap items-center justify-between gap-4 md:pl-10'>
                <button type="button"
                        className='flex gap-x-3 cursor-pointer rounded-sm transition duration-300 hover:-translate-x-1 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                        onClick={goBackTo}
                        aria-label={step > 1 ? 'Voltar para a etapa anterior' : 'Voltar para a página inicial'}>
                            <Undo2 aria-hidden="true"/>
                            <span className="hidden sm:block sm:mr-4">Voltar</span>
                </button>
                <Link to="/login"
                      className='text-base sm:text-lg w-fit ml-auto rounded-sm transition duration-300 hover:-translate-y-0.75 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
                    Já tenho uma conta!
                </Link>
            </div>

            <p className='text-center text-sm font-semibold tracking-wide' aria-live="polite">
                Etapa {step} de 4
            </p>

            <section ref={contentRef} tabIndex={-1} className="flex-1 flex flex-col justify-center py-3 w-full max-w-2xl mx-auto focus:outline-none">
                {children}
            </section>

            <div role="alert" aria-live="assertive" className="w-full max-w-2xl mx-auto">
                {errorMessage && <p className='text-center bg-red-700 rounded-md px-4 py-3'>{errorMessage}</p>}
                {registerErrorMessage && <p className='text-center bg-red-700 rounded-md px-4 py-3 mt-2'>{registerErrorMessage}</p>}
            </div>

            <div>
                <p className='text-center mb-3'>Preencha <strong>todas</strong> as fases para concluir seu cadastro. Campos com * são obrigatórios.</p>
                <div className='flex justify-center'>
                    <BtnCallToAction    variant="white" 
                                        type="submit"
                                        disabled={loading}>
                    {loading ? 'Carregando...' : step < 4 ? 'CONTINUAR' : 'CONCLUIR CADASTRO'}
                    </BtnCallToAction>
                </div>                
            </div>
            {successModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div role="dialog" aria-modal="true" aria-labelledby="cadastro-sucesso-titulo"
                         className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm">
                        <h2 id="cadastro-sucesso-titulo" className="text-2xl font-bold mb-4 text-(--purple-primary)">Cadastro concluído!</h2>
                        <p className="mb-6 text-gray-700">Sua conta foi criada com sucesso.</p>
                        <button 
                            type="button"
                            autoFocus
                            onClick={() => navigate('/login')}
                            className="bg-(--purple-primary) text-white px-6 py-2 rounded-xl hover:bg-(--purple-action) transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--purple-primary)">
                            Ir para o login
                        </button>
                    </div>
                </div>
            )}
        </form>
    )
}
