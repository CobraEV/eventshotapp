import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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

        <div className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='space-y-4'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index.toString()}
                value={`item-${index}`}
                className='border border-border rounded-lg shadow-sm'
              >
                <AccordionTrigger className='px-6 text-left font-medium'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='px-6 pb-4 text-muted-foreground'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <ScrollReveal>
          <div className='text-center mt-12'>
            <p className='text-muted-foreground mb-4'>
              Noch Fragen offen? Wir helfen gerne weiter.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <a
                href='mailto:info@eventshot.ch'
                className='text-primary font-medium hover:underline'
              >
                info@eventshot.ch
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
