import { ScrollReveal } from '@/components/ui/motion'
import { SITE, videoNode } from '@/lib/seo/schema'

// Weboptimierte Fassungen (Original lag bei 4.5 MB fuer 5 Sekunden).
// preload='none' + Poster: beim Seitenaufbau werden keine Videobytes geladen.
const VIDEO_MP4 = '/eventshot-demo-web.mp4'
const VIDEO_WEBM = '/eventshot-demo-web.webm'
const POSTER = '/eventshot-demo-poster.jpg'

const jsonLd = {
  '@context': 'https://schema.org',
  ...videoNode({
    name: 'EventShot Demo – Fotos live als Slideshow am Event',
    description:
      'Kurze Demo: Gäste laden per QR-Code Fotos hoch und sehen sie sofort als elegante Live-Slideshow auf Beamer oder TV – ohne App, DSG-konform und auf Schweizer Servern gehostet.',
    contentUrl: `${SITE.url}${VIDEO_MP4}`,
    thumbnailUrl: `${SITE.url}${POSTER}`,
    uploadDate: '2025-12-11',
    duration: 'PT5S',
  }),
}

export function Video() {
  return (
    <section id='gallery' className='py-16 bg-muted/50'>
      <div className='container'>
        <ScrollReveal>
          <div className='text-center max-w-3xl mx-auto mb-4'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Erlebe EventShot live
            </h2>
            <p className='text-muted-foreground text-lg'>
              Sieh dir an, wie EventShot echte Momente auf Events in Echtzeit
              zum Leben erweckt.
            </p>
          </div>
        </ScrollReveal>

        <div className='relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl'>
          {/** biome-ignore lint/a11y/useMediaCaption: stummes Demo-Video ohne Sprachinhalt */}
          <video
            poster={POSTER}
            controls
            preload='none'
            playsInline
            aria-label='EventShot Demo-Video'
            width={1280}
            height={720}
            className='w-full h-auto rounded-2xl bg-black'
          >
            <source src={VIDEO_WEBM} type='video/webm' />
            <source src={VIDEO_MP4} type='video/mp4' />
            Dein Browser kann dieses Video nicht abspielen.
          </video>
        </div>
      </div>

      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
