import React from 'react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import image from '../../../assets/homepage/sectionhero.png';

export default function SectionHero( {registerPath}) {
  return (
    <>
      <section className="flex flex-col md:flex-row h-screen w-full">
        <article className="w-full md:w-1/2 flex flex-col justify-center relative px-8 md:px-2">
          <div className="max-w-3xl">
            <h1 className="
              text-5xl       
              xl:text-8xl   
              text-[var(--purple-primary)]
              mb-3
              leading-tight
            ">
              Her Tech Rise
            </h1>

            <p className="
              text-xl        
              xl:text-2xl  
              text-[var(--text-gray)]
              mb-12
            ">
              Conecte. Inspire. Transforme a tecnologia.
            </p>

            <span className="
              text-lg        
              xl:text-xl   
              text-[var(--text-primary)]
              leading-relaxed
            ">
              Mulheres na tecnologia transformam o futuro. Nós impulsionamos essas trajetórias.
            </span>
          </div>
          <div className="mt-10 justify-center items-center">
            <BtnCallToAction
              variant="purple"
              onClick={() => window.location.href = registerPath }
            >
              Começar agora
            </BtnCallToAction>
          </div>
        </article>

        <article className="w-full md:w-1/2 h-[50vh] md:h-full mt-10 ">
          <img
            src={image}
            alt="Logo Her Tech Rise"
            className="w-full h-full object-cover "
          />
        </article>
      </section>     
    </>
  );
}
