import React, { useState } from 'react'

import { services } from './data/services'
import { faqs } from './data/faqs'
import { fields } from './data/fields'

import SectionHero from './components/SectionHero'
import CallToProfessionals from './components/CallToProfessionals'
import CallToEnterprises from './components/CallToEnterprises'
import ServicesList from './components/ServicesList'
import FAQSection from './components/FAQSection'
import FAQForm from './components/FAQForm'

export default function LandingPage() {
  return (
    <main className='landingPage'>
      <SectionHero />
      <CallToProfessionals />
      <CallToEnterprises />
      <ServicesList services={services} />
      <FAQSection faqs={faqs} />
      <FAQForm fields={fields} />
    </main>
  )
}
