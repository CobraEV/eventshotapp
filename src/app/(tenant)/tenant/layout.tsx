import Header from '@/components/tenant/header'
import type { ReactNode } from 'react'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
