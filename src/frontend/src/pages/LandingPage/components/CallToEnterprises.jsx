import React, {useState} from 'react';
import image from "../../../assets/homepage/professional.png"

export default function CallToEnterprises() {
  return (
    <section className='sectionCall'>
      <h2>DIVERSIDADE QUE GERA VALOR</h2>
      <p>Diversidade não é só uma meta — é estratégia inteligente de negócios.</p>
      <section>
        <img src={image} alt="desenho de mulher programando de 'storyset.com/job'" />
        <ul>
          <li>Mais mulheres, mais inovação.</li>
          <li>Diversidade gera novas soluções.</li>
          <li>Visibilidade para talentos reais.</li>
          <li>Oportunidades que transformam carreiras.</li>
          <li>Inclusão que move o mercado.</li>
        </ul>
      </section>
      
    </section>
  );
}
