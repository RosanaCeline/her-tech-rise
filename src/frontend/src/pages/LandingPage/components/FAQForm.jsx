import React, { useState } from 'react';
import LabelInput from '../../../components/form/Label/LabelInput';
import { validateField } from '../../../components/form/Label/validationField';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import { toast } from 'react-toastify';

export default function FAQForm({ fields }) {
  const [form, setForm] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = fields
      .map((field) => {
        const error = validateField(field.type, form[field.name], field.required);
        return error ? { name: field.name, message: error } : null;
      })
      .filter(Boolean);

    if (errors.length > 0) {
      toast.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    toast.success('Mensagem enviada com sucesso!');

    const emptyForm = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    setForm(emptyForm);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div  className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-6">
          Ficou alguma dúvida?
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-12">Use o formulário abaixo e nos envie sua mensagem.</p>
</div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto flex flex-col gap-6"
        >
          {/* Nome e Email lado a lado em telas médias+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields
              .filter(field => field.name === 'nome' || field.name === 'email')
              .map(({ name, label, type, required, placeholder }) => (
                <LabelInput
                  key={name}
                  name={name}
                  label={label}
                  type={type}
                  required={required}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                />
              ))}
          </div>

          {/* Demais campos */}
          {fields
            .filter(field => field.name !== 'nome' && field.name !== 'email')
            .map(({ name, label, type, required, placeholder }) => (
              <LabelInput
                key={name}
                name={name}
                label={label}
                type={type}
                required={required}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
              />
            ))}

          <div className="flex justify-center mt-6">
            <BtnCallToAction variant="purple" type="submit">
              Enviar
            </BtnCallToAction>
          </div>
        </form>
      </div>
    </>
  )
}
