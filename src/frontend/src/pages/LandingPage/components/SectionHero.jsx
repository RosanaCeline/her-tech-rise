import React from 'react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function SectionHero() {
  return (
    <section className='sectionHero'>
      <h1>Bem-vinda ao Her Tech Rise</h1>
      <p>Conecte. Inspire. Transforme a tecnologia.</p>
      <span>
        Mulheres na tecnologia transformam o futuro. Nós impulsionamos essas trajetórias.
      </span>
      <BtnCallToAction variant="purple" onClick={() => window.location.href = '/cadastro'}>
        Começar agora
      </BtnCallToAction>
    </section>
  );
}