// "aaaa-mm-dd" lido como data local: new Date("2024-01-01") é UTC e no Brasil vira 31/12/2023
const parseISODate = (value) => {
  const [yyyy, mm, dd] = String(value).split('-').map(Number);
  return new Date(yyyy, (mm || 1) - 1, dd || 1);
};

const formatMesAnoComDuracao = (inicio, fim, atual) => {
  const dataInicio = parseISODate(inicio);
  const dataFim = atual || !fim ? new Date() : parseISODate(fim);

  const options = { month: 'long', year: 'numeric' };
  const inicioFormatado = dataInicio.toLocaleDateString('pt-BR', options);
  const fimFormatado = atual || !fim ? 'o momento' : dataFim.toLocaleDateString('pt-BR', options);

  let anos = dataFim.getFullYear() - dataInicio.getFullYear();
  let meses = dataFim.getMonth() - dataInicio.getMonth();

  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  if (anos < 0 || (anos === 0 && meses <= 0)) {
    anos = 0;
    meses = 1;
  }

  const duracao = [
    anos > 0 ? `${anos} ano${anos > 1 ? 's' : ''}` : '',
    meses > 0 ? `${meses} mês${meses > 1 ? 'es' : ''}` : '',
  ].filter(Boolean)
   .join(' e ');

  return `De ${capitalize(inicioFormatado)}, até ${capitalize(fimFormatado)} (${duracao})`;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


export default function CardExperienceProfile({ title, experiencias = [] }) {
  const hasExperiences = experiencias.length > 0;

  return (
    <article className="bg-white text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-5 sm:p-8 flex flex-col w-full max-w-8xl z-0 min-w-0">
      <h2 className="text-2xl md:text-4xl font-semibold text-[var(--purple-secundary)] mb-6 sm:mb-8 break-words">{title}</h2>

      {hasExperiences ? (
        <div className="relative pl-7 sm:pl-10">
          {/* Linha vertical */}
          <div className="absolute top-3 left-2 sm:left-4 bottom-0 w-[2px] bg-[var(--purple-secundary)]" />

          <div className="flex flex-col gap-6 sm:gap-10">
            {experiencias.map((exp, index) => (
              <div key={exp.id ?? index} className="flex items-start gap-6 relative min-w-0">
                {/* Bolinha */}
                <div className="w-4 h-4 bg-[var(--purple-secundary)] rounded-full mt-2 absolute -left-[1.6875rem] sm:-left-[2rem]" aria-hidden="true" />

                {/* Card da experiência */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-semibold text-[var(--purple-secundary)] break-words">{exp.title}</h3>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium break-words">
                    {[exp.company, exp.modality].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-sm text-gray-500 italic mt-1">
                    {exp.startDate
                      ? formatMesAnoComDuracao(exp.startDate, exp.endDate, exp.isCurrent)
                      : 'Período não informado'}
                  </p>
                  {exp.description && (
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 break-words whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="italic text-base md:text-xl text-[var(--text-secondary)] leading-relaxed opacity-70">
          Nenhuma experiência disponível no momento.
        </p>
      )}
    </article>
  );
}
