import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';

import CardExperienceItem from '../../../../components/Cards/Profile/CardExperienceItem';
import FormAddExperience from "../../../../components/Cards/Profile/FormAddExperience";
import FormEditExperience from "../../../../components/Cards/Profile/FormEditExperience";
import PopUpBlurProfile from "../../../../components/Cards/Profile/PopUpBlurProfile";
import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import { validateField } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";

import { useAuth } from "../../../../context/AuthContext";
import { getAllProfile, updateProfile } from "../../../../services/userService";

export default function EditProfessional() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    data_nascimento: '',
    email: '',
    tecnologias: '',
    biografia: '',
    link: '',
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState(null);

  const [addExperienceOpen, setAddExperienceOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getAllProfile();

        const mappedForm = {
          nome: user.name || '',
          handle: user.handle || '',
          cpf: user.cpf || '',
          data_nascimento: user.birthDate ? user.birthDate.split('-').reverse().join('/') : '',
          telefone: user.phoneNumber || '',
          rua: user.street || '',
          bairro: user.neighborhood || '',
          cidade: user.city || '',
          estado: user.uf || '',
          cep: user.cep || '',
          email: user.email || '',
          tecnologias: user.technology || '',
          biografia: user.biography || '',
          link: user.externalLink || '',
          photo: user.profilePic || '',
          id: user.id,
          profilePic: user.profilePic,
          followersCount: user.followersCount,
          posts: user.posts || [],
          experiences: user.experiences || [],
        };
        setFormData(mappedForm);
        setOriginalUser(mappedForm);
        console.log(mappedForm)
      } catch (err) {
        console.error("Erro ao carregar dados do profissional:", err);
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

    if (name === 'cpf') maskedValue = maskField('cpf', value);
    if (name === 'telefone') maskedValue = maskField('telefone', value);
    if (name === 'cep') maskedValue = maskField('cep', value);
    if (name === 'data_nascimento') maskedValue = maskField('data', value);

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCancelClick = (e) => {
    e.preventDefault(); 
    setCancelModalOpen(true);
  };

  const validateAllFields = () => {
    const camposObrigatorios = {
      nome: 'texto',
      cpf: 'cpf',
      telefone: 'telefone',
      rua: 'texto',
      bairro: 'texto',
      cidade: 'texto',
      estado: 'texto',
      cep: 'cep',
      data_nascimento: 'data',
      email: 'email',
    };

    const newErrors = {};
    for (let campo in camposObrigatorios) {
      const erro = validateField(camposObrigatorios[campo], formData[campo], true);
      if (erro) newErrors[campo] = erro;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      const finalData = {
        id: formData.id,
        name: formData.nome?.trim() || null,
        handle: formData.handle?.trim() || null,
        cpf: formData.cpf?.trim() || null,
        birthDate: formData.data_nascimento.trim() || null,
        phoneNumber: formData.telefone?.trim() || null,
        city: formData.cidade?.trim() || null,
        uf: formData.estado?.trim() || null,
        followersCount: formData.followersCount ?? 0,
        profilePic: formData.photo || null,
        email: formData.email?.trim() || null,
        cep: formData.cep?.trim() || null,
        neighborhood: formData.bairro?.trim() || null,
        street: formData.rua?.trim() || null,
        technology: formData.tecnologias?.trim() || null,
        biography: formData.biografia?.trim() || null,
        experiences: formData.experiences ?? [],
        externalLink: formData.link?.trim() || null,
        posts: formData.posts ?? [],
      };

      console.log("Dados enviados para o backend:", finalData);
      const updatedUser = await updateProfile(finalData);
      setUser(updatedUser);
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Não foi possível atualizar o perfil.");
      setErrorModalOpen(true);
    }
  };

  if (loading) {
    return <p className="text-[var(--gray)]">Carregando dados...</p>;
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Informações Pessoais */}
      <article className="bg-[var(--gray)] p-6 mb-8 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">INFORMAÇÕES PESSOAIS</h2>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          <LabelInput
            label="Nome:"
            name="nome"
            value={formData.nome ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Digite seu nome completo"
          />

          <LabelInput
            label="CPF:"
            name="cpf"
            value={formData.cpf ?? ''}
            onChange={handleChange}
            required
            validation="cpf"
            maxLength="14"
            placeholder="000.000.000-00"
          />

          <LabelInput
            label="Data de Nascimento:"
            name="data_nascimento"
            value={formData.data_nascimento ?? ''}
            onChange={handleChange}
            required
            validation="data"
            placeholder="dd/mm/aaaa"
          />

          <LabelInput
            label="Telefone:"
            name="telefone"
            value={formData.telefone ?? ''}
            onChange={handleChange}
            required
            validation="telefone"
            maxLength="15"
            placeholder="(99) 99999-9999"
          />

          <LabelInput
            label="Email:"
            name="email"
            value={formData.email ?? ''}
            onChange={handleChange}
            required
            validation="email"
            placeholder="email@exemplo.com"
          />

          <LabelInput
            label="CEP:"
            name="cep"
            value={formData.cep ?? ''}
            onChange={handleChange}
            required
            validation="cep"
            placeholder="00000-000"
          />

          <LabelInput
            label="Rua:"
            name="rua"
            value={formData.rua ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Nome da rua"
          />

          <LabelInput
            label="Bairro:"
            name="bairro"
            value={formData.bairro ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Bairro"
          />

          <LabelInput
            label="Cidade:"
            name="cidade"
            value={formData.cidade ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Sua cidade"
          />

          <LabelInput
            label="Estado:"
            name="estado"
            value={formData.estado ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Seu estado"
          />
        </div>
      </article>

      {/* Tecnologias e Biografia */}
      <article className="bg-[var(--gray)] p-6 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">TRAJETÓRIA E HABILIDADES</h2>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          <LabelInput
            label="Tecnologias:"
            name="tecnologias"
            value={formData.tecnologias ?? ''}
            onChange={handleChange}
            validation="texto"
            placeholder="Ex: React, Node.js, Java"
          />

          <LabelInput
            label="Biografia:"
            name="biografia"
            type="mensagem"
            value={formData.biografia ?? ''}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Conte um pouco sobre sua trajetória"
          />

          <label className="block text-[#303F3C] font-sm text-base text-left">
            Experiencias:
          </label>
          <div className="flex flex-col gap-4">
            {formData.experiences.length > 0 ? (
              formData.experiences.map((exp, idx) => (
                <CardExperienceItem
                  key={idx}
                  experience={exp}
                  onEdit={() => {
                    setEditingExperience(exp);
                    setAddExperienceOpen(true);
                  }}
                  onDelete={() => {
                    setFormData((prev) => ({
                      ...prev,
                      experiences: prev.experiences.filter((e) => e !== exp),
                    }));
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-[#55618C]/60">Nenhuma experiência adicionada.</p>
            )}
          </div>

          <button type="button"
                  onClick={() => {
                    setEditingExperience(null);
                    setAddExperienceOpen(true);
                  }}
                  className="flex items-center justify-end w-10 h-10 rounded-full text-[#55618C] transition"
                  title="Adicionar experiência"
            >
              <Plus size={20} />
            </button>

          <LabelInput
            label="Link externo:"
            name="link"
            value={formData.link ?? ''}
            onChange={handleChange}
            validation="url"
            placeholder="https://github.com/seu-perfil"
          />
        </div>
      </article>

      <div className="mx-auto mt-6 flex gap-4 justify-center">
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
      {addExperienceOpen && (
        <PopUpBlurProfile
          isOpen={addExperienceOpen}
          onClose={() => setAddExperienceOpen(false)}
          content={
            editingExperience ? (
              <FormEditExperience
                experience={editingExperience}
                onUpdate={(updatedExp) => {
                  setFormData((prev) => ({
                    ...prev,
                    experiences: prev.experiences.map((e) =>
                      e === editingExperience ? updatedExp : e
                    ),
                  }));
                  setEditingExperience(null);
                }}
                onClose={() => setAddExperienceOpen(false)}
              />
            ) : (
              <FormAddExperience
                onSave={(newExp) => {
                  setFormData((prev) => ({
                    ...prev,
                    experiences: [...prev.experiences, newExp],
                  }));
                  setAddExperienceOpen(false);
                }}
                onClose={() => setAddExperienceOpen(false)}
              />
            )
          }
        />
      )}
    </>
  );
}