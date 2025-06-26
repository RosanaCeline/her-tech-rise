import React, { useState } from 'react'
import { validateField } from './validationField'

export default function LabelInput ({    name,
                                        type = 'text',
                                        label,
                                        value,
                                        onChange,
                                        required = false,
                                        placeholder = '',
                                        options = [], 
                                        theme = '[#303F3C]',
                                        validation = '',
                                        maxLength = ''
                                    }) {

     // Vai aparecer um erro de validação 
    const [error, setError] = useState(null)

    // Vai validar o campo quando o usuário sair do campo
    const handleBlur = () => {
        const validationError = validateField(validation, value, required)
        setError(validationError)
    }

    // Definir as classes de tailwind para os inputs
    const baseInputClasses = `
        w-full min-w-full
        rounded-lg
        px-4
        py-3
        text-sm
        font-normal
        text-[#55618C]
        bg-[#F7F7F7]
        border border-transparent
        shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-[#55618C]
        transition
        placeholder:text-[#55618C]/60
    `

    const baseLabelClasses = `
        block
        mb-1
        text-${theme}
        text-base
        text-left
    `

    return (
        <div className="w-full">
        {label && (
            <label htmlFor={name} className={baseLabelClasses}>
            {label} {required && <span className="text-$[theme]">*</span>}
            </label>
        )}

        {type === 'select' ? (
            <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            className={`${baseInputClasses} appearance-none pr-10`}
            >
            <option value="" disabled>
                Selecione...
            </option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                {opt.label}
                </option>
            ))}
            </select>
        ) : type === 'mensagem' ? (
            <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={6}
            className={`${baseInputClasses} resize-none`}
            />
        ) : (
            <input
            id={name}
            name={name}
            type={type === 'senha' ? 'password' : type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={baseInputClasses}
            maxLength={maxLength}
            style={{ height: '48px' }}
            />
        )}

        {error && <p className={`mt-2 text-sm text-${theme}`}>{error}</p>}
        </div>
    )
}