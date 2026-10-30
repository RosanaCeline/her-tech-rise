import { useEffect } from 'react'

import { services } from './data/services'
import { faqs } from './data/faqs'
// import { fields } from './data/fields'

import SectionHero from './components/SectionHero'
import CallToSection from './components/CallToSection'
import ServicesList from './components/ServicesList'
import FAQSection from './components/FAQSection'
// import FAQForm from './components/FAQForm'
import { FadeInSection } from './components/FadeInSection'

export default function LandingPage( {registerPath }) {

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <>
      <div className="w-full overflow-x-clip bg-[var(--light)]">

        <SectionHero registerPath={registerPath} />

        <section aria-label="Citação inspiradora" className="w-full mb-8 py-12 px-6 bg-[var(--purple-primary)] text-center shadow-xl/40">
          <figure className="max-w-4xl mx-auto text-[var(--light)]">
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold">
              <p>“Não tenha medo de ser ambicioso em relação aos seus objetivos. O trabalho duro nunca para. Seus sonhos também não deveriam parar.”</p>
            </blockquote>
            <figcaption className="mt-4 text-base md:text-lg">— Mae Jemison</figcaption>
          </figure>
        </section>

        <FadeInSection>
          <CallToSection type="professional" />
        </FadeInSection>

        <FadeInSection>
          <CallToSection type="enterprise" />
        </FadeInSection>

        <FadeInSection>
          <ServicesList services={services} registerPath={registerPath} />
        </FadeInSection>

        <FadeInSection>
          <FAQSection faqs={faqs} />
        </FadeInSection>

      </div>
      {/* <section className="w-full py-20 px-8 md:px-16 bg-[var(--gray)]">
        <FAQForm fields={fields} />
      </section> */}
    </>
  )
}
