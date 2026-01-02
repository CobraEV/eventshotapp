'use client'
import { DownloadIcon } from 'lucide-react'
import { Button } from '../ui/button'

const EventDownloadButton = ({ eventId }: { eventId: string }) => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        window.location.href = `/api/event/${eventId}/download-zip`
      }}
    >
      <DownloadIcon className="h-4 w-4" /> Alle Fotos herunterladen
    </Button>
  )
}

export default EventDownloadButton
