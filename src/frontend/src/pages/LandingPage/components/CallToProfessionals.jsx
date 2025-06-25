import React from 'react';
import image from "../../../assets/homepage/enterprise.png"

export default function CallToProfessionals() {
  return (
    <section className='sectionCall'>
      <h2>VOZES QUE TRANSFORMAM</h2>
      <p>Não é sobre falta de talento. É sobre falta de espaço.</p>
      <section>
        <img src={image} alt="desenho de mulher programando de 'storyset.com/job'" />
        <ul>
          <li>Geramos conexões que impulsionam carreiras.</li>
          <li>Construímos pontes entre empresas e profissionais qualificadas.</li>
          <li>Criamos um cenário tech mais justo e inovador.</li>
          <li>Valorizamos o talento feminino com oportunidades reais.</li>
          <li>Transformamos visibilidade em crescimento profissional.</li>
        </ul>
      </section>
    </section>
  );
}