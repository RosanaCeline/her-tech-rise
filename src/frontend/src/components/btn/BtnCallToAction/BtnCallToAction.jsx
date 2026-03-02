

export default function BtnCallToAction({ children, variant = "purple", onClick, type = "button" }) {

  const base =
    "inline-flex items-center justify-center " +
    "rounded-xl font-medium " +
    "px-5 py-3 " +
    "text-sm sm:text-base " + 
    "whitespace-nowrap " +
    "transition-all duration-300 ease-in-out " +
    "border-2 border-transparent " +
    "w-auto max-w-full";

  const variants = {
    purple:
      "bg-[var(--purple-action)] text-[var(--light)] hover:bg-[var(--purple-primary)] border-none",

    white:
      "bg-[var(--light)] text-[var(--purple-primary)] " +
      "hover:bg-[var(--purple-primary)] hover:text-[var(--light)] " +
      "hover:border-[0.2em] hover:border-[var(--light)]",

    border:
      "bg-transparent border-[0.2em] border-[var(--light)] text-[var(--light)] " +
      "hover:bg-[var(--light)] hover:text-[var(--purple-primary)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
