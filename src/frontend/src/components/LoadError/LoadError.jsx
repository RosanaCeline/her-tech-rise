// erro ao carregar uma página inteira: diz o que falhou e oferece tentar de novo
export default function LoadError({ message, onRetry = () => window.location.reload() }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pt-34 pb-8 text-center">
      <p role="alert" className="max-w-md text-[var(--font-gray)] break-words">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-2 rounded-xl bg-[var(--purple-primary)] text-white hover:bg-[var(--purple-secundary)] transition cursor-pointer"
      >
        Tentar novamente
      </button>
    </main>
  );
}
