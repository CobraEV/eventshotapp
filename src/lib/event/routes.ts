import { HomeIcon, ImagesIcon, MonitorPlayIcon, UploadIcon } from 'lucide-react'

export const getEventRoutes = (eventId: string) => [
  {
    url: `/event/${eventId}`,
    label: 'Startseite',
    icon: HomeIcon,
  },
  {
    url: `/event/${eventId}/gallery`,
    label: 'Galerie',
    icon: ImagesIcon,
  },
  {
    url: `/event/${eventId}/slideshow`,
    label: 'Slideshow',
    icon: MonitorPlayIcon,
    newTab: true,
  },
  {
    url: `/event/${eventId}/upload`,
    label: 'Hochladen',
    icon: UploadIcon,
  },
]
