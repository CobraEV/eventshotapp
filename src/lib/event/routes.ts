import { HomeIcon, ImagesIcon, UploadIcon } from 'lucide-react'

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
    url: `/event/${eventId}/upload`,
    label: 'Hochladen',
    icon: UploadIcon,
  },
]
