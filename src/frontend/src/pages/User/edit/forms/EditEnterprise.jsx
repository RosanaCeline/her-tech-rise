import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../../../../context/AuthContext';
import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import { validateField } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";

export default function EditEnterprise() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    descricao: '',
    sobrenos: '',
    link: '',
  });

  const [visibility, setVisibility] = useState({
    telefone: true,
    email: true,
    cidade: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        cnpj: user.cnpj || '',
        telefone: user.telefone || '',
        email: user.email || '',
        cep: user.endereco?.cep || '',
        rua: user.endereco?.rua || '',
        bairro: user.endereco?.bairro || '',
        cidade: user.endereco?.cidade || '',
        descricao: user.descricao || '',
        sobrenos: user.sobrenos || '',
        link: user.link || '',
      });
      setVisibility({
        telefone: user.visibilidade?.telefone ?? true,
        email: user.visibilidade?.email ?? true,
        cidade: user.visibilidade?.cidade ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cnpj') maskedValue = maskField('cnpj', value);
    if (name === 'telefone') maskedValue = maskField('telefone', value);
    if (name === 'cep') maskedValue = maskField('cep', value);

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
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
      sobrenos: 'texto',
    };

    const newErrors = {};
    for (let field in requiredFields) {
      const error = validateField(requiredFields[field], formData[field], true);
      if (error) newErrors[field] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      await updateProfile({ ...formData, visibilidade: visibility });
      alert("Perfil da empresa atualizado com sucesso!");
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleVisibility = (field) => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      <article className="bg-[var(--gray)] p-6 mb-8 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">INFORMAÇÕES EMPRESARIAIS</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">
          Mantenha os dados da sua empresa atualizados e fortaleça sua presença na plataforma.
        </p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          <LabelInputWithVisibility
            name="nome"
            label="Nome da Empresa:"
            value={formData.nome}
            onChange={handleChange}
            required
            validation="texto"
          />
          {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}

          <LabelInputWithVisibility
            name="cnpj"
            label="CNPJ:"
            value={formData.cnpj}
            onChange={handleChange}
            required
            validation="cnpj"
            maxLength="14"
          />
          {errors.cnpj && <p className="text-red-600 text-sm">{errors.cnpj}</p>}

          <LabelInputWithVisibility
            name="telefone"
            label="Telefone:"
            value={formData.telefone}
            onChange={handleChange}
            required
            validation="telefone"
            maxLength="15"
            visible={visibility.telefone}
            onToggle={toggleVisibility}
          />
          {errors.telefone && <p className="text-red-600 text-sm">{errors.telefone}</p>}

          <LabelInputWithVisibility
            name="email"
            label="Email de Contato:"
            value={formData.email}
            onChange={handleChange}
            required
            validation="email"
            visible={visibility.email}
            onToggle={toggleVisibility}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

          <LabelInputWithVisibility
            name="cep"
            label="CEP:"
            value={formData.cep}
            onChange={handleChange}
            required
            validation="cep"
            maxLength="9"
          />
          {errors.cep && <p className="text-red-600 text-sm">{errors.cep}</p>}

          <LabelInputWithVisibility
            name="rua"
            label="Rua:"
            value={formData.rua}
            onChange={handleChange}
            required
            validation="texto"
          />
          {errors.rua && <p className="text-red-600 text-sm">{errors.rua}</p>}

          <LabelInputWithVisibility
            name="bairro"
            label="Bairro:"
            value={formData.bairro}
            onChange={handleChange}
            required
            validation="texto"
          />
          {errors.bairro && <p className="text-red-600 text-sm">{errors.bairro}</p>}

          <LabelInputWithVisibility
            name="cidade"
            label="Cidade:"
            value={formData.cidade}
            onChange={handleChange}
            required
            validation="texto"
            visible={visibility.cidade}
            onToggle={toggleVisibility}
          />
          {errors.cidade && <p className="text-red-600 text-sm">{errors.cidade}</p>}
        </div>
      </article>

      <article className="bg-[var(--gray)] p-6 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">PERFIL CORPORATIVO</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">
          Compartilhe a missão da sua empresa e mostre sua cultura organizacional.
        </p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          <LabelInput
            name="descricao"
            label="Áreas de Atuação / Tecnologias:"
            value={formData.descricao}
            onChange={handleChange}
            validation="texto"
            placeholder="Ex: Cloud, IA, Fintechs..."
          />

          <LabelInput
            name="sobrenos"
            label="Sobre nós:"
            type="mensagem"
            value={formData.sobrenos}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Conte um pouco sobre sua trajetória"
          />
          {errors.sobrenos && <p className="text-red-600 text-sm">{errors.sobrenos}</p>}

          <LabelInput
            name="link"
            label="Link externo:"
            value={formData.link}
            onChange={handleChange}
            validation="url"
            placeholder="https://suaempresa.com"
          />
        </div>
      </article>

      <div className="mx-auto mt-4">
        <BtnCallToAction type="submit" variant="purple">
          SALVAR
        </BtnCallToAction>
      </div>
    </form>
  );
}

function LabelInputWithVisibility({ label, name, visible, onToggle, ...rest }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-semibold text-[var(--purple-secundary)] mb-1">
        <label htmlFor={name}>{label}</label>
        {typeof visible === "boolean" ? (
          <button
            type="button"
            onClick={() => onToggle(name)}
            aria-label={`${visible ? "Ocultar" : "Exibir"} ${label}`}
            className="text-[var(--purple-primary)] hover:text-[var(--purple-secundary)] transition-colors"
          >
            {visible ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </button>
        ) : (
          <FaEye size={18} className="text-[var(--purple-primary)] opacity-50" />
        )}
      </div>
      <LabelInput id={name} name={name} {...rest} />
    </div>
  );
}
