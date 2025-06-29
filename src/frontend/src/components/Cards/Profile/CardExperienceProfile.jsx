import React from 'react';

export default function CardExperienceProfile({ title, experiencias = [] }) {
  const hasExperiences = experiencias.length > 0;

  return (
    <article className="bg-[var(--gray)] text-[var(--purple-secundary)] drop-shadow-md rounded-xl p-8 flex flex-col w-full max-w-8xl z-0">
        <h2 className="text-4xl font-semibold text-[var(--purple-secundary)] mb-8">{title}</h2>

        {hasExperiences ? (
            <div className="relative pl-10">
            {/* Linha vertical */}
            <div className="absolute top-3 left-4 bottom-0 w-[2px] bg-[var(--purple-secundary)]" />

            <div className="flex flex-col gap-10">
                {experiencias.map((exp, index) => (
                <div key={index} className="flex items-start gap-6 relative">
                    {/* Bolinha */}
                    <div className="w-4 h-4 bg-[var(--purple-secundary)] rounded-full mt-2 absolute left-[-2rem]" />

                    {/* Card da experiência */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h3 className="text-xl font-semibold text-[var(--purple-secundary)]">{exp.titulo}</h3>
                    <p className="text-md text-[var(--text-secondary)] font-medium">
                        {exp.empresa} | {exp.modalidade}
                    </p>
                    <p className="text-sm text-gray-500 italic mt-1">
                        {exp.datainicial
                            ? formatMesAnoComDuracao(exp.datainicial, exp.datafinal, exp.atualxp)
                            : 'Período não informado'}
                    </p>
                    <p className="text-md text-[var(--text-secondary)] mt-2">{exp.descricao}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        ) : (
            <p className="italic text-xl text-[var(--text-secondary)] leading-relaxed opacity-70">
            Nenhuma experiência disponível no momento.
            </p>
        )}
    </article>
  )
}

const formatMesAnoComDuracao = (inicio, fim, atual) => {
  const dataInicio = new Date(inicio);
  const dataFim = atual ? new Date() : new Date(fim);

  const options = { month: 'long', year: 'numeric' };
  const inicioFormatado = dataInicio.toLocaleDateString('pt-BR', options);
  const fimFormatado = atual ? 'o momento' : dataFim.toLocaleDateString('pt-BR', options);

  // Cálculo da duração
  let anos = dataFim.getFullYear() - dataInicio.getFullYear();
  let meses = dataFim.getMonth() - dataInicio.getMonth();

  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  const duracao = [
    anos > 0 ? `${anos} ano${anos > 1 ? 's' : ''}` : '',
    meses > 0 ? `${meses} mês${meses > 1 ? 'es' : ''}` : '',
  ]
    .filter(Boolean)
    .join(' e ');

  return `De ${capitalize(inicioFormatado)}, até ${capitalize(fimFormatado)} (${duracao})`;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
