import React, {useState} from 'react';

export default function FAQSection({ faqs }) {
  return (
    <section className='sectionFAQ'>
      <h2>Dúvidas Frequentes</h2>
      <div className='faqList'>
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
    <article className={`faqCard ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} >
      <div className='pergunta'>
        <h3>{pergunta}</h3>
        <span className='icon'>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <p className='resposta'>{resposta}</p>}
    </article>
  );
}
