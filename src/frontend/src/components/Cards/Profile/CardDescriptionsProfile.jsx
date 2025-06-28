import React from 'react';

export default function CardDescriptionsProfile ({ title, content }) {

    const hasContent = typeof content === 'string' && content.trim() !== '';

    return (
        <article
        className="
            bg-[var(--gray)]
            text-[var(--purple-secundary)]
            drop-shadow-md
            rounded-xl
            p-8
            flex flex-col
            w-full
            max-w-8xl
            z-0
        "
        >
        <h2 className="text-4xl font-semibold text-[var(--purple-secundary)] mb-4">
            {title}
        </h2>
        {hasContent ? (
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
            {content}
            </p>
        ) : (
            <p className="italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70">
            Nenhuma informação disponível no momento.
            </p>
        )}
        </article>
    )
}
