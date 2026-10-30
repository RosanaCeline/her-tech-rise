import React, { useId, useState } from 'react';

export default function FAQSection({ faqs }) {
  return (
    <section aria-labelledby="faq-title" className="w-full pt-16 px-6 md:px-16 bg-[var(--light)] pb-20">
      <div className="max-w-7xl mx-auto">
        <h2 id="faq-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--purple-secundary)] mb-12">DÚVIDAS</h2>
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
  const id = useId();
  const buttonId = `${id}-pergunta`;
  const panelId = `${id}-resposta`;

  return (
    <div className="flex flex-col items-stretch">
      <h3 className="text-base sm:text-lg font-semibold">
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center gap-4 text-left bg-[var(--gray)] text-[var(--purple-secundary)] rounded-2xl p-5 sm:p-7 shadow-md cursor-pointer
            transition-colors duration-300 hover:bg-[#e2e2e2]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple-primary)]"
        >
          <span className="min-w-0 break-words">{pergunta}</span>
          <span aria-hidden="true" className="shrink-0 text-[var(--font-gray)] text-xl font-bold">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!isOpen}
        className={`grid transition-all duration-500 ease-in-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="ml-4 pl-4 border-l-4 border-[var(--purple-primary)] text-[var(--text-primary)]">
            {resposta}
          </p>
        </div>
      </div>
    </div>
  );
}
