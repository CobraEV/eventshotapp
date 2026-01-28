'use client'

import { Camera, Download, Images } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPhotoDownloadUrl } from '@/actions/get-photo-download-url'
import { Button } from '@/components/ui/button'

function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function canShareFiles() {
  return (
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  )
}

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

  async function handleShareToPhotos() {
    if (!downloadUrl || !canShareFiles()) return

    const response = await fetch(downloadUrl)
    const blob = await response.blob()

    const file = new File([blob], filename, {
      type: blob.type || 'image/jpeg',
    })

    await navigator.share({
      title: 'Dein EventShot Foto',
      files: [file],
    })
  }

  if (!downloadUrl) return null

  const showIOSShare = isIOS() && canShareFiles()

  return (
    <div className='flex flex-col gap-3'>
      <Link href={`/event/${eventId}/upload`}>
        <Button variant='default' size={'lg'} className='w-full gap-2'>
          <Camera className='h-4 w-4' />
          Weiteres hochladen
        </Button>
      </Link>

      {/* Standard Download */}
      <Button
        variant={'outline'}
        className='w-full gap-2'
        onClick={handleDownload}
        disabled={loading}
      >
        <Download className='h-4 w-4' />
        {loading ? 'Speichern…' : 'Foto auf dein Gerät speichern'}
      </Button>

      {/* iOS: direkt in Fotos */}
      {showIOSShare && (
        <Button
          variant='outline'
          className='w-full gap-2'
          onClick={handleShareToPhotos}
        >
          <Images className='h-4 w-4 text-primary' />
          In Fotos sichern (iPhone)
        </Button>
      )}

      {/* UX-Hinweis nur für iOS */}
      {isIOS() && (
        <p className='text-xs text-muted-foreground text-center'>
          Hinweis: „Speichern“ legt das Foto in <b>Dateien</b> ab.
          <br />
          Für die Galerie bitte <b>„In Fotos sichern“</b> verwenden.
        </p>
      )}
    </div>
  )
}
