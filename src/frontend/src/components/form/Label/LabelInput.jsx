import { useId, useState } from 'react'
import { validateField } from './validationField'
import { EyeOff, Eye } from 'lucide-react'

export default function LabelInput ({   name,
                                        type = 'text',
                                        label,
                                        value,
                                        onChange,
                                        required = false,
                                        placeholder = '',
                                        options = [], 
                                        theme = 'black',
                                        validation = '',
                                        maxLength = '',
                                        ref = null,
                                        onClick,
                                        disabled = false,
                                        errorTheme = 'light',
                                        autoComplete,
                                        inputMode
                                    }) {
 
    const [error, setError] = useState(null);
    const autoId = useId();
    const inputId = name || autoId;
    const errorId = `${inputId}-erro`;
    const a11yProps = {
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        'aria-required': required || undefined,
    };
    const [showPassword, setShowPassword] = useState(false);
 
    const handleBlur = () => {
        const validationError = validateField(validation, value, required);
        setError(validationError);
    };
 
    const baseInputClasses = `
        w-full min-w-full
        rounded-lg
        px-2 py-2
        sm:px-4 sm:py-3
        text-sm sm:text-base
        font-normal
        text-[#55618C]
        bg-[#F7F7F7]
        border border-transparent
        shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-[#55618C]
        transition
        placeholder:text-[#55618C]/60 truncate
        disabled:bg-gray-300
    `

    const baseLabelClasses = `
        block
        mb-1
        text-${theme}
        text-base sm:text-sm md:text-base
        text-left
    `

    return (
        <div className="w-full mt-auto">
            {(label && type !== 'checkbox')&& (
                <label htmlFor={inputId} className={baseLabelClasses}>
                {label} {required && <span className={`text-${theme}`}>*</span>}
                </label>
            )}

            {type === 'checkbox' ? (
                <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                        id={inputId}
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
                    id={inputId}
                    name={name}
                    {...a11yProps}
                    autoComplete={autoComplete}
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
                id={inputId}
                name={name}
                {...a11yProps}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                rows={6}
                className={`${baseInputClasses} resize-none whitespace-normal`}
                />
            ) : (
                <div className="relative">
                    <input
                        id={inputId}
                        name={name}
                        {...a11yProps}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        type={
                            type === 'senha'
                                ? showPassword ? 'text' : 'password'
                                : type === 'email'
                                ? 'email'
                                : type === 'date'
                                ? 'date'
                                : 'text'
                        }
                        value={value}
                        onChange={onChange}
                        onClick={onClick}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`${baseInputClasses} pr-12`}
                        maxLength={maxLength}
                        ref={ref}
                        disabled={disabled}
                    />

                    {type === 'senha' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            aria-pressed={showPassword}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p id={errorId} className={`mt-2 text-sm text-left ${errorTheme === 'dark' ? 'text-error-dark' : 'text-error'}`}>
                    {error}
                </p>
            )}

        </div>
    )
}
