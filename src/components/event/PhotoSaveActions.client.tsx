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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPhotoDownloadUrl(photoId).then((res) => {
      setDownloadUrl(res.url)
      setFilename(res.filename)
    })
  }, [photoId])

  async function handleDownload() {
    if (!downloadUrl) return

    try {
      setLoading(true)

      const response = await fetch(downloadUrl)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()

      a.remove()
      URL.revokeObjectURL(blobUrl)
    } finally {
      setLoading(false)
    }
  }

  if (!downloadUrl) return null

  return (
    <div className="flex flex-col gap-3">
      <Button
        className="w-full gap-2"
        onClick={handleDownload}
        disabled={loading}
      >
        <Download className="h-4 w-4" />
        {loading ? 'Speichern…' : 'Foto auf dein Gerät speichern'}
      </Button>

      <Link href={`/event/${eventId}/upload`}>
        <Button variant="outline" className="w-full gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Weiteres hochladen
        </Button>
      </Link>
    </div>
  )
}
