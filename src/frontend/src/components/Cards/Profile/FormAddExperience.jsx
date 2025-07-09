import React, { useState } from "react";
import LabelInput from "../../form/Label/LabelInput";
import BtnCallToAction from "../../btn/BtnCallToAction/BtnCallToAction";

export default function FormAddExperience({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        titulo: '',
        empresa: '',
        modalidade: '',
        dataInicio: '',
        dataFim: '',
        atual: false,
        descricao: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;
        if (name === 'dataInicio' || name === 'dataFim') {
            newValue = maskDate(newValue);
        }
        if (name === 'atual' && checked) {
          setFormData((prev) => ({ ...prev, dataFim: '' }));
        }
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (name === 'atual' && checked) {
            setFormData((prev) => ({ ...prev, dataFim: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const mapped = {
            title: formData.titulo.trim(),
            company: formData.empresa.trim(),
            modality: formData.modalidade.trim(),
            startDate: convertDateToISO(formData.dataInicio),
            endDate: formData.atual ? null : convertDateToISO(formData.dataFim),
            isCurrent: formData.atual,
            description: formData.descricao.trim()
        };

        onSave(mapped);
        onClose();
    };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">Adicionar Experiência</h2>

      {/* Título e Empresa */}
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label="Título"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          placeholder="Digite o título da sua experiência"
        />
        <LabelInput
          label="Empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          placeholder="Digite a empresa referente"
        />
      </div>

      {/* Modalidade, Data Inicial, Data Final */}
      <div className="grid grid-cols-3 gap-4">
        <LabelInput
          label="Modalidade"
          name="modalidade"
          value={formData.modalidade}
          onChange={handleChange}
          required
          placeholder="Ex: Estágio, CLT"
        />
        <LabelInput
          label="Data Inicial"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          required
          placeholder="dd/mm/aaaa"
        />
        <LabelInput
          label="Data Final"
          name="dataFim"
          value={formData.dataFim}
          onChange={handleChange}
          disabled={formData.atual}
          placeholder="dd/mm/aaaa"
        />
      </div>

      {/* Checkbox: atual */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="atual"
          name="atual"
          checked={formData.atual}
          onChange={handleChange}
          className="w-5 h-5 text-purple-600"
        />
        <label htmlFor="atual" className="text-sm text-gray-800">É minha experiência atual</label>
      </div>

      {/* Descrição */}
      <LabelInput
        label="Descrição das atividades"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        type="mensagem"
        placeholder="Descreva sua atividade"
      />

      {/* Botões */}
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
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}