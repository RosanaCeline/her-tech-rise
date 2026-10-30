import { Link } from "react-router-dom";

export default function BtnCallToAction({ children, variant = "purple", onClick, type = "button", to, disabled = false }) {

  const base =
    "inline-flex items-center justify-center " +
    "rounded-xl font-medium cursor-pointer " +
    "px-5 py-3 " +
    "text-sm sm:text-base " +
    "whitespace-nowrap " +
    "transition-all duration-300 ease-in-out " +
    "border-2 border-transparent " +
    "w-auto max-w-full " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    purple:
      "bg-[var(--purple-action)] text-[var(--light)] hover:bg-[var(--purple-primary)] border-none " +
      "focus-visible:outline-[var(--purple-primary)]",

    white:
      "bg-[var(--light)] text-[var(--purple-primary)] " +
      "hover:bg-[var(--purple-primary)] hover:text-[var(--light)] " +
      "hover:border-[0.2em] hover:border-[var(--light)] " +
      "focus-visible:outline-[var(--light)]",

    border:
      "bg-transparent border-[0.2em] border-[var(--light)] text-[var(--light)] " +
      "hover:bg-[var(--light)] hover:text-[var(--purple-primary)] " +
      "focus-visible:outline-[var(--light)]",
  };

  if (to) {
    return (
      <Link to={to} className={`${base} ${variants[variant]}`} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
