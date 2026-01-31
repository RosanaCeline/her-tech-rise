import React from 'react';
import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import image from '../../../assets/homepage/sectionhero.png';

export default function SectionHero( {registerPath}) {
  return (
    <>
      <section className="md:flex h-screen w-fit md:w-full mt-20 md:mt-2">
        <article className="w-full pt-12 md:w-1/2 flex flex-col justify-center relative px-8 md:px-6">
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
              xl:text-3xl  
              text-[var(--text-gray)]
              md:mb-12 mb-6
            ">
              Conecte. Inspire. Transforme a tecnologia.
            </p>

            <span className="
              text-lg        
              xl:text-2xl   
              text-[#1B263B]
              leading-relaxed
            ">
              <strong>Mulheres</strong> na tecnologia transformam o <strong>futuro</strong>. Nós <strong>impulsionamos</strong> essas <strong>trajetórias</strong>.
            </span>

            <div className="mt-10 md:mt-15 mx-auto justify-center items-center">
              <BtnCallToAction
                variant="purple"
                onClick={() => window.location.href = registerPath }
              >
                Começar agora
              </BtnCallToAction>
            </div>
          </div>
        </article>

        <article className="w-full md:w-1/2 md:h-full mt-10 ">
          <img
            src={image}
            alt="Logo Her Tech Rise"
            className="w-full h-full object-contain"
          />
        </article>
      </section>     
    </>
  );
}
