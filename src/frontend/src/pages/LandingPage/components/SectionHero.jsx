import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import image from '../../../assets/homepage/sectionhero.png';

export default function SectionHero( {registerPath}) {

  return (
    <section className="w-full px-5 sm:px-10 md:px-16 bg-[var(--light)] py-12 md:py-16 mb-10 md:mb-15">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="@container w-full md:w-1/2 min-w-0 text-center md:text-left">
            <h1 className="
              text-[clamp(1.5rem,13.5cqi,6.5rem)]
              font-bold
              whitespace-nowrap
              tracking-tight
              text-[var(--purple-primary)]
              mb-3
              leading-tight
            ">
              Her Tech Rise
            </h1>

            <p className="
              text-lg
              sm:text-xl
              xl:text-3xl
              text-[var(--font-gray)]
              md:mb-12 mb-6
            ">
              Conecte. Inspire. Transforme a tecnologia.
            </p>

            <p className="
              text-base
              sm:text-lg
              xl:text-2xl
              text-[#1B263B]
              leading-relaxed
            ">
              <strong>Mulheres</strong> na tecnologia transformam o <strong>futuro</strong>. Nós <strong>impulsionamos</strong> essas <strong>trajetórias</strong>.
            </p>

            <div className="mt-8 md:mt-15 flex justify-center md:justify-start">
              <BtnCallToAction variant="purple" to={registerPath}>
                Começar agora
              </BtnCallToAction>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full md:w-1/2 min-w-0 flex justify-center">
            <img
              src={image}
              alt="Ilustração de uma mulher segurando um perfil profissional aprovado"
              width="2000"
              height="2000"
              fetchPriority="high"
              className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md xl:max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
