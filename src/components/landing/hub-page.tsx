import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/motion'
import { breadcrumbNode, graph, itemListNode } from '@/lib/seo/schema'

export type HubEntry = {
  title: string
  href: string
  copy: string
  meta?: string
}

export type HubSection = {
  heading: string
  intro?: string
  entries: HubEntry[]
}

export type HubContent = {
  eyebrow: string
  title: string
  intro: string
  breadcrumbName: string
  path: string
  sections: HubSection[]
  outro?: string
}

/**
 * Uebersichtsseite (Hub), die auf alle Unterseiten eines Themas verlinkt.
 * Traegt ItemList- und BreadcrumbList-Markup und ist der Zielpunkt, auf den
 * die Breadcrumbs der Unterseiten zeigen.
 */
export function HubPage({ content }: { content: HubContent }) {
  const allEntries = content.sections.flatMap((section) => section.entries)

  const jsonLd = graph(
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: content.breadcrumbName, path: content.path },
    ]),
    itemListNode(
      allEntries.map((entry) => ({ name: entry.title, path: entry.href })),
    ),
  )

  return (
    <div className='container max-w-5xl py-16 space-y-16'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='max-w-2xl space-y-5'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
          {content.eyebrow}
        </p>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
          {content.title}
        </h1>
        <p className='text-lg text-muted-foreground'>{content.intro}</p>
      </div>

      {content.sections.map((section) => (
        <section key={section.heading} className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='text-2xl md:text-3xl font-bold'>
              {section.heading}
            </h2>
            {section.intro && (
              <p className='max-w-2xl text-muted-foreground'>{section.intro}</p>
            )}
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            {section.entries.map((entry) => (
              <ScrollReveal key={entry.href}>
                <Link
                  href={entry.href}
                  className='group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50'
                >
                  {entry.meta && (
                    <span className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                      {entry.meta}
                    </span>
                  )}
                  <h3 className='mt-1 font-semibold'>{entry.title}</h3>
                  <p className='mt-1.5 flex-1 text-sm text-muted-foreground'>
                    {entry.copy}
                  </p>
                  <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5'>
                    Ansehen
                    <ArrowRight className='size-4' />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ))}

      {content.outro && (
        <p className='max-w-2xl border-t border-border pt-8 text-sm text-muted-foreground'>
          {content.outro}
        </p>
      )}
    </div>
  )
}
