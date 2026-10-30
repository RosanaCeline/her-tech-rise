export default function RegisterStep1({formData, handleChange, }){
    const profileClasses = (selected) =>
        `w-full mx-auto cursor-pointer py-4 px-9 rounded-3xl transition-all duration-300 transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
        ${selected
            ? 'bg-(--purple-primary) text-(--light) scale-105'
            : 'bg-white text-(--purple-primary)'
        }`

    return(
        <section>
            <h1 className='text-center text-3xl sm:text-4xl md:text-3xl lg:text-5xl mb-2'>
                Antes de começar, nos conte quem é você.
            </h1>
            <p id='perfil-descricao' className='text-center text-sm sm:text-base md:text-lg'>
                Selecione o seu perfil para personalizarmos a sua experiência na plataforma.
            </p>
            <div role='group' aria-describedby='perfil-descricao' className='flex flex-col gap-y-6 w-fit mx-auto mt-8'>
                <button 
                    type='button'
                    aria-pressed={formData.tipo_usuario === 'profissional'}
                    onClick={() => handleChange('tipo_usuario', 'profissional')} 
                    className={profileClasses(formData.tipo_usuario === 'profissional')}>
                    SOU PROFISSIONAL
                </button>
                <button 
                    type='button'
                    aria-pressed={formData.tipo_usuario === 'empresa'}
                    onClick={() => handleChange('tipo_usuario', 'empresa')} 
                    className={profileClasses(formData.tipo_usuario === 'empresa')}>
                    SOU EMPRESA
                </button>
            </div>
        </section>
        
    )
}
