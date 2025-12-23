import LoginForm from '@/components/auth/LoginForm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const LoginPage = async () => {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  )
}

export default LoginPage

const PageContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) redirect('/tenant')
  return <LoginForm />
}
