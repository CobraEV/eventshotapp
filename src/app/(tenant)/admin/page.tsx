import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Suspense } from 'react'

const Page = async () => {
  return (
    <div>
      <p>Page</p>
      <Suspense>
        <RenderSession />
      </Suspense>
    </div>
  )
}

export default Page

const RenderSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return <span>{JSON.stringify(session, null, 2)}</span>
}
