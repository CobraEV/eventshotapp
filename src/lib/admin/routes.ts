import { HomeIcon, PartyPopperIcon, UsersIcon } from 'lucide-react'

export const adminRoutes = [
  {
    url: '/tenant',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    url: '/tenant/events',
    label: 'Events',
    icon: PartyPopperIcon,
  },
]

/**
 * Nur fuer den Betreiber. Getrennt von adminRoutes, damit ein Kunde den
 * Eintrag nicht einmal im ausgelieferten Bundle sieht — die Seite selbst
 * prueft ohnehin, aber ein Menuepunkt, der ins Nichts fuehrt, ist schlechte
 * Bedienung.
 */
export const betreiberRoutes = [
  {
    url: '/tenant/kunden',
    label: 'Kunden',
    icon: UsersIcon,
  },
]
