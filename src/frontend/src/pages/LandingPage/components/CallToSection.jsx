import React from 'react';
import imgEnterprise from '../../../assets/homepage/professional.png';
import imgProfessional from '../../../assets/homepage/enterprise.png';

export default function CallToSection({ type }) {
  const isEnterprise = type === 'enterprise';

  const content = isEnterprise
    ? {
        title: 'DIVERSIDADE QUE GERA RESULTADOS',
        subtitle: 'Diversidade não é só uma meta — é estratégia inteligente de negócios.',
        image: imgEnterprise,
        imageAlt: 'Ilustração de uma mulher programando em frente a dois monitores',
        items: [
          'Acesse talentos femininos altamente qualificados.',
          'Construa times mais diversos, inovadores e eficientes.',
          'Dê visibilidade a oportunidades em ambientes inclusivos.',
          'Fortaleça sua marca empregadora com impacto real.',
          'Transforme diversidade em vantagem competitiva.'
        ]
      }
    : {
        title: 'VOZES QUE TRANSFORMAM',
        subtitle: 'Não é sobre falta de talento. É sobre falta de espaço.',
        image: imgProfessional,
        imageAlt: 'Ilustração de uma mulher subindo uma seta de crescimento em direção a um alvo',
        items: [
          'Geramos conexões que impulsionam carreiras.',
          'Construímos pontes entre empresas e profissionais qualificadas.',
          'Criamos um cenário tech mais justo e inovador.',
          'Valorizamos o talento feminino com oportunidades reais.',
          'Transformamos visibilidade em crescimento profissional.'
        ]
      };

  const headingId = `cta-${type}-title`;

  return (
    <section aria-labelledby={headingId} className="w-full pt-16 px-6 md:px-16 bg-[var(--light)]">
      <div className="max-w-7xl mx-auto">
        <h2 id={headingId} className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--purple-secundary)] mb-4 break-words">
          {content.title}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl">
          {content.subtitle}
        </p>

        <div className={`flex flex-col-reverse pt-6 gap-8 md:flex-row ${isEnterprise ? '' : 'md:flex-row-reverse'} items-center`}>
          <ul className="flex flex-col gap-6 w-full md:w-1/2 min-w-0">
            {content.items.map((item, index) => (
              <li key={index} className="relative flex items-start gap-4">
                {index < content.items.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[7.5px] top-5 -bottom-6 w-px bg-purple-300" />
                )}
                <span aria-hidden="true" className="relative mt-1 w-4 h-4 shrink-0 bg-[var(--purple-secundary)] rounded-full" />

                <span className="min-w-0 text-gray-800 text-base md:text-lg font-semibold leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Imagem */}
          <div className="w-full md:w-1/2 min-w-0 flex justify-center">
            <img
              src={content.image}
              alt={content.imageAlt}
              width="2000"
              height="2000"
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
