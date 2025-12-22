import AdminNav from '@/components/tenant/admin-nav'
import { Camera } from 'lucide-react'
import Link from 'next/link'

const Header = async () => {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Camera className="h-5 w-5 text-primary" />
          <span>EventShot</span>
        </Link>

        <AdminNav />
      </div>
    </header>
  )
}

export default Header
