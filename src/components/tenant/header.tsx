import Nav from '@/components/tenant/nav'
import { Camera } from 'lucide-react'
import Link from 'next/link'

const Header = async () => {
  return (
    <header className="py-6 px-4 md:px-6 border-border border-b bg-muted/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/`} className="text-2xl font-bold flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          <span>EventShot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Nav />
        </div>
      </div>
    </header>
  )
}

export default Header
