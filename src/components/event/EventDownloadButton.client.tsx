'use client'
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
      Alle Fotos herunterladen
    </Button>
  )
}

export default EventDownloadButton
