
export default function Card({ icon, title, description }) {
  return (
    <article
      className="
        bg-[var(--gray)]
        text-[var(--purple-secundary)]
        drop-shadow-md
        rounded-xl
        p-6
        flex flex-col items-center justify-center text-center
        w-full max-w-sm min-h-40 h-full
      "
    >
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4 md:mb-6">
        <span aria-hidden="true" className="shrink-0">{icon}</span>
        <h3 className="text-[var(--purple-secundary)] text-2xl md:text-3xl font-semibold break-words">{title}</h3>
      </div>
      <p className="text-base md:text-lg break-words">{description}</p>
    </article>
  );
}
