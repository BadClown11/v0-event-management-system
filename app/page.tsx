"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EventCard } from "@/components/events/event-card"
import { EventDetailSheet } from "@/components/events/event-detail-sheet"
import {
  Search,
  CalendarIcon,
  CalendarDays,
  Sparkles,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Event {
  id: number
  name: string
  startDate: string
  endDate: string
  totalGifts: number
  assignedGifts: number
  raffles: string[]
  status: "open" | "closed"
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: "Navidad 2026",
    startDate: "06/15/2026",
    endDate: "12/25/2026",
    totalGifts: 150,
    assignedGifts: 68,
    raffles: ["Rifa RH", "Rifa LCD TV", "Rifa HM", "Rifa Especial", "Rifa VIP"],
    status: "open",
  },
  {
    id: 2,
    name: "Dia del Padre 2026",
    startDate: "06/01/2026",
    endDate: "06/20/2026",
    totalGifts: 80,
    assignedGifts: 45,
    raffles: ["Rifa General", "Rifa Premium"],
    status: "open",
  },
  {
    id: 3,
    name: "Dia de la Madre 2026",
    startDate: "05/01/2026",
    endDate: "05/10/2026",
    totalGifts: 100,
    assignedGifts: 100,
    raffles: ["Rifa Flores", "Rifa Spa"],
    status: "open",
  },
  {
    id: 4,
    name: "San Valentin 2026",
    startDate: "02/01/2026",
    endDate: "02/14/2026",
    totalGifts: 60,
    assignedGifts: 60,
    raffles: ["Rifa Parejas"],
    status: "closed",
  },
  {
    id: 5,
    name: "Navidad 2025",
    startDate: "11/15/2025",
    endDate: "12/25/2025",
    totalGifts: 200,
    assignedGifts: 200,
    raffles: ["Rifa Principal", "Rifa Ninos", "Rifa Premium"],
    status: "closed",
  },
  {
    id: 6,
    name: "Fin de Ano 2025",
    startDate: "12/20/2025",
    endDate: "12/31/2025",
    totalGifts: 50,
    assignedGifts: 50,
    raffles: ["Rifa Especial"],
    status: "closed",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      if (selectedDate) {
        const eventStart = new Date(event.startDate)
        const eventEnd = new Date(event.endDate)
        const matchesDate =
          selectedDate >= eventStart && selectedDate <= eventEnd
        return matchesSearch && matchesDate
      }

      return matchesSearch
    })
  }, [searchQuery, selectedDate])

  const openEvents = filteredEvents.filter((e) => e.status === "open")
  const closedEvents = filteredEvents.filter((e) => e.status === "closed")

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsSheetOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDate(undefined)
  }

  const hasActiveFilters = searchQuery || selectedDate

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <CalendarDays className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Eventos</h1>
                <p className="text-sm text-muted-foreground">
                  Gestion de eventos y rifas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {mockEvents.length} eventos totales
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters Section */}
        <div className="mb-8 p-4 rounded-xl bg-card border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar evento por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP", { locale: es })
                    : "Filtrar por fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t text-sm text-muted-foreground">
              <span>Filtros activos:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                  Busqueda: {searchQuery}
                </span>
              )}
              {selectedDate && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                  Fecha: {format(selectedDate, "PP", { locale: es })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Open Events Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold text-foreground">
              Eventos Abiertos
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
              {openEvents.length}
            </span>
          </div>

          {openEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {openEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed bg-muted/30">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No hay eventos abiertos
                {hasActiveFilters && " que coincidan con los filtros"}
              </p>
            </div>
          )}
        </section>

        {/* Closed Events Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Eventos Cerrados
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {closedEvents.length}
            </span>
          </div>

          {closedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {closedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed bg-muted/30">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No hay eventos cerrados
                {hasActiveFilters && " que coincidan con los filtros"}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Event Detail Sheet */}
      <EventDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        event={selectedEvent}
      />
    </div>
  )
}
