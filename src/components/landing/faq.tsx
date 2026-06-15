import { ScrollReveal } from '@/components/ui/motion'
import { faqs } from '@/lib/constants'

export function FAQ() {
  return (
    <section id='faq' className='py-16'>
      <div className='container'>
        <ScrollReveal>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Häufige Fragen
            </h2>
            <p className='text-muted-foreground text-lg'>
              Du hast Fragen? Wir haben die Antworten.
            </p>
          </div>
        </ScrollReveal>

        {/* Native <details>: Antworten immer im DOM (SEO), Accordion darf zu sein */}
        <div className='max-w-3xl mx-auto space-y-4'>
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className='group rounded-lg border border-border shadow-sm'
            >
              <summary className='flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left font-medium [&::-webkit-details-marker]:hidden'>
                {faq.question}
                <span className='shrink-0 text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45'>
                  +
                </span>
              </summary>
              <p className='px-6 pb-4 text-muted-foreground'>{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* FAQPage JSON-LD aus denselben Daten */}
        <script
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />

        <ScrollReveal>
          <div className='text-center mt-12'>
            <p className='text-muted-foreground mb-4'>
              Noch Fragen offen? Wir helfen gerne weiter.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <a
                href='mailto:info@edelbyte.ch'
                className='text-primary font-medium hover:underline'
              >
                info@edelbyte.ch
              </a>
              <span className='hidden sm:inline text-muted-foreground'>|</span>
              <a
                href='tel:+41445002504'
                className='text-primary font-medium hover:underline'
              >
                044 500 25 04
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
