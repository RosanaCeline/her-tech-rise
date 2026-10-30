import { useState, useEffect, useRef, useCallback } from "react";

import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import LoadingSpinner from './../../../../components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

import { normalizeUrl } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";
import { validateForm, focusFirstError, errorSummary } from "../../../../components/form/validateForm";
import { useAuth } from "../../../../context/AuthContext";
import { getAllProfile, updateProfile } from "../../../../services/userService";
import { updateStoredUser } from "../../../../services/authService";
import { useCepAutoComplete } from '../../../../services/hooks/useCepAutoComplete'
import { getErrorMessage } from '../../../../services/errorMessage';

// ordem = ordem visual, para o foco ir ao primeiro erro de cima para baixo
const RULES = {
  nome: { type: 'texto', label: 'Nome da empresa' },
  cnpj: { type: 'cnpj', label: 'CNPJ' },
  tipoEmpresa: { type: 'select', label: 'Tipo de empresa' },
  telefone: { type: 'telefone', label: 'Telefone' },
  email: { type: 'email', label: 'Email de contato' },
  cep: { type: 'cep', label: 'CEP' },
  estado: { type: 'select', label: 'Estado' },
  rua: { type: 'texto', label: 'Rua' },
  bairro: { type: 'texto', label: 'Bairro' },
  cidade: { type: 'texto', label: 'Cidade' },
  descricao: { type: '', label: 'Descrição', required: false },
  sobrenos: { type: '', label: 'Sobre nós', required: false },
  link: { type: 'url', label: 'Link externo', required: false },
};

const ADDRESS_FIELDS = ['rua', 'bairro', 'cidade', 'estado'];

const companyTypeOptions = [
  { value: 'NACIONAL', label: 'Nacional' },
  { value: 'INTERNACIONAL', label: 'Internacional' },
];

function mapProfileToForm(profile) {
  return {
    id: profile.id,
    nome: profile.name || '',
    handle: profile.handle || '',
    cnpj: profile.cnpj || '',
    // telefones antigos podem estar sem pontuação: a máscara padroniza
    telefone: maskField('telefone', profile.phoneNumber || ''),
    email: profile.email || '',
    cep: profile.cep || '',
    rua: profile.street || '',
    bairro: profile.neighborhood || '',
    cidade: profile.city || '',
    estado: profile.uf || '',
    tipoEmpresa: profile.companyType || '',
    descricao: profile.description || '',
    sobrenos: profile.aboutUs || '',
    link: profile.externalLink || '',
    photo: profile.profilePic || '',
    followersCount: profile.followersCount,
    posts: profile.posts || [],
  };
}

export default function EditEnterprise({ onClose, onSaved }) {
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
      console.error("Erro ao carregar dados da empresa:", err);
      setStatus('error');
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (status === 'loading') return <LoadingSpinner />

  // sem os dados atuais não mostramos o formulário: salvar campos vazios apagaria o perfil
  if (status === 'error') {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-gray-600">Não foi possível carregar os dados da empresa.</p>
        <BtnCallToAction onClick={fetchProfile}>TENTAR NOVAMENTE</BtnCallToAction>
      </div>
    );
  }

  return <EnterpriseForm initial={initial} onClose={onClose} onSaved={onSaved} />;
}

// montado só com os dados carregados: assim o CEP salvo não dispara a busca e não sobrescreve o endereço
function EnterpriseForm({ initial, onClose, onSaved }) {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const initialData = useRef(JSON.stringify(initial));
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'cnpj') newValue = maskField('cnpj', value);
    if (name === 'telefone') newValue = maskField('telefone', value);
    if (name === 'cep') newValue = maskField('cep', value);

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSubmitError('');
  };

  const handleCancelClick = () => {
    if (JSON.stringify(formData) !== initialData.current) setCancelModalOpen(true);
    else onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validateForm(RULES, formData);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found, Object.keys(RULES));
      return;
    }

    setSaving(true);
    setSubmitError('');
    try {
      const payload = {
        id: formData.id,
        name: formData.nome.trim(),
        handle: formData.handle?.trim() || null,
        cnpj: formData.cnpj.trim(),
        phoneNumber: formData.telefone.trim(),
        city: formData.cidade.trim(),
        uf: formData.estado.trim(),
        companyType: formData.tipoEmpresa,
        followersCount: formData.followersCount ?? 0,
        profilePic: formData.photo || null,
        email: formData.email.trim(),
        cep: formData.cep.trim(),
        neighborhood: formData.bairro.trim(),
        street: formData.rua.trim(),
        description: formData.descricao.trim() || null,
        aboutUs: formData.sobrenos.trim() || null,
        externalLink: normalizeUrl(formData.link) || null,
        posts: formData.posts,
      };

      await updateProfile(payload);
      updateStoredUser({ name: payload.name });
      // mescla em vez de substituir: a resposta do perfil não traz token nem role
      setUser((prev) => (prev ? { ...prev, name: payload.name } : prev));
      initialData.current = JSON.stringify(formData);
      onSaved?.();
    } catch (err) {
      console.error(err);
      setSubmitError(getErrorMessage(err, "As alterações não foram salvas."));
    } finally {
      setSaving(false);
    }
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

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-8 min-w-0">
        <p className="text-sm text-[var(--font-gray)]">Campos com * são obrigatórios.</p>

        <article className="bg-[var(--gray)] p-4 sm:p-8 w-full max-w-4xl mx-auto rounded-2xl min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--purple-secundary)]">INFORMAÇÕES EMPRESARIAIS</h2>
          <p className="mt-2 text-sm sm:text-lg max-w-xl text-[var(--font-gray)]">
            Mantenha os dados da sua empresa atualizados e fortaleça sua presença na plataforma.
          </p>

          <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="sm:col-span-2">
              <LabelInput {...fieldProps('nome')} label="Nome da empresa:" required validation="texto"
                autoComplete="organization" maxLength="150" placeholder="Informe o nome da empresa" />
            </div>

            <LabelInput {...fieldProps('cnpj')} label="CNPJ:" required validation="cnpj"
              inputMode="numeric" maxLength="18" placeholder="00.000.000/0000-00" />

            <LabelInput {...fieldProps('tipoEmpresa')} label="Tipo de empresa:" type="select" required
              validation="select" options={companyTypeOptions} />

            <LabelInput {...fieldProps('telefone')} label="Telefone:" type="tel" required validation="telefone"
              autoComplete="tel-national" maxLength="20" placeholder="(99) 99999-9999" />

            <LabelInput {...fieldProps('email')} label="Email de contato:" type="email" required validation="email"
              autoComplete="email" maxLength="255" placeholder="contato@empresa.com" />

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
              autoComplete="address-level2" maxLength="100" placeholder="Cidade" />
          </div>
        </article>

        <article className="bg-[var(--gray)] p-4 sm:p-8 w-full max-w-4xl mx-auto rounded-2xl min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--purple-secundary)]">PERFIL CORPORATIVO</h2>
          <p className="mt-2 text-sm sm:text-lg max-w-xl text-[var(--font-gray)]">
            Compartilhe a missão da sua empresa e mostre sua cultura organizacional.
          </p>

          <div className="w-full mt-4 grid gap-3 sm:gap-4 max-w-2xl mx-auto min-w-0">
            <div>
              <LabelInput {...fieldProps('descricao')} label="Descrição:" maxLength="400"
                placeholder="Área de atuação, produtos, serviços..." />
              <p className="mt-1 text-xs text-right text-gray-500">{formData.descricao.length}/400</p>
            </div>

            <div>
              <LabelInput {...fieldProps('sobrenos')} label="Sobre nós:" type="mensagem" maxLength="1000"
                placeholder="Descreva um pouco sobre sua empresa" />
              <p className="mt-1 text-xs text-right text-gray-500">{formData.sobrenos.length}/1000</p>
            </div>

            <LabelInput {...fieldProps('link')} label="Link externo:" validation="url" maxLength="100"
              autoComplete="url" placeholder="https://suaempresa.com" />
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
    </>
  );
}
