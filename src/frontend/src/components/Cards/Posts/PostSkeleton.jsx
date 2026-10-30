// Placeholder com o mesmo formato do card de publicação, evitando "pulo" de layout no carregamento.
export default function PostSkeleton() {
  return (
    <div aria-hidden="true" className="w-full bg-white p-4 sm:p-8 rounded-xl shadow-md animate-pulse motion-reduce:animate-none">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/5 rounded bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-11/12 rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>
      <div className="h-px bg-gray-200 my-5" />
      <div className="flex justify-between">
        <div className="h-5 w-16 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
}
