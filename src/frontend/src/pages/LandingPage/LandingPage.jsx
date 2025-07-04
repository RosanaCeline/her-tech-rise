import React from 'react'

import { services } from './data/services'
import { faqs } from './data/faqs'
import { fields } from './data/fields'

import SectionHero from './components/SectionHero'
import CallToSection from './components/CallToSection'
import ServicesList from './components/ServicesList'
import FAQSection from './components/FAQSection'
import FAQForm from './components/FAQForm'

export default function LandingPage( {registerPath }) {
  return (
    <>
      <main className="column bg-[var(--light)] mt-19 px-6 md:px-16">
        <SectionHero registerPath={registerPath} />
      </main>

      <section className="w-fit md:w-full mb-8 py-12 bg-[var(--purple-primary)] text-center shadow-xl/40">
        <h2 className="text-3xl text-[var(--light)] px-6 max-w-4xl mx-auto px-">
          “Não tenha medo de ser ambicioso em relação aos seus objetivos. O trabalho duro nunca para. Seus sonhos também não deveriam parar.” —Mae Jemison.
        </h2>
      </section>

      <main className="column bg-[var(--light)] px-6 md:px-16">
        <CallToSection type="professional" />
        <CallToSection type="enterprise" />
        <ServicesList services={services} registerPath={registerPath} />
        <FAQSection faqs={faqs} />
        
      </main>
      <section className="w-full py-20 px-8 md:px-16 bg-[var(--gray)]">
        <FAQForm fields={fields} />
      </section>
    </>
  )
}
