import React from 'react'

export default function RegisterStep1({formData, handleChange, }){
    return(
        <section>
            <p className='text-center text-4xl mb-2'>
                Antes de começar, nos conte quem é você.
            </p>
            <p className='text-center text-lg'>
                Selecione o seu perfil para personalizarmos a sua experiência na plataforma."
            </p>
            <div className='flex flex-col gap-y-6 w-fit mx-auto mt-8'>
                <button 
                    onClick={() => handleChange('tipo_usuario', 'profissional')} 
                    className={`w-full mx-auto cursor-pointer py-4 px-9 rounded-3xl
                        ${(formData.tipo_usuario == 'profissional'
                            ? 'bg-(--purple-primary) text-(--light)'
                            : 'bg-white text-(--purple-primary)'
                        )}`}>
                    SOU PROFISSIONAL
                </button>
                <button 
                    onClick={() => handleChange('tipo_usuario', 'empresa')} 
                    className={`w-full mx-auto cursor-pointer px-9 py-4 rounded-3xl
                        ${(formData.tipo_usuario == 'empresa' 
                            ? 'bg-(--purple-primary) text-(--light)'
                            : 'bg-white text-(--purple-primary) '
                        )}`}>
                    SOU EMPRESA
                </button>
            </div>
        </section>
        
    )
}