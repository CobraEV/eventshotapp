'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'
import { getPhotoDownloadUrl } from '@/actions/get-photo-download-url'

export function PhotoSaveActions({ photoId }: { photoId: string }) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [filename, setFilename] = useState('eventshot.jpg')

  useEffect(() => {
    getPhotoDownloadUrl(photoId).then((res) => {
      setDownloadUrl(res.url)
      setFilename(res.filename)
    })
  }, [photoId])

  async function handleShare() {
    if (!downloadUrl || !navigator.share) return

    const blob = await fetch(downloadUrl).then((r) => r.blob())
    const file = new File([blob], filename, { type: blob.type })

    await navigator.share({
      title: 'Dein EventShot Foto',
      files: [file],
    })
  }

  if (!downloadUrl) return null

  return (
    <div className="flex flex-col gap-3">
      <a href={downloadUrl} download={filename}>
        <Button className="w-full gap-2">
          <Download className="h-4 w-4" />
          Foto auf dein Gerät speichern
        </Button>
      </a>

      {typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Foto teilen
          </Button>
        )}
    </div>
  )
}
