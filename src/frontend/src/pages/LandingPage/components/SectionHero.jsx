import BtnCallToAction from '../../../components/btn/BtnCallToAction/BtnCallToAction';
import image from '../../../assets/homepage/sectionhero.png';
import { useNavigate } from 'react-router-dom';

export default function SectionHero( {registerPath}) {

  const navigate = useNavigate();

  return (
    <section className="w-full px-6 md:px-16 bg-[var(--light)] py-16 mb-15">
      <div className="max-w-7xl min-h-full mx-auto">
        <div className={`flex flex-col-reverse md:flex-row items-center`}>
          <div className="pb-5">
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
                onClick={() => navigate(registerPath) }
              >
                Começar agora
              </BtnCallToAction>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full md:w-2/4 flex justify-center">
            <img
              src={image}
              alt="Logo Her Tech Rise"
              className="w-full h-auto object-cover max-w-sm md:max-w-md xl:max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
