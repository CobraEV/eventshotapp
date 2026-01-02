'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { createUploadUrl } from '@/actions/create-upload-url'
import { finalizeUpload } from '@/actions/finalize-upload'
import { useRouter } from 'next/navigation'

export default function PhotoUploadPresigned({ eventId }: { eventId: string }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFile = async (file: File) => {
    setUploading(true)
    setProgress(0)

    try {
      // 1) Presigned URL holen
      const { uploadUrl, objectKey } = await createUploadUrl(eventId, file.type)

      // 2) Upload direkt zu MinIO (XHR für Progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)

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
      const result = await finalizeUpload({
        objectKey,
        originalName: file.name,
        size: file.size,
      })

      toast.success('Foto erfolgreich hochgeladen')
      router.push(`/event/${eventId}/upload/success?photo=${result.photoId}`)
    } catch (err) {
      console.error(err)
      toast.error('Fehler beim Upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="group relative flex flex-col items-center justify-center
        border-2 border-dashed border-muted rounded-2xl p-10
        transition hover:border-primary/50 hover:shadow-md cursor-pointer"
      onClick={() => document.getElementById('camera-input')?.click()}
    >
      <Camera className="h-16 w-16 text-primary mb-4" />

      <Button variant="ghost" disabled={uploading}>
        {uploading
          ? `Upload ${progress}%`
          : 'Hier tippen um ein Foto zu schiessen'}
      </Button>

      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
