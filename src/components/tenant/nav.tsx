'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { adminRoutes } from '@/lib/admin/routes'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { LogOutIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login') // redirect to login page
        },
      },
    })
  }

  return (
    <>
      {/* Mobile menu trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="group size-8 lg:hidden"
            variant="ghost"
            size="icon"
          >
            <svg
              className="pointer-events-none"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-36 p-1 lg:hidden">
          <NavigationMenu className="max-w-none *:w-full">
            <NavigationMenuList className="flex-col items-start gap-0 lg:gap-2">
              {adminRoutes.map((route) => (
                <NavigationMenuItem key={route.url} className="w-full">
                  <NavigationMenuLink
                    href={`${route.url}`}
                    className={cn(
                      'text-muted-foreground font-medium flex flex-row items-center py-1.5 px-2 gap-2',
                      route.url === pathname && 'bg-muted text-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <route.icon className="text-primary" />
                    <span>{route.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink
                  href="#signout"
                  className={cn(
                    'text-muted-foreground font-medium flex flex-row items-center py-1.5 px-2 gap-2'
                  )}
                  onClick={handleSignOut}
                >
                  <LogOutIcon className="text-primary" />
                  <span>Abmelden</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </PopoverContent>
      </Popover>
      <NavigationMenu className="max-lg:hidden">
        <NavigationMenuList className="gap-2">
          {adminRoutes.map((route, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                href={`${route.url}`}
                className={cn(
                  'text-muted-foreground font-medium flex flex-row items-center py-1.5 px-2 gap-1',
                  route.url === pathname && 'bg-muted text-foreground'
                )}
              >
                <route.icon className={cn('text-primary')} />
                {route.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuLink
              href="#signout"
              className={cn(
                'text-muted-foreground font-medium flex flex-row items-center py-1.5 px-2 gap-1'
              )}
              onClick={handleSignOut}
            >
              <LogOutIcon className="text-primary" />
              Abmelden
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default Nav
