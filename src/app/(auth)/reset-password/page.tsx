import ResetPassword from '@/components/auth/reset-password-form'
import { Suspense } from 'react'

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) => {
  // Move the await inside a Suspense boundary
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* The async logic goes inside a child async component */}
      <ResetPasswordWrapper searchParams={searchParams} />
    </Suspense>
  )
}

export default Page

// Async child component
async function ResetPasswordWrapper({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6">
      <ResetPassword token={token ?? ''} />
    </div>
  )
}
