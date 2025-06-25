import React from 'react';

import Card from '../../../components/Card/Card';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';

export default function ServicesList({ services }) {
  return (
    <section className='sectionServices'>
      <h2>SERVIÇOS</h2>
      <BtnCallToAction variant="purple" onClick={() => window.location.href = '/cadastro'}> Participar </BtnCallToAction>
      <div className='servicesGrid'>
        {services.map((service, index) => (
          <Card key={index} {...service} />
        ))}
      </div>
    </section>
  );
}