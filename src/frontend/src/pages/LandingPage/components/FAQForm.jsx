import React, {useState} from 'react';

import LabelInput from '../../../components/form/Label/LabelInput';
import { validateField } from '../../../components/form/Label/validationField'
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function FAQForm( { fields }) {
  const [form, setForm] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  )

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = fields
      .map((field) => {
        const error = validateField(field.type, form[field.name], field.required)
        return error ? { name: field.name, message: error } : null
      })
      .filter(Boolean)

    if (errors.length > 0) {
      toast.error('Por favor, preencha todos os campos corretamente.')
      return
    }

    toast.success('Mensagem enviada com sucesso!')
    
    // Resetar o form apos envio
    const emptyForm = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className='faqForm'>
      {fields.map(({ name, label, type, required, placeholder }) => (
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

      <BtnCallToAction variant="purple" type="submit"> Enviar </BtnCallToAction>
    </form>
  )
}