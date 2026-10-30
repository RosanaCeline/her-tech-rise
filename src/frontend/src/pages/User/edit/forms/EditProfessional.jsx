import { useState, useEffect, useRef, useCallback } from "react";
import { Plus } from 'lucide-react';

import CardExperienceItem from '../../../../components/Cards/Profile/CardExperienceItem';
import FormExperience from "../../../../components/Cards/Profile/FormExperience";
import PopUpBlurProfile from "../../../../components/Cards/Profile/PopUpBlurProfile";
import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import LoadingSpinner from './../../../../components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

import { normalizeUrl } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";
import { validateForm, focusFirstError, errorSummary } from "../../../../components/form/validateForm";
import { useCepAutoComplete } from '../../../../services/hooks/useCepAutoComplete'
import { useAuth } from "../../../../context/AuthContext";
import { getAllProfile, updateProfile } from "../../../../services/userService";
import { updateGender, updateStoredUser } from "../../../../services/authService";
import { getErrorMessage } from '../../../../services/errorMessage';

const MAX_EXPERIENCES = 20;

// ordem = ordem visual, para o foco ir ao primeiro erro de cima para baixo
const RULES = {
  nome: { type: 'texto', label: 'Nome' },
  cpf: { type: 'cpf', label: 'CPF' },
  data_nascimento: { type: 'data', label: 'Data de nascimento' },
  gender: { type: 'select', label: 'Identidade de gênero' },
  telefone: { type: 'telefone', label: 'Telefone' },
  email: { type: 'email', label: 'Email' },
  cep: { type: 'cep', label: 'CEP' },
  rua: { type: 'texto', label: 'Rua' },
  bairro: { type: 'texto', label: 'Bairro' },
  cidade: { type: 'texto', label: 'Cidade' },
  estado: { type: 'select', label: 'Estado' },
  tecnologias: { type: '', label: 'Tecnologias', required: false },
  biografia: { type: '', label: 'Biografia', required: false },
  link: { type: 'url', label: 'Link externo', required: false },
};

const ADDRESS_FIELDS = ['rua', 'bairro', 'cidade', 'estado'];

const genderOptions = [
  { value: 'MULHER', label: 'Mulher' },
  { value: 'HOMEM', label: 'Homem' },
  { value: 'PESSOA_NAO_BINARIA', label: 'Pessoa não binária' },
  { value: 'OUTRO', label: 'Outro' },
  { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
];

function mapProfileToForm(profile) {
  return {
    id: profile.id,
    nome: profile.name || '',
    handle: profile.handle || '',
    cpf: profile.cpf || '',
    data_nascimento: profile.birthDate ? profile.birthDate.split('-').reverse().join('/') : '',
    // telefones antigos podem estar sem pontuação: a máscara padroniza
    telefone: maskField('telefone', profile.phoneNumber || ''),
    rua: profile.street || '',
    bairro: profile.neighborhood || '',
    cidade: profile.city || '',
    estado: profile.uf || '',
    cep: profile.cep || '',
    email: profile.email || '',
    gender: profile.gender || '',
    consentGenderSharing: !!profile.consentGenderSharing,
    tecnologias: profile.technology || '',
    biografia: profile.biography || '',
    link: profile.externalLink || '',
    photo: profile.profilePic || '',
    followersCount: profile.followersCount,
    posts: profile.posts || [],
    experiences: profile.experiences || [],
  };
}

export default function EditProfessional({ onClose, onSaved }) {
  const [initial, setInitial] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const fetchProfile = useCallback(async () => {
    setStatus('loading');
    try {
      const profile = await getAllProfile();
      if (!profile) throw new Error('Perfil não encontrado');
      setInitial(mapProfileToForm(profile));
      setStatus('ready');
    } catch (err) {
      console.error("Erro ao carregar dados do profissional:", err);
      setStatus('error');
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (status === 'loading') return <LoadingSpinner />

  // sem os dados atuais não mostramos o formulário: salvar campos vazios apagaria o perfil
  if (status === 'error') {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-gray-600">Não foi possível carregar seus dados.</p>
        <BtnCallToAction onClick={fetchProfile}>TENTAR NOVAMENTE</BtnCallToAction>
      </div>
    );
  }

  return <ProfessionalForm initial={initial} onClose={onClose} onSaved={onSaved} />;
}

// montado só com os dados carregados: assim o CEP salvo não dispara a busca e não sobrescreve o endereço
function ProfessionalForm({ initial, onClose, onSaved }) {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const initialData = useRef(JSON.stringify(initial));
  const original = useRef({ gender: initial.gender, consentGenderSharing: initial.consentGenderSharing });

  // null = fechado; -1 = adicionar; >= 0 = índice da experiência em edição
  const [experienceIndex, setExperienceIndex] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [genderChangeWarning, setGenderChangeWarning] = useState(false);

  const { estados, status: cepStatus } = useCepAutoComplete({ cep: formData.cep, setFormData });
  const stateOptions = estados.map(estado => ({ value: estado, label: estado }));

  // endereço preenchido pelo CEP: os avisos desses campos deixam de valer
  useEffect(() => {
    if (cepStatus !== 'found') return;
    setErrors((prev) => {
      const next = { ...prev };
      ADDRESS_FIELDS.forEach((field) => delete next[field]);
      return next;
    });
  }, [cepStatus]);

  const clearError = (name) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'cpf') newValue = maskField('cpf', value);
    if (name === 'telefone') newValue = maskField('telefone', value);
    if (name === 'cep') newValue = maskField('cep', value);
    if (name === 'data_nascimento') newValue = maskField('data', value);
    if (name === 'consentGenderSharing') newValue = e.target.checked;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    clearError(name);
    setSubmitError('');
  };

  const isDirty = () => JSON.stringify(formData) !== initialData.current;

  const handleCancelClick = () => {
    if (isDirty()) setCancelModalOpen(true);
    else onClose?.();
  };

  const save = async () => {
    setSaving(true);
    setSubmitError('');
    try {
      const finalData = {
        id: formData.id,
        name: formData.nome.trim(),
        handle: formData.handle?.trim() || null,
        cpf: formData.cpf.trim(),
        birthDate: formData.data_nascimento.trim(),
        phoneNumber: formData.telefone.trim(),
        city: formData.cidade.trim(),
        uf: formData.estado.trim(),
        followersCount: formData.followersCount ?? 0,
        profilePic: formData.photo || null,
        email: formData.email.trim(),
        cep: formData.cep.trim(),
        neighborhood: formData.bairro.trim(),
        street: formData.rua.trim(),
        technology: formData.tecnologias.trim() || null,
        biography: formData.biografia.trim() || null,
        experiences: formData.experiences,
        externalLink: normalizeUrl(formData.link) || null,
        posts: formData.posts,
        gender: formData.gender || null,
        consentGenderSharing: formData.consentGenderSharing,
      };

      await updateProfile(finalData);

      // só atualiza a sessão local depois que o servidor confirmou
      if (finalData.gender !== original.current.gender || finalData.consentGenderSharing !== original.current.consentGenderSharing) {
        updateGender(finalData.gender, finalData.consentGenderSharing);
      }
      updateStoredUser({ name: finalData.name });
      // mescla em vez de substituir: a resposta do perfil não traz token nem role
      setUser((prev) => (prev ? { ...prev, name: finalData.name } : prev));

      initialData.current = JSON.stringify(formData);
      original.current = { gender: finalData.gender, consentGenderSharing: finalData.consentGenderSharing };
      onSaved?.();
    } catch (err) {
      console.error(err);
      setSubmitError(getErrorMessage(err, "As alterações não foram salvas."));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (saving) return;

    const found = validateForm(RULES, formData);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found, Object.keys(RULES));
      return;
    }

    if (formData.gender !== original.current.gender) {
      setGenderChangeWarning(true);
      return;
    }
    save();
  };

  const handleSaveExperience = (experience) => {
    setFormData((prev) => ({
      ...prev,
      experiences: experienceIndex >= 0
        ? prev.experiences.map((item, idx) => (idx === experienceIndex ? experience : item))
        : [...prev.experiences, experience],
    }));
    setExperienceIndex(null);
  };

  const handleDeleteExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, idx) => idx !== index),
    }));
  };

  const fieldProps = (name) => ({
    theme: 'black',
    errorTheme: 'dark',
    name,
    value: formData[name] ?? '',
    onChange: handleChange,
    error: errors[name],
  });

  // resumo vivo: some sozinho conforme os campos são corrigidos
  const summary = errorSummary(errors, RULES);
  const canAddExperience = formData.experiences.length < MAX_EXPERIENCES;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-8 min-w-0">
        <p className="text-sm text-[var(--font-gray)]">Campos com * são obrigatórios.</p>

        {/* Informações Pessoais */}
        <article className="bg-[var(--gray)] p-4 sm:p-8 w-full max-w-4xl mx-auto rounded-2xl min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--purple-secundary)]">INFORMAÇÕES PESSOAIS</h2>

          <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="sm:col-span-2">
              <LabelInput {...fieldProps('nome')} label="Nome:" required validation="texto"
                autoComplete="name" maxLength="150" placeholder="Digite seu nome completo" />
            </div>

            <LabelInput {...fieldProps('cpf')} label="CPF:" required validation="cpf"
              inputMode="numeric" maxLength="14" placeholder="000.000.000-00" />

            <LabelInput {...fieldProps('data_nascimento')} label="Data de nascimento:" required validation="data"
              inputMode="numeric" autoComplete="bday" maxLength="10" placeholder="dd/mm/aaaa" />

            <div className="sm:col-span-2">
              <LabelInput {...fieldProps('gender')} label="Você se identifica como:" required type="select"
                validation="select" options={genderOptions} />
            </div>

            <div className="sm:col-span-2">
              <LabelInput theme='black' errorTheme="dark" type="checkbox" name='consentGenderSharing'
                value={!!formData.consentGenderSharing} onChange={handleChange}
                label="Autorizo que meu gênero seja compartilhado com empresas nas candidaturas a vagas, para apoiar ações afirmativas e promover diversidade." />
            </div>

            <LabelInput {...fieldProps('telefone')} label="Telefone:" type="tel" required validation="telefone"
              autoComplete="tel-national" maxLength="20" placeholder="(99) 99999-9999" />

            <LabelInput {...fieldProps('email')} label="Email:" type="email" required validation="email"
              autoComplete="email" maxLength="255" placeholder="email@exemplo.com" />

            <LabelInput {...fieldProps('cep')} label="CEP:" required validation="cep"
              inputMode="numeric" autoComplete="postal-code" maxLength="9" placeholder="00000-000"
              hint={cepStatus === 'notFound' ? 'CEP não encontrado. Preencha o endereço.'
                : cepStatus === 'error' ? 'Não foi possível buscar o CEP. Preencha o endereço.' : ''} />

            <LabelInput {...fieldProps('estado')} label="Estado:" type="select" options={stateOptions}
              required validation="select" />

            <div className="sm:col-span-2">
              <LabelInput {...fieldProps('rua')} label="Rua:" required validation="texto"
                autoComplete="address-line1" maxLength="100" placeholder="Nome da rua" />
            </div>

            <LabelInput {...fieldProps('bairro')} label="Bairro:" required validation="texto"
              maxLength="100" placeholder="Bairro" />

            <LabelInput {...fieldProps('cidade')} label="Cidade:" required validation="texto"
              autoComplete="address-level2" maxLength="100" placeholder="Sua cidade" />
          </div>
        </article>

        {/* Tecnologias e Biografia */}
        <article className="bg-[var(--gray)] p-4 sm:p-8 w-full max-w-4xl mx-auto rounded-2xl min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--purple-secundary)]">TRAJETÓRIA E HABILIDADES</h2>

          <div className="w-full mt-4 grid gap-3 sm:gap-4 max-w-2xl mx-auto min-w-0">
            <LabelInput {...fieldProps('tecnologias')} label="Tecnologias:" maxLength="80"
              placeholder="Ex: React, Node.js, Java" />

            <div>
              <LabelInput {...fieldProps('biografia')} label="Biografia:" type="mensagem" maxLength="1000"
                placeholder="Conte um pouco sobre sua trajetória" />
              <p className="mt-1 text-xs text-right text-gray-500">{formData.biografia.length}/1000</p>
            </div>

            <section aria-labelledby="experiencias-titulo" className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 id="experiencias-titulo" className="text-[#303F3C] text-base">Experiências:</h3>
                <button
                  type="button"
                  onClick={() => setExperienceIndex(-1)}
                  disabled={!canAddExperience}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#55618C] bg-white shadow-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} aria-hidden="true" />
                  Adicionar experiência
                </button>
              </div>

              {formData.experiences.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {formData.experiences.map((exp, idx) => (
                    <li key={exp.id ?? `nova-${idx}`}>
                      <CardExperienceItem
                        experience={exp}
                        onEdit={() => setExperienceIndex(idx)}
                        onDelete={() => handleDeleteExperience(idx)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#55618C]/80">Nenhuma experiência adicionada.</p>
              )}
              {!canAddExperience && (
                <p className="text-xs text-gray-500">Limite de {MAX_EXPERIENCES} experiências atingido.</p>
              )}
            </section>

            <LabelInput {...fieldProps('link')} label="Link externo:" validation="url" type="url" maxLength="100"
              autoComplete="url" placeholder="https://github.com/seu-perfil" />
          </div>
        </article>

        {summary || submitError ? (
          <p role="alert" className="max-w-2xl w-full mx-auto rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 break-words">
            {submitError || summary}
          </p>
        ) : null}

        <div className="w-full sm:w-auto sm:mx-auto flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center">
          <BtnCallToAction type="button" variant="white" onClick={handleCancelClick} disabled={saving}>
            CANCELAR
          </BtnCallToAction>
          <BtnCallToAction type="submit" variant="purple" disabled={saving} aria-busy={saving || undefined}>
            {saving ? 'SALVANDO...' : 'SALVAR'}
          </BtnCallToAction>
        </div>
      </form>

      <PopUpBlurProfile
        isOpen={experienceIndex !== null}
        onClose={() => setExperienceIndex(null)}
        ariaLabel={experienceIndex >= 0 ? 'Editar experiência' : 'Adicionar experiência'}
        content={experienceIndex !== null && (
          <FormExperience
            key={experienceIndex}
            experience={experienceIndex >= 0 ? formData.experiences[experienceIndex] : null}
            onSave={handleSaveExperience}
            onClose={() => setExperienceIndex(null)}
          />
        )}
      />


      <ConfirmModal
        open={cancelModalOpen}
        title="Descartar alterações?"
        message="Você tem alterações que ainda não foram salvas. Se sair agora, elas serão perdidas."
        confirmText="Descartar"
        cancelText="Continuar editando"
        onConfirm={() => {
          setCancelModalOpen(false);
          onClose?.();
        }}
        onCancel={() => setCancelModalOpen(false)}
      />

      <ConfirmModal
        open={genderChangeWarning}
        title="Alteração de dados de identidade de gênero"
        message="Esta plataforma é dedicada a mulheres na tecnologia. Por favor, edite sua identidade de gênero apenas se você realmente se identifica como mulher. Isso nos ajuda a manter um espaço seguro e coerente com nossa missão."
        confirmText="Desejo alterar minha identidade de gênero"
        cancelText="Voltar"
        onConfirm={() => {
          setGenderChangeWarning(false);
          save();
        }}
        onCancel={() => setGenderChangeWarning(false)}
      />
    </>
  );
}
