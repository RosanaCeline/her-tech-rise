import React from 'react';
import Card from '../../../components/Cards/LandingPage/Card';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function ServicesList({ services, registerPath }) {
  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <h2 className="text-4xl font-bold text-[var(--purple-secundary)]">SERVIÇOS</h2>
        <BtnCallToAction
          variant="purple"
          onClick={() => window.location.href = registerPath}
        >
          Participar
        </BtnCallToAction>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
        {services.map((service, index) => (
          <Card key={index} {...service} />
        ))}
      </div>
    </section>
  );
}
