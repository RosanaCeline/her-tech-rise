import React, { useState } from 'react';

export default function FAQSection({ faqs }) {
  return (
    <section className="w-full pt-16 px-7 md:px-16 bg-[var(--light)] py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--purple-secundary)] mb-12">DÚVIDAS</h2>
        <div className="flex flex-col gap-8">
          {faqs.map((faq, index) => (
            <FAQCard key={index} pergunta={faq.pergunta} resposta={faq.resposta} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQCard({ pergunta, resposta }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-2">
      <article
        className="w-full bg-[var(--gray)] text-[var(--purple-secundary)] rounded-2xl p-7 shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{pergunta}</h3>
          <span className="text-[var(--font-gray)] text-xl font-bold">{isOpen ? '−' : '+'}</span>
        </div>
      </article>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="ml-4 pl-4 border-l-4 border-[var(--purple-primary)] bg-transparent text-[var(--text-primary)]">
          {resposta}
        </p>
      </div>
    </div>
  );
}
