import { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex-1 flex flex-col">{children}</div>
}

export default AuthLayout
