"use client"

import { Calendar, Gift, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EventCardProps {
  id: number
  name: string
  startDate: string
  endDate: string
  totalGifts: number
  raffles: string[]
  status: "open" | "closed"
  onClick: () => void
}

export function EventCard({
  name,
  startDate,
  endDate,
  totalGifts,
  raffles,
  status,
  onClick,
}: EventCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:border-primary/30 hover:-translate-y-1",
        status === "closed" && "opacity-75"
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5 rounded-t-xl",
          status === "open" ? "bg-success" : "bg-muted-foreground/40"
        )}
      />

      {/* Header */}
      <div className="mb-4 pt-2">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <Badge
          variant={status === "open" ? "default" : "secondary"}
          className={cn(
            "mt-2 text-xs",
            status === "open" ? "bg-success text-success-foreground" : ""
          )}
        >
          {status === "open" ? "Abierto" : "Cerrado"}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>
            {startDate} - {endDate}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Gift className="h-4 w-4 text-accent" />
          <span>{totalGifts} regalos asignados</span>
        </div>

        {/* Raffles scroll */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Rifas asignadas ({raffles.length})
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {raffles.length > 0 ? (
              raffles.map((raffle, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="shrink-0 text-xs bg-secondary/50 hover:bg-secondary"
                >
                  {raffle}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Sin rifas asignadas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}
