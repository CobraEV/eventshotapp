'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, Camera } from 'lucide-react'
import { getPhotoDownloadUrl } from '@/actions/get-photo-download-url'

export function PhotoSaveActions({
  photoId,
  eventId,
}: {
  photoId: string
  eventId: string
}) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [filename, setFilename] = useState('eventshot.jpg')

  useEffect(() => {
    getPhotoDownloadUrl(photoId).then((res) => {
      setDownloadUrl(res.url)
      setFilename(res.filename)
    })
  }, [photoId])

  if (!downloadUrl) return null

  return (
    <div className="flex flex-col gap-3">
      <a href={downloadUrl} download={filename}>
        <Button className="w-full gap-2">
          <Download className="h-4 w-4" />
          Foto auf dein Gerät speichern
        </Button>
      </a>

      <Link href={`/event/${eventId}/upload`}>
        <Button variant="outline" className="w-full gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Weiteres hochladen
        </Button>
      </Link>
    </div>
  )
}
