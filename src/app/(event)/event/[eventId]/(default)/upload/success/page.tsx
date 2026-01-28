import { Suspense } from 'react'
import UploadSuccessContent from '@/components/event/UploadSuccessContent'
import { UploadSuccessSkeleton } from '@/components/event/UploadSuccessSkeleton'

export default function UploadSuccessPage(props: {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ photo?: string }>
}) {
  return (
    <Suspense fallback={<UploadSuccessSkeleton />}>
      <UploadSuccessContent {...props} />
    </Suspense>
  )
}
