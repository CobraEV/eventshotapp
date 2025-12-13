'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  FileText,
  MapPin,
} from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'
import { PlanPicker } from './plan-picker'
import { cn } from '@/lib/utils'
import { de } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'

type PlanEnum = 'BASIC' | 'PREMIUM' | 'ENTERPRISE'

export function NewEventDialog({
  tenantId,
  onCreate,
  defaultPlan = 'PREMIUM',
}: {
  tenantId: number
  onCreate: (formData: FormData) => Promise<void> // Server Action vom Server-Component
  defaultPlan?: PlanEnum
}) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    location: '',
    description: '',
    date: '',
  })
  const [loading, setLoading] = React.useState(false)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  // Check if form is valid
  const isFormValid = React.useMemo(() => {
    return formData.name.trim() !== '' && formData.date.trim() !== ''
  }, [formData.name, formData.date])

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Disable Lenis smooth scroll when dialog is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (
        window as { lenis?: { stop: () => void; start: () => void } }
      ).lenis
      if (lenis) {
        if (open) {
          lenis.stop()
        } else {
          lenis.start()
        }
      }
    }
  }, [open])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        location: '',
        description: '',
        date: '',
      })
      setLoading(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Neues Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Neues Event erstellen
          </DialogTitle>
          <DialogDescription>
            Erstelle ein neues EventShot Event mit allen wichtigen Details. Du
            kannst diese später jederzeit anpassen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <form
            action={async (fd) => {
              setLoading(true)
              await onCreate(fd)
              setOpen(false)
            }}
            className="space-y-6"
            id="event-form"
          >
            <Input
              name="tenantId"
              defaultValue={tenantId}
              className="hidden"
              hidden
            />
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Grundinformationen
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event-Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="z. B. Firmenfeier 2025"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Veranstaltungsort</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="z. B. Hotel Bellevue, Zürich"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Beschreibe dein Event... (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={3}
                  className="resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Datum
                </h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Datum *</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.date && 'text-muted-foreground'
                      )}
                      type="button"
                      id="date"
                      aria-required="true"
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(new Date(formData.date), 'PPP', { locale: de })
                      ) : (
                        <span>Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={de}
                      selected={
                        formData.date ? new Date(formData.date) : undefined
                      }
                      onSelect={(date) => {
                        setDatePickerOpen(false)
                        if (date) {
                          // Store as yyyy-MM-dd
                          const local = format(date, 'yyyy-MM-dd')
                          handleInputChange('date', local)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {/* Hidden input for form submission */}
                <input
                  type="hidden"
                  name="date"
                  value={formData.date}
                  required
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <CalendarPlus className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Paket auswählen
                </h3>
              </div>

              <div className="space-y-2">
                <PlanPicker defaultPlan={defaultPlan} />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            form="event-form"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Wird angelegt...
              </span>
            ) : (
              'Event anlegen'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
