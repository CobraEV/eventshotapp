import { Camera } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import EventNav from '@/components/event/event-nav'

type Props = {
  params: Promise<{ eventId: string }>
}

const EventHeader = async ({ params }: Props) => {
  return (
    <Suspense>
      <Header params={params} />
    </Suspense>
  )
}

export default EventHeader

const Header = async ({ params }: Props) => {
  const { eventId } = await params
  return (
    <header className='sticky top-0 z-30 border-b bg-background/80 backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        <Link
          href={`/event/${eventId}`}
          className='flex items-center gap-2 text-xl font-bold'
        >
          <Camera className='h-5 w-5 text-primary' />
          <span>EventShot</span>
        </Link>

        <Suspense>
          <EventNav eventId={eventId} />
        </Suspense>
      </div>
    </header>
  )
}
