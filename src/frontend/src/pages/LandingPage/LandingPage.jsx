import React, {useState} from 'react';
import style from './LandingPage.module.css';
import BtnCallToAction from '../../components/btn/BtnCallToAction/BtnCallToAction';

const services = [
  {
    icon: '💬', 
    title: 'Comunidade',
    description: 'Ambiente seguro e colaborativo para troca e crescimento profissional.'
  },
  {
    icon: '🌐',
    title: 'Networking',
    description: 'Conexões reais com mulheres que impulsionam o ecossistema tech.'
  }
];

const faqs = [
  {
    pergunta: 'Quem pode participar do Her Tech Rise?',
    resposta: 'O Her Tech Rise é aberto a mulheres de todas as áreas da tecnologia, desde iniciantes até profissionais experientes. Também acolhemos aliadas e organizações que compartilham do nosso propósito de inclusão e desenvolvimento na área tech.'
  },
  {
    pergunta: 'Como funciona o acesso para profissionais?',
    resposta: 'Para profissionais mulheres na tecnologia, o Her Tech Rise oferece acesso gratuito à plataforma, com recursos de networking, desenvolvimento de carreira, conteúdo educacional e acesso às oportunidades ofertadas por empresas parceiras.'
  },
  {
    pergunta: 'Posso indicar minha empresa para ser parceira?',
    resposta: 'Sim! Valorizamos empresas comprometidas com diversidade. Interessadas podem entrar em contato através do nosso canal de parcerias para integrar suas vagas, cursos e ações de desenvolvimento na plataforma.'
  },
]

export default function LandingPage() {
  return (
    <main className={style.landingPage}>
      <SectionHero />
      <CallToProfessionals />
      <CallToEnterprises />
      <ServicesList services={services} />
      <FAQSection faqs={faqs}/>
    </main>
  );
}

function SectionHero() {
  return (
    <section className={style.sectionHero}>
      <h1>Bem-vinda ao Her Tech Rise</h1>
      <p>Conecte. Inspire. Transforme a tecnologia.</p>
      <span>
        Mulheres na tecnologia transformam o futuro. Nós impulsionamos essas trajetórias.
      </span>
      <BtnCallToAction variant="purple" onClick={() => window.location.href = '/cadastro'}>
        Começar agora
      </BtnCallToAction>
    </section>
  );
}

function CallToProfessionals() {
  return (
    <section className={style.sectionCall}>
      <h2>VOZES QUE TRANSFORMAM</h2>
      <p>Não é sobre falta de talento. É sobre falta de espaço.</p>
      <ul>
        <li>Geramos conexões que impulsionam carreiras.</li>
        <li>Construímos pontes entre empresas e profissionais qualificadas.</li>
        <li>Criamos um cenário tech mais justo e inovador.</li>
        <li>Valorizamos o talento feminino com oportunidades reais.</li>
        <li>Transformamos visibilidade em crescimento profissional.</li>
      </ul>
    </section>
  );
}

function CallToEnterprises() {
  return (
    <section className={style.sectionCall}>
      <h2>DIVERSIDADE QUE GERA VALOR</h2>
      <p>Diversidade não é só uma meta — é estratégia inteligente de negócios.</p>
      <ul>
        <li>Mais mulheres, mais inovação.</li>
        <li>Diversidade gera novas soluções.</li>
        <li>Visibilidade para talentos reais.</li>
        <li>Oportunidades que transformam carreiras.</li>
        <li>Inclusão que move o mercado.</li>
      </ul>
    </section>
  );
}

function ServicesList({ services }) {
  return (
    <section className={style.sectionServices}>
      <h2>SERVIÇOS</h2>
      <BtnCallToAction variant="purple" onClick={() => window.location.href = '/cadastro'}>
        Participar
      </BtnCallToAction>
      <div className={style.servicesGrid}>
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <article className={style.cardService}>
      <div className={style.icon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function FAQSection({ faqs }) {
  return (
    <section className={style.sectionFAQ}>
      <h2>Dúvidas Frequentes</h2>
      <div className={style.faqList}>
        {faqs.map((faq, index) => (
          <FAQCard key={index} pergunta={faq.pergunta} resposta={faq.resposta} />
        ))}
      </div>
    </section>
  );
}

function FAQCard({ pergunta, resposta }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className={`${style.faqCard} ${isOpen ? style.open : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={style.pergunta}>
        <h3>{pergunta}</h3>
        <span className={style.icon}>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <p className={style.resposta}>{resposta}</p>}
    </article>
  );
}