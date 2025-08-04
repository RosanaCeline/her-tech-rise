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
                                        maxLength = '',
                                        ref = null,
                                        onClick,
                                        disabled = false
                                    }) {
 
    const [error, setError] = useState(null)
 
    const handleBlur = () => {
        const validationError = validateField(validation, value, required)
        setError(validationError)
    }
 
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
        disabled:bg-gray-300
    `

    const baseLabelClasses = `
        block
        mb-1
        text-${theme}
        text-base
        text-left
    `

    return (
        <div className="w-full mt-auto">
        {(label && type !== 'checkbox')&& (
            <label htmlFor={name} className={baseLabelClasses}>
            {label} {required && <span className="text-$[theme]">*</span>}
            </label>
        )}

        {type === 'checkbox' ? (
            <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className=" w-9 h-9
                        rounded-md
                        border-2
                        border-[#55618C]
                        checked:bg-[#55618C]
                        checked:border-transparent
                        transition-all
                        duration-200
                        cursor-pointer"
                    ref={ref}
                    disabled={disabled}
                />
                <span className={`text-${theme} pl-4 text-base text-justify`}>{label} {required && <span className={`text-${theme}`}>*</span>}</span>
            </label>
        ) : type === 'select' ? (
            <div className='relative'>
                <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                ref={ref}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
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
            type={type === 'senha' ? 'password' : type === 'email' ? 'email' : type === 'date' ? 'date' : 'text'}
            value={value}
            onChange={onChange}
            onClick={onClick}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={baseInputClasses}
            maxLength={maxLength}
            ref={ref}
            disabled={disabled}
            style={{ height: '48px' }}
            />
        )}

        {error && <p className={`mt-2 text-sm text-left text-${theme}`}>{error}</p>}
        </div>
    )
}