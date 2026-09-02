'use client'

import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { createUploadUrl } from '@/actions/create-upload-url'
import { finalizeUpload } from '@/actions/finalize-upload'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function PhotoUploadPresigned({ eventId }: { eventId: string }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFile = async (file: File) => {
    setUploading(true)
    setProgress(0)

    try {
      // 1) Presigned URL holen
      const presigned = await createUploadUrl(eventId, file.type)

      // Abgelehnt, bevor irgendein Byte fliesst — der Gast erfaehrt den Grund,
      // statt nach einem vollstaendigen Upload ein "Fehler beim Upload" zu
      // sehen.
      if (!presigned.ok) {
        toast.error(presigned.message)
        return
      }

      const { uploadUrl, objectKey } = presigned

      // 2) Upload direkt zu MinIO (XHR für Progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)

        xhr.setRequestHeader(
          'Cache-Control',
          'public, max-age=31536000, immutable',
        )

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        }

        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error('Upload failed'))

        xhr.onerror = reject
        xhr.send(file)
      })

      // 3) Finalisieren (DB)
      const saved = await finalizeUpload({
        eventId,
        objectKey,
        mimeType: file.type,
        size: file.size,
      })

      if (!saved.ok) {
        toast.error(saved.message)
        return
      }

      toast.success('Foto erfolgreich hochgeladen')
      router.push(`/event/${eventId}/upload/success?photo=${saved.photoId}`)
    } catch (err) {
      console.error(err)
      toast.error('Fehler beim Upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <button
      type='button'
      disabled={uploading}
      className='group relative flex flex-col items-center justify-center
        border-2 border-dashed border-muted rounded-2xl p-10
        transition hover:border-primary/50 hover:shadow-md cursor-pointer'
      onClick={() => document.getElementById('camera-input')?.click()}
    >
      <Camera className='h-16 w-16 text-primary mb-4' />

      <div
        className={cn(
          buttonVariants({
            variant: 'ghost',
          }),
        )}
      >
        {/* <Button variant='ghost' disabled={uploading}> */}
        {uploading
          ? `Upload ${progress}%`
          : 'Hier tippen um ein Foto zu schiessen'}
        {/* </Button> */}
      </div>

      <input
        id='camera-input'
        type='file'
        accept='image/*'
        capture='user'
        className='hidden'
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </button>
  )
}
