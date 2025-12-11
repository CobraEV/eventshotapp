import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-primary">
        Seite nicht gefunden
      </h2>
      <p className="text-center text-gray-600 max-w-md mb-8">
        Die Seite, die du suchst, existiert leider nicht oder wurde verschoben.
      </p>
      <Link href="https://eventshot.ch/">
        <Button className="bg-primary hover:bg-primary/90 text-white">
          Zur Startseite
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
