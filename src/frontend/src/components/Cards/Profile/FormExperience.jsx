import { useId, useState } from "react";
import LabelInput from "../../form/Label/LabelInput";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";
import { maskField } from "../../form/Label/maskField";
import { focusFirstError } from "../../form/validateForm";

// limites das colunas da tabela experience
const LIMITS = { titulo: 100, empresa: 150, modalidade: 30, descricao: 1000 };

const FIELD_ORDER = ['exp_titulo', 'exp_empresa', 'exp_modalidade', 'exp_dataInicio', 'exp_dataFim'];

function isoToBR(dateStr) {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = String(dateStr).split('-');
  return yyyy && mm && dd ? `${dd.slice(0, 2)}/${mm}/${yyyy}` : '';
}

// "dd/mm/aaaa" -> Date local, ou null se a data não existir (ex.: 31/02/2024)
function parseBR(dateStr) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr ?? '');
  if (!match) return null;
  const [, dd, mm, yyyy] = match.map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const exists = date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
  return exists && yyyy >= 1950 ? date : null;
}

function brToISO(dateStr) {
  const [dd, mm, yyyy] = dateStr.split('/');
  return `${yyyy}-${mm}-${dd}`;
}

function validate(form) {
  const errors = {};
  const today = new Date();

  if (!form.titulo.trim()) errors.exp_titulo = 'Informe o cargo.';
  if (!form.empresa.trim()) errors.exp_empresa = 'Informe a empresa.';
  if (!form.modalidade.trim()) errors.exp_modalidade = 'Informe a modalidade.';

  const inicio = parseBR(form.dataInicio);
  if (!form.dataInicio) errors.exp_dataInicio = 'Informe a data inicial.';
  else if (!inicio) errors.exp_dataInicio = 'Data inválida.';
  else if (inicio > today) errors.exp_dataInicio = 'A data inicial não pode ser futura.';

  if (!form.atual) {
    const fim = parseBR(form.dataFim);
    if (!form.dataFim) errors.exp_dataFim = 'Informe a data final ou marque experiência atual.';
    else if (!fim) errors.exp_dataFim = 'Data inválida.';
    else if (inicio && fim < inicio) errors.exp_dataFim = 'A data final não pode ser anterior à inicial.';
  }

  return errors;
}

/**
 * Formulário único para adicionar (sem `experience`) ou editar uma experiência.
 * As mudanças ficam no formulário do perfil e só vão para o servidor ao salvar o perfil.
 */
export default function FormExperience({ experience = null, onSave, onClose }) {

  const isEditing = !!experience;
  const checkboxId = useId();

  const [formData, setFormData] = useState(() => ({
    titulo: experience?.title ?? '',
    empresa: experience?.company ?? '',
    modalidade: experience?.modality ?? '',
    dataInicio: isoToBR(experience?.startDate),
    dataFim: isoToBR(experience?.endDate),
    atual: !!experience?.isCurrent,
    descricao: experience?.description ?? '',
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const field = name.replace('exp_', '');
    let newValue = type === 'checkbox' ? checked : value;
    if (field === 'dataInicio' || field === 'dataFim') newValue = maskField('data', newValue);

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
      ...(field === 'atual' && checked ? { dataFim: '' } : {}),
    }));
    setErrors((prev) => {
      if (!prev[name] && !(field === 'atual' && prev.exp_dataFim)) return prev;
      const next = { ...prev };
      delete next[name];
      if (field === 'atual') delete next.exp_dataFim;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // o formulário fica num portal, mas o evento React ainda sobe até o <form> do perfil
    e.stopPropagation();

    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found, FIELD_ORDER);
      return;
    }

    onSave({
      ...(experience?.id != null ? { id: experience.id } : {}),
      title: formData.titulo.trim(),
      company: formData.empresa.trim(),
      modality: formData.modalidade.trim(),
      startDate: brToISO(formData.dataInicio),
      endDate: formData.atual ? null : brToISO(formData.dataFim),
      isCurrent: formData.atual,
      description: formData.descricao.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto min-w-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--purple-secundary)]">
          {isEditing ? 'Editar experiência' : 'Adicionar experiência'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">Campos com * são obrigatórios.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <LabelInput
          theme='black'
          errorTheme="dark"
          label="Cargo / título"
          name="exp_titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          maxLength={LIMITS.titulo}
          error={errors.exp_titulo}
          placeholder="Digite o título da sua experiência"
        />
        <LabelInput
          theme='black'
          errorTheme="dark"
          label="Empresa"
          name="exp_empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          maxLength={LIMITS.empresa}
          error={errors.exp_empresa}
          placeholder="Digite a empresa referente"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-2 sm:col-span-1 min-w-0">
          <LabelInput
            theme='black'
            errorTheme="dark"
            label="Modalidade"
            name="exp_modalidade"
            value={formData.modalidade}
            onChange={handleChange}
            required
            maxLength={LIMITS.modalidade}
            error={errors.exp_modalidade}
            placeholder="Ex: Estágio, CLT"
          />
        </div>
        <div className="min-w-0">
          <LabelInput
            theme='black'
            errorTheme="dark"
            label="Data inicial"
            name="exp_dataInicio"
            value={formData.dataInicio}
            onChange={handleChange}
            required
            inputMode="numeric"
            maxLength="10"
            error={errors.exp_dataInicio}
            placeholder="dd/mm/aaaa"
          />
        </div>
        <div className="min-w-0">
          <LabelInput
            theme='black'
            errorTheme="dark"
            label="Data final"
            name="exp_dataFim"
            value={formData.dataFim}
            onChange={handleChange}
            required={!formData.atual}
            disabled={formData.atual}
            inputMode="numeric"
            maxLength="10"
            error={errors.exp_dataFim}
            placeholder={formData.atual ? 'Atual' : 'dd/mm/aaaa'}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          name="exp_atual"
          checked={formData.atual}
          onChange={handleChange}
          className="w-5 h-5 shrink-0 accent-purple-600"
        />
        <label htmlFor={checkboxId} className="text-sm text-gray-800">É minha experiência atual</label>
      </div>

      <div>
        <LabelInput
          theme='black'
          errorTheme="dark"
          label="Descrição das atividades"
          name="exp_descricao"
          value={formData.descricao}
          onChange={handleChange}
          type="mensagem"
          maxLength={LIMITS.descricao}
          placeholder="Descreva sua atividade"
        />
        <p className="mt-1 text-xs text-right text-gray-500">
          {formData.descricao.length}/{LIMITS.descricao}
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <BtnCallToAction type="button" variant="white" onClick={onClose}>
          CANCELAR
        </BtnCallToAction>
        <BtnCallToAction type="submit" variant="purple">
          {isEditing ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR'}
        </BtnCallToAction>
      </div>
    </form>
  );
}
