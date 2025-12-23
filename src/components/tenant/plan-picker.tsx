// components/subdomain/plan-picker.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { pricingPlans } from '@/lib/constants'
import { CheckIcon, Info } from 'lucide-react'
import * as React from 'react'

type PlanEnum = 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
const toEnum = (name: string): PlanEnum => name.toUpperCase() as PlanEnum

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ')
}

export function PlanPicker({ defaultPlan = 'PREMIUM' as PlanEnum }) {
  const [selected, setSelected] = React.useState<PlanEnum>(defaultPlan)

  return (
    <>
      {/* Server Action erhält plan=BASIC|PREMIUM|ENTERPRISE */}
      <input type="hidden" name="plan" value={selected} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {pricingPlans.map((p) => {
          const key = toEnum(p.name)
          const active = key === selected
          return (
            <div
              key={p.name}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onClick={() => setSelected(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelected(key)
              }}
              className={cn(
                'relative rounded-lg border p-3 text-left transition-all cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-primary ring-1 ring-primary/30 shadow-sm bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      'inline-block size-2 rounded-full shrink-0',
                      active ? 'bg-primary' : 'bg-muted-foreground/40'
                    )}
                    aria-hidden
                  />
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium text-sm truncate">
                      {p.name}
                    </span>
                    {p.highlighted && (
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] px-1 py-0.5 shrink-0"
                      >
                        Meistgewählt
                      </Badge>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-muted rounded-full transition-colors touch-manipulation shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="h-4 w-4 sm:h-3 sm:w-3 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-80 sm:w-80 p-4"
                      side="top"
                      sideOffset={8}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">
                            {p.name} Features
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {p.features.map((feature, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                              <CheckIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.description}
                </div>
                <div className="text-sm font-semibold">
                  {p.price}{' '}
                  <span className="text-xs text-muted-foreground">
                    {p.duration}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
