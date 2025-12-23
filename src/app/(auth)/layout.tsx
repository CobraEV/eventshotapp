import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { ReactNode, Suspense } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}

export default AuthLayout
