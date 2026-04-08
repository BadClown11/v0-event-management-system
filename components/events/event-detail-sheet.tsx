"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Gift, Ticket, Users, Plus, Pencil, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Raffle {
  id: number
  name: string
  type: string
  manager: string
  area: string
  employees: number
  gifts: number
  percentage: number
  department?: string
  level?: string
  seniority?: string
  contractType?: string
}

interface EventDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: {
    id: number
    name: string
    startDate: string
    endDate: string
    totalGifts: number
    assignedGifts: number
    status: "open" | "closed"
  } | null
}

const DEPARTMENTS = [
  "Recursos Humanos",
  "Finanzas",
  "Tecnologia",
  "Operaciones",
  "Ventas",
  "Marketing",
  "Legal",
  "Administracion",
]

const LEVELS = Array.from({ length: 18 }, (_, i) => `Nivel ${i + 1}`)

const SENIORITY_OPTIONS = [
  "0-1 anos",
  "1-3 anos",
  "3-5 anos",
  "5-10 anos",
  "10+ anos",
]

const CONTRACT_TYPES = ["Permanente", "Temporal", "Por proyecto", "Eventual"]

const mockRaffles: Raffle[] = [
  {
    id: 1,
    name: "Rifa RH",
    type: "area",
    manager: "MERCEDES YARAZETH VILLANUEVA ALVARADO",
    area: "Recursos Humanos",
    employees: 64,
    gifts: 40,
    percentage: 10,
    department: "Recursos Humanos",
    level: "Nivel 5",
    seniority: "3-5 anos",
    contractType: "Permanente",
  },
  {
    id: 2,
    name: "Rifa LCD TV",
    type: "area",
    manager: "JUAN CARLOS REYES COTA",
    area: "LCD TV",
    employees: 1,
    gifts: 100,
    percentage: 35,
    department: "Tecnologia",
    level: "Nivel 8",
    seniority: "5-10 anos",
    contractType: "Permanente",
  },
  {
    id: 3,
    name: "Rifa HM",
    type: "area",
    manager: "OSCAR NATIVIDAD OSUNA LIZARRAGA",
    area: "Montaje",
    employees: 0,
    gifts: 10,
    percentage: 25,
    department: "Operaciones",
    level: "Nivel 3",
    seniority: "1-3 anos",
    contractType: "Temporal",
  },
]

export function EventDetailSheet({
  open,
  onOpenChange,
  event,
}: EventDetailSheetProps) {
  const [raffles, setRaffles] = useState<Raffle[]>(mockRaffles)
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (!event) return null

  const pendingGifts = event.totalGifts - event.assignedGifts

  const handleEditRaffle = (raffle: Raffle) => {
    setEditingRaffle(raffle)
    setIsEditDialogOpen(true)
  }

  const handleUpdateRaffle = (
    raffleId: number,
    field: keyof Raffle,
    value: string
  ) => {
    setRaffles((prev) =>
      prev.map((r) => (r.id === raffleId ? { ...r, [field]: value } : r))
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary-foreground">
              {event.name}
            </SheetTitle>
            <div className="flex items-center gap-4 mt-2 text-primary-foreground/80 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {event.startDate} - {event.endDate}
                </span>
              </div>
              <Badge
                className={cn(
                  "text-xs",
                  event.status === "open"
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {event.status === "open" ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </SheetHeader>
        </div>

        <Tabs defaultValue="raffles" className="flex-1">
          <div className="px-6 pt-4 border-b">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="raffles" className="gap-2">
                <Ticket className="h-4 w-4" />
                Rifas
              </TabsTrigger>
              <TabsTrigger value="gifts" className="gap-2">
                <Gift className="h-4 w-4" />
                Asignacion de regalos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="raffles" className="mt-0 p-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Regalos asignados
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {event.assignedGifts}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Gift className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Regalos por asignar
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {pendingGifts}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-end mb-4">
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4" />
                Agregar nueva rifa
              </Button>
            </div>

            {/* Raffles table */}
            <ScrollArea className="h-[400px] rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <TableRow>
                    <TableHead className="font-semibold">Nombre Rifa</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold">Area</TableHead>
                    <TableHead className="font-semibold">Departamento</TableHead>
                    <TableHead className="font-semibold">Nivel</TableHead>
                    <TableHead className="font-semibold">Antiguedad</TableHead>
                    <TableHead className="font-semibold">Contrato</TableHead>
                    <TableHead className="text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        Empleados
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      # Regalos
                    </TableHead>
                    <TableHead className="text-center font-semibold">%</TableHead>
                    <TableHead className="text-center font-semibold">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {raffles.map((raffle) => (
                    <TableRow
                      key={raffle.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{raffle.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {raffle.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-sm">
                        {raffle.manager}
                      </TableCell>
                      <TableCell>{raffle.area}</TableCell>
                      <TableCell>
                        <Select
                          value={raffle.department}
                          onValueChange={(value) =>
                            handleUpdateRaffle(raffle.id, "department", value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px] text-xs">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={raffle.level}
                          onValueChange={(value) =>
                            handleUpdateRaffle(raffle.id, "level", value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[100px] text-xs">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={raffle.seniority}
                          onValueChange={(value) =>
                            handleUpdateRaffle(raffle.id, "seniority", value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[100px] text-xs">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {SENIORITY_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={raffle.contractType}
                          onValueChange={(value) =>
                            handleUpdateRaffle(raffle.id, "contractType", value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[110px] text-xs">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTRACT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-10 h-6 rounded text-sm font-medium",
                            raffle.employees > 0
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent"
                          )}
                        >
                          {raffle.employees}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {raffle.gifts}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">
                          {raffle.percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 h-8 text-xs hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleEditRaffle(raffle)}
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gifts" className="mt-0 p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <Gift className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Asignacion de regalos a rifas</p>
              <p className="text-sm">
                Aqui podras gestionar la distribucion de regalos
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Rifa: {editingRaffle?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre de la rifa</Label>
                <Input defaultValue={editingRaffle?.name} />
              </div>
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input defaultValue={editingRaffle?.manager} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Numero de regalos</Label>
                  <Input type="number" defaultValue={editingRaffle?.gifts} />
                </div>
                <div className="space-y-2">
                  <Label>Porcentaje</Label>
                  <Input type="number" defaultValue={editingRaffle?.percentage} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  Guardar cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  )
}
