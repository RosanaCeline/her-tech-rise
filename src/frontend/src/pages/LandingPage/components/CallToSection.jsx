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
        items: [
          'Geramos conexões que impulsionam carreiras.',
          'Construímos pontes entre empresas e profissionais qualificadas.',
          'Criamos um cenário tech mais justo e inovador.',
          'Valorizamos o talento feminino com oportunidades reais.',
          'Transformamos visibilidade em crescimento profissional.'
        ]
      };

  return (
    <section className="w-full pt-16 px-6 md:px-16 bg-[var(--light)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">
          {content.title}
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl">
          {content.subtitle}
        </p>

        <div className={`flex flex-col-reverse pt-6 md:flex-row ${isEnterprise ? '' : 'md:flex-row-reverse'} items-center`}>
          {/* Lista com bolinhas e textos */}
          <div className="flex w-full md:w-3/5 gap-4">
          
            {/* Bolinhas alinhadas à esquerda ou direita */}
            <ul className="flex flex-col gap-6 w-full">
              {content.items.map((item, index) => (
                <li key={index} className="flex items-start gap-4 relative">
                  
                  {/* Coluna da bolinha + linha */}
                  <div className="flex flex-col items-center relative mb-8">
                    <span className="w-4 h-4 bg-[var(--purple-secundary)] rounded-full z-10" />

                    {index < content.items.length - 1 && (
                      <span className="w-px flex-1 bg-purple-300" />
                    )}
                  </div>

                  {/* Texto */}
                  <p className="text-gray-800 text-base md:text-lg font-semibold leading-snug">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Imagem */}
          <div className="w-full  md:w-2/4">
            <img
              src={content.image}
              alt="Ilustração representando mulheres na tecnologia"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
