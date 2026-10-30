import React from 'react';
import Card from '../../../components/Cards/LandingPage/Card';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function ServicesList({ services, registerPath }) {

  return (
    <section aria-labelledby="services-title" className="w-full py-20 pt-16 px-6 md:px-16 bg-[var(--light)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between mb-12 gap-4">
        <h2 id="services-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--purple-secundary)]">SERVIÇOS</h2>
        <BtnCallToAction variant="purple" to={registerPath}>
          Participar
        </BtnCallToAction>
      </div>

      <ul className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {services.map((service, index) => (
          <li key={index} className="flex w-full max-w-sm">
            <Card {...service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
