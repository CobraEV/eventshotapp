import { HomeIcon, ImagesIcon, ProjectorIcon } from 'lucide-react'

export const eventRoutes = [
  {
    url: '/',
    label: 'Startseite',
    icon: HomeIcon,
  },
  {
    url: '/slideshow',
    label: 'Slideshow',
    icon: ProjectorIcon,
    target: '_blank',
  },
  {
    url: '/gallery',
    label: 'Galerie',
    icon: ImagesIcon,
  },
]
