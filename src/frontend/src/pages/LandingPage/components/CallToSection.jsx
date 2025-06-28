import React from 'react';
import imgEnterprise from '../../../assets/homepage/professional.png';
import imgProfessional from '../../../assets/homepage/enterprise.png';

export default function CallToSection({ type }) {
  const isEnterprise = type === 'enterprise';

  const content = isEnterprise
    ? {
        title: 'DIVERSIDADE QUE GERA VALOR',
        subtitle: 'Diversidade não é só uma meta — é estratégia inteligente de negócios.',
        image: imgEnterprise,
        items: [
          'Mais mulheres, mais inovação.',
          'Diversidade gera novas soluções.',
          'Visibilidade para talentos reais.',
          'Oportunidades que transformam carreiras.',
          'Inclusão que move o mercado.'
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

        <div className={`flex flex-col-reverse md:flex-row ${isEnterprise ? '' : 'md:flex-row-reverse'} items-center`}>
          {/* Lista com bolinhas e textos */}
          <div className="flex w-full md:w-3/5 gap-4">
          
            {/* Bolinhas alinhadas à esquerda ou direita */}
            <ul className="flex flex-col items-center pt-1 relative">
              {content.items.map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="w-3 h-3 my-0.5 bg-[var(--purple-secundary)] rounded-full z-10"></span>
                  {index < content.items.length - 1 && (
                    <div className="w-px h-8 bg-purple-300"></div>
                  )}
                </div>
              ))}
            </ul>

            {/* Textos da lista */}
            <ul className="flex flex-col gap-6">
              {content.items.map((item, index) => (
                <li key={index} className="text-gray-800 text-base md:text-lg font-semibold">
                  {item}
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
