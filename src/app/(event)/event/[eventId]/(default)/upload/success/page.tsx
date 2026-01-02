import { Suspense } from 'react'

import { UploadSuccessSkeleton } from '@/components/event/UploadSuccessSkeleton'
import UploadSuccessContent from '@/components/event/UploadSuccessContent'

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
