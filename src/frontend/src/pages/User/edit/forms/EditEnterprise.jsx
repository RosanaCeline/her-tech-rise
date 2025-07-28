import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import { validateField } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";
import LoadingSpinner from './../../../../components/LoadingSpinner/LoadingSpinner'

import { useAuth } from "../../../../context/AuthContext";
import { getAllProfile, updateProfile } from "../../../../services/userService";
import { useCepAutoComplete } from '../../../../services/hooks/useCepAutoComplete'

export default function EditEnterprise() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    descricao: '',
    sobrenos: '',
    link: '',
    tipoEmpresa: '',
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState({});
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const companyTypeOptions = [
    { value: '', label: 'Selecione o tipo de empresa' },
    { value: 'NACIONAL', label: 'Nacional' },
    { value: 'INTERNACIONAL', label: 'Internacional' },
  ];

  const ruaInput = useRef(null)
  const cidadeInput = useRef(null)
  const bairroInput = useRef(null)
  const estadoInput = useRef(null)

  const {estados} = useCepAutoComplete({cep: formData.cep, setFormData, refs: {
    rua: ruaInput,
    cidade: cidadeInput,
    bairro: bairroInput,
    estado: estadoInput
  }})

  const options = estados.map(estado => ({ value: estado, label: estado }));

  useEffect(() => {
      async function fetchProfile() {
        try {
          const user = await getAllProfile();
  
          const mappedForm = {
            nome: user.name || '',
            cnpj: user.cnpj || '',
            telefone: user.phoneNumber || '',
            email: user.email || '',
            cep: user.cep || '',
            rua: user.street || '',
            bairro: user.neighborhood || '',
            cidade: user.city || '',
            tipoEmpresa:user.companyType || '',
            descricao: user.description || '',
            sobrenos: user.aboutUs || '',
            link: user.externalLink || '',            
            handle: user.handle || '',
            estado: user.uf || '',
            photo: user.profilePic || '',
            id: user.id,
            profilePic: user.profilePic,
            followersCount: user.followersCount,
            posts: user.posts || [],
          };
          setFormData(mappedForm);
          setOriginalData(mappedForm);
        } catch (err) {
          console.error("Erro ao carregar dados da empresa:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;
    setFormData((prev) => ({ ...prev, [name]: maskedValue ?? '' }));

    if (name === 'cnpj') maskedValue = maskField('cnpj', value);
    if (name === 'telefone') maskedValue = maskField('telefone', value);
    if (name === 'cep') maskedValue = maskField('cep', value);

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handleCancelClick = (e) => {
    e.preventDefault(); 
    setCancelModalOpen(true);
  };

  const validateAllFields = () => {
    const requiredFields = {
      nome: 'texto',
      cnpj: 'cnpj',
      telefone: 'telefone',
      email: 'email',
      cep: 'cep',
      rua: 'texto',
      bairro: 'texto',
      cidade: 'texto',
      estado: 'texto',
      tipoEmpresa: 'texto',
    };

    let hasError = false;
    for (const campo in requiredFields) {
      const erro = validateField(requiredFields[campo], formData[campo], true);
      if (erro) {
        hasError = true;
        break;
      }
    }

    if (hasError) 
      setError('Preencha os campos obrigatórios e corrija os erros antes de continuar.');
    else
      setError('');

    return !hasError
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      const payload = {
        id: formData.id,
        name: formData.nome?.trim() || null,
        handle: formData.handle?.trim() || null,   
        cnpj: formData.cnpj.trim() || null,
        phoneNumber: formData.telefone?.trim() || null,
        city: formData.cidade?.trim() || null,
        uf: formData.estado?.trim() || null,  
        companyType: formData.tipoEmpresa?.trim() || null,  
        followersCount: formData.followersCount ?? 0,
        profilePic: formData.photo || null,    
        email: formData.email?.trim() || null,
        cep: formData.cep?.trim() || null,
        neighborhood: formData.bairro?.trim() || null,
        street: formData.rua?.trim() || null,
        description: formData.descricao.trim() || null,
        aboutUs: formData.sobrenos.trim() || null,
        externalLink: formData.link?.trim() || null, 
        posts: formData.posts ?? [],        
      };

      const updatedUser = await updateProfile(payload);
      setUser(updatedUser);
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Não foi possível atualizar o perfil.");
      setErrorModalOpen(true);
    }
  };

  if (loading) {
    <LoadingSpinner />
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      <article className="bg-[var(--gray)] p-6 mb-8 w-full max-w-4xl mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">INFORMAÇÕES EMPRESARIAIS</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">
          Mantenha os dados da sua empresa atualizados e fortaleça sua presença na plataforma.
        </p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl mx-auto">
          <LabelInput
            name="nome"
            label="Nome da Empresa:"
            value={formData.nome ?? ''}
            placeholder={formData.nome ? '' : originalData.nome ? originalData.nome : 'Informe o nome da empresa'}
            onChange={handleChange}
            required
            validation="texto"
          />

          <LabelInput
            name="cnpj"
            label="CNPJ:"
            value={formData.cnpj ?? ''}
            placeholder={originalData.cnpj ? '' : formData.cnpj ? originalData.cnpj : 'Digite seu CNPJ'}
            onChange={handleChange}
            required
            validation="cnpj"
            maxLength="18"
          />

          <LabelInput
            name="tipoEmpresa"
            label="Tipo de Empresa:"
            type="select"
            value={formData.tipoEmpresa}
            onChange={handleChange}
            required
            validation="texto"
            options={companyTypeOptions}
          />

          <LabelInput
            name="telefone"
            label="Telefone:"
            value={formData.telefone ?? ''}
            placeholder={originalData.telefone ? '' : formData.telefone ? originalData.telefone : ''}
            onChange={handleChange}
            required
            validation="telefone"
            maxLength="15"
          />

          <LabelInput
            name="email"
            label="Email de Contato:"
            value={formData.email ?? ''}
            placeholder={originalData.email ? '' : formData.email ? originalData.email : 'Digite seu e-mail'}
            onChange={handleChange}
            required
            validation="email"
          />

          <LabelInput
            name="cep"
            label="CEP:"
            value={formData.cep ?? ''}
            placeholder={originalData.cep ? '' : formData.cep ? originalData.cep : 'Digite seu CEP'}
            onChange={handleChange}
            required
            validation="cep"
            maxLength="9"
          />

          <LabelInput
            name="rua"
            label="Rua:"
            ref={ruaInput}
            value={formData.rua ?? ''}
            placeholder={originalData.rua ? '' : formData.rua ? originalData.rua : 'Digite o nome da sua rua'}
            onChange={handleChange}
            required
            validation="texto"
          />

          <LabelInput
            name="bairro"
            label="Bairro:"
            ref={bairroInput}
            value={formData.bairro  ?? ''}
            placeholder={originalData.bairro ? '' : formData.bairro ? originalData.bairro : 'Digite o nome do seu bairro'}
            onChange={handleChange}
            required
            validation="texto"
          />

          <LabelInput
            name="cidade"
            label="Cidade:"
            ref={cidadeInput}
            value={formData.cidade ?? ''}
            placeholder={originalData.cidade ? '' : formData.cidade ? originalData.cidade : 'Digite o nome da sua cidade'}
            onChange={handleChange}
            required
            validation="texto"
          />

          <LabelInput
            name="estado"
            label="Estado:"
            ref={estadoInput}
            value={formData.estado ?? ''}
            placeholder={originalData.estado ? '' : formData.estado ? originalData.estado: ''}
            onChange={handleChange}
            required
            validation="texto"
            type="select"
            options={options}
          />
        </div>
      </article>

      <article className="bg-[var(--gray)] p-6 w-full max-w-4xl mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">PERFIL CORPORATIVO</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">
          Compartilhe a missão da sua empresa e mostre sua cultura organizacional.
        </p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl mx-auto">
          <LabelInput
            name="descricao"
            label="Descrição:"
            value={formData.descricao ?? ''}
            placeholder={originalData.descricao ? '' : formData.descricao ? originalData.descricao : 'Digite sua área de atuação e etc...'}
            onChange={handleChange}
            validation="texto"
          />

          <LabelInput
            name="sobrenos"
            label="Sobre nós:"
            type="mensagem"
            value={formData.sobrenos ?? ''}
            placeholder={originalData.sobrenos ? '' : formData.sobrenos ? originalData.sobrenos : 'Descreva um pouco sobre sua empresa'}
            onChange={handleChange}
            required
            validation="texto"
          />

          <LabelInput
            name="link"
            label="Link externo:"
            value={formData.link ?? ''}
            placeholder={originalData.link ? '' : formData.link ? originalData.link : 'https://suaempresa.com'}
            onChange={handleChange}
            validation="url"
          />
        </div>
      </article>

      <div className="mx-auto mt-4 flex gap-4 justify-center">
        <BtnCallToAction type="button" variant="white" onClick={handleCancelClick}>
          CANCELAR
        </BtnCallToAction>
        <BtnCallToAction type="submit" variant="purple">
          SALVAR
        </BtnCallToAction>
      </div>
    </form>
    {successModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">
              Cadastro concluído!
            </h2>
            <p className="mb-6 text-gray-700">Sua conta foi atualizada com sucesso.</p>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate("/timeline"); 
              }}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      {errorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Erro ao atualizar perfil</h2>
            <p className="mb-6 text-gray-700">{errorMessage}</p>
            <button
              onClick={() => setErrorModalOpen(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">
              Confirmar Cancelamento
            </h2>
            <p className="mb-6 text-gray-700">Tem certeza que deseja cancelar? As alterações não serão salvas.</p>
            <div className="flex justify-center gap-6">
              <button
                  onClick={() => setCancelModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Não
              </button>
              <button
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate("/timeline"); 
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                        transition-opacity duration-300">
            {error}
        </div>
      )}
    </>
  );
}