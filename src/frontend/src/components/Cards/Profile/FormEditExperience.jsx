import React, { useState, useEffect } from "react";
import LabelInput from "../../form/Label/LabelInput";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";

export default function FormEditExperience({ experience, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    titulo: '',
    empresa: '',
    modalidade: '',
    dataInicio: '',
    dataFim: '',
    atual: false,
    descricao: '',
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        titulo: experience.title,
        empresa: experience.company,
        modalidade: experience.modality,
        dataInicio: experience.startDate,
        dataFim: experience.endDate,
        atual: experience.isCurrent,
        descricao: experience.description,
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    if (name === "dataInicio" || name === "dataFim") {
      newValue = maskDate(newValue);
    }
    if (name === "atual" && checked) {
      setFormData((prev) => ({ ...prev, dataFim: '' }));
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mapped = {
      title: formData.titulo.trim() || experience.title,
      company: formData.empresa.trim() || experience.company,
      modality: formData.modalidade.trim() || experience.modality,
      startDate: convertDateToISO(formData.dataInicio) || experience.startDate,
      endDate: formData.atual ? null : (convertDateToISO(formData.dataFim) || experience.endDate || null),
      isCurrent: formData.atual,
      description: formData.descricao.trim() || experience.description,
      id: experience.id,
    };

    onUpdate(mapped);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto bg-white shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">Editar Experiência</h2>

      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label="Título"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder={experience.title || "Digite o título da sua experiência"}
          required
        />
        <LabelInput
          label="Empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          placeholder={experience.company || "Digite a empresa referente"}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <LabelInput
          label="Modalidade"
          name="modalidade"
          value={formData.modalidade}
          onChange={handleChange}
          placeholder={experience.modality || "Ex: Estágio, CLT"}
          required
        />
        <LabelInput
          label="Data Inicial"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          placeholder={formatDateToBR(experience.startDate) || "dd/mm/aaaa"}
          required
        />
        <LabelInput
          label="Data Final"
          name="dataFim"
          value={formData.dataFim}
          onChange={handleChange}
          disabled={formData.atual}
          placeholder={experience.endDate ? formatDateToBR(experience.endDate) : "dd/mm/aaaa"}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="atual"
          name="atual"
          checked={formData.atual}
          onChange={handleChange}
          className="w-5 h-5 text-purple-600"
        />
        <label htmlFor="atual" className="text-sm text-gray-800">
          É minha experiência atual
        </label>
      </div>

      <LabelInput
        label="Descrição das atividades"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        type="mensagem"
        placeholder={experience.description || "Descreva sua atividade"}
      />

      <div className="flex justify-end gap-4 pt-4">
        <BtnCallToAction type="button" variant="white" onClick={onClose}>
          CANCELAR
        </BtnCallToAction>
        <BtnCallToAction type="submit" variant="purple">
          SALVAR
        </BtnCallToAction>
      </div>
    </form>
  );
}

function maskDate(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

function convertDateToISO(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

function formatDateToBR(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const [yyyy, mm, dd] = parts;
  return `${dd}/${mm}/${yyyy}`;
}
