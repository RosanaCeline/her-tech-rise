import React, { useState, useEffect } from "react";

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../../../../context/AuthContext';
import LabelInput from "../../../../components/form/Label/LabelInput";
import BtnCallToAction from "../../../../components/btn/BtnCallToAction/BtnCallToAction";
import { validateField } from "../../../../components/form/Label/validationField";
import { maskField } from "../../../../components/form/Label/maskField";

export default function EditProfessional() {
  const { user, updateProfile } = useAuth();

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

  const [visibility, setVisibility] = useState({
    telefone: true,
    email: true,
    cidade: true,
    estado: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        cpf: user.cpf || '',
        telefone: user.telefone || '',
        rua: user.endereco?.rua || '',
        bairro: user.endereco?.bairro || '',
        cidade: user.endereco?.cidade || '',
        estado: user.endereco?.estado || '',
        cep: user.endereco?.cep || '',
        data_nascimento: user.data_nascimento || '',
        email: user.email || '',
        tecnologias: user.tecnologias || '',
        biografia: user.biografia || '',
        link: user.link || '',
      });
      setVisibility({
        telefone: user.visibilidade?.telefone ?? true,
        email: user.visibilidade?.email ?? true,
        cidade: user.visibilidade?.cidade ?? true,
        estado: user.visibilidade?.estado ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cpf') maskedValue = maskField('cpf', value);
    if (name === 'telefone') maskedValue = maskField('telefone', value);
    if (name === 'cep') maskedValue = maskField('cep', value);
    if (name === 'data_nascimento') maskedValue = maskField('data', value);

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
      biografia: 'texto'
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
      await updateProfile({ ...formData, visibilidade: visibility });
      alert("Perfil profissional atualizado com sucesso!");
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Informações Pessoais */}
      <article className="bg-[var(--gray)] p-6 mb-8 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">INFORMAÇÕES PESSOAIS</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">Deixe seu perfil sempre pronto para novas oportunidades.</p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          {/* Campos fixos, olho aberto sem toggle */}
          <LabelInputWithVisibility
            label="Nome:"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Digite seu nome"
          />
          {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}

          <LabelInputWithVisibility
            label="CPF:"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            validation="cpf"
            placeholder="000.000.000-00"
            maxLength="14"
          />
          {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf}</p>}

          <LabelInputWithVisibility
            label="Data de Nascimento:"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            required
            validation="data"
            placeholder="dd/mm/aaaa"
            maxLength="10"
          />
          {errors.data_nascimento && <p className="text-red-600 text-sm">{errors.data_nascimento}</p>}

          {/* Campos com visibilidade controlada, com toggle */}
          <LabelInputWithVisibility
            label="Telefone:"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            validation="telefone"
            placeholder="(99) 99999-9999"
            maxLength="15"
            visible={visibility.telefone}
            onToggle={toggleVisibility}
          />
          {errors.telefone && <p className="text-red-600 text-sm">{errors.telefone}</p>}

          <LabelInputWithVisibility
            label="Email:"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            validation="email"
            placeholder="Digite seu email"
            visible={visibility.email}
            onToggle={toggleVisibility}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

          <LabelInputWithVisibility
            label="CEP:"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            required
            validation="cep"
            placeholder="99999-999"
            maxLength="9"
          />
          {errors.cep && <p className="text-red-600 text-sm">{errors.cep}</p>}

          <LabelInputWithVisibility
            label="Rua:"
            name="rua"
            value={formData.rua}
            onChange={handleChange}
            required
            validation="texto"
          />
          {errors.rua && <p className="text-red-600 text-sm">{errors.rua}</p>}

          <LabelInputWithVisibility
            label="Bairro:"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            required
            validation="texto"
          />
          {errors.bairro && <p className="text-red-600 text-sm">{errors.bairro}</p>}

          <LabelInputWithVisibility
            label="Cidade:"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
            validation="texto"
            visible={visibility.cidade}
            onToggle={toggleVisibility}
          />
          {errors.cidade && <p className="text-red-600 text-sm">{errors.cidade}</p>}

          <LabelInputWithVisibility
            label="Estado:"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            validation="texto"
            visible={visibility.estado}
            onToggle={toggleVisibility}
          />
          {errors.estado && <p className="text-red-600 text-sm">{errors.estado}</p>}
        </div>
      </article>

      {/* Trajetória e habilidades */}
      <article className="bg-[var(--gray)] p-6 w-full max-w-screen-md mx-auto rounded-2xl">
        <h2 className="text-2xl font-bold text-[var(--purple-secundary)] mb-4">TRAJETÓRIA E HABILIDADES</h2>
        <p className="mt-2 text-lg max-w-xl text-[var(--font-gray)]">Compartilhe sua jornada e competências na área tech.</p>

        <div className="w-full mt-4 grid gap-4 max-w-2xl">
          <LabelInput
            name="tecnologias"
            label="Tecnologias:"
            value={formData.tecnologias}
            onChange={handleChange}
            validation="texto"
            placeholder="Ex: React, Spring Boot, Docker"
          />

          <LabelInput
            name="biografia"
            label="Biografia:"
            type="mensagem"
            value={formData.biografia}
            onChange={handleChange}
            required
            validation="texto"
            placeholder="Conte um pouco sobre sua trajetória"
          />
          {errors.biografia && <p className="text-red-600 text-sm">{errors.biografia}</p>}

          <LabelInput
            name="link"
            label="Link externo:"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://"
            validation="url"
          />
        </div>
      </article>

      {/* Botão de salvar */}
      <div className="mx-auto mt-4">
        <BtnCallToAction type="submit" variant="purple">
          SALVAR
        </BtnCallToAction>
      </div>
    </form>
  );
}

// Componente LabelInputWithVisibility usado no formulário
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
