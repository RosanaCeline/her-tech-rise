import React from 'react';

export default function Card({ icon, title, description }) {
  return (
    <article
      className="
        bg-[var(--gray)]
        text-[var(--purple-secundary)]
        drop-shadow-md
        rounded-xl
        p-6
        flex flex-col items-center text-center
        w-full max-w-sm aspect-[2/1] z-0

        transition-transform duration-300 ease-in-out
        hover:scale-105
        hover:text-[var(--text-primary)] 
        cursor-pointer
      "
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[inherit] text-5xl">{icon}</span>
        <h3 className="text-[var(--purple-secundary)] text-3xl font-semibold">{title}</h3>
      </div>
      <p className="text-xl">{description}</p>
    </article>
  );
}
