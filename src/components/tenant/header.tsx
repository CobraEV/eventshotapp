import { Camera } from 'lucide-react'
import Link from 'next/link'
import AdminNav from '@/components/tenant/admin-nav'
import { isCurrentUserAdmin } from '@/lib/auth-guard'

const Header = async () => {
  // Serverseitig entschieden und als Prop weitergereicht: die Navigation ist
  // eine Client-Komponente und darf die Betreiber-Pruefung nicht selbst
  // machen — im Browser waere sie nur eine Empfehlung.
  const isAdmin = await isCurrentUserAdmin()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Camera className="h-5 w-5 text-primary" />
          <span>EventShot</span>
        </Link>

        <AdminNav isAdmin={isAdmin} />
      </div>
    </header>
  )
}

export default Header
