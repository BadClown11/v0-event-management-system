"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Gift,
  Users,
  Building2,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Copy,
  ClipboardPaste,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Table2,
  FileText,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Raffle {
  id: number
  name: string
  type: string
  manager: string
  area: string
  department: string
  level: string
  seniority: string
  contractType: string
  employees: number
  gifts: number
  percentage: number
  isEditing?: boolean
  isNew?: boolean
}

interface EventDetailModalProps {
  event: {
    id: number
    name: string
    startDate: string
    endDate: string
    totalGifts: number
    assignedGifts: number
    raffles: Array<{
      id: number
      name: string
      type: string
      manager: string
      area: string
      employees: number
      gifts: number
      percentage: number
    }>
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample data for dropdowns
const DEPARTMENTS = [
  "Recursos Humanos",
  "Finanzas",
  "Tecnologia",
  "Operaciones",
  "Ventas",
  "Marketing",
  "Legal",
  "Compras",
]

const LEVELS = Array.from({ length: 18 }, (_, i) => `Nivel ${i + 1}`)

const SENIORITY_OPTIONS = [
  "Menos de 1 año",
  "1-2 años",
  "3-5 años",
  "5-10 años",
  "Mas de 10 años",
]

const CONTRACT_TYPES = ["Permanente", "Temporal", "Por proyecto", "Practicante"]

const AREAS = [
  "Administracion",
  "Recursos Humanos",
  "LCD TV",
  "Montaje",
  "Calidad",
  "Ingenieria",
  "Produccion",
]

const MANAGERS = [
  { id: 1, name: "MERCEDES YARAZETH VILLANUEVA ALVARADO" },
  { id: 2, name: "JUAN CARLOS REYES COTA" },
  { id: 3, name: "OSCAR NATIVIDAD OSUNA LIZARRAGA" },
  { id: 4, name: "MARIA GUADALUPE FLORES" },
]

export function EventDetailModal({
  event,
  open,
  onOpenChange,
}: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState("rifas")
  const [addMode, setAddMode] = useState<"form" | "table" | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [copiedRow, setCopiedRow] = useState<Raffle | null>(null)
  
  // Raffle form state
  const [formData, setFormData] = useState({
    event: "",
    name: "",
    type: "area",
    manager: "",
    selectedAreas: [] as string[],
    selectedDepartments: [] as string[],
    contractType: "ALL",
    seniorityOperator: ">=",
    seniorityValue: "",
    levels: ["ALL"],
    gifts: "",
    percentage: "",
  })

  // Table data with editable rows
  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      id: 1,
      name: "Rifa RH",
      type: "area",
      manager: "MERCEDES YARAZETH VILLANUEVA ALVARADO",
      area: "Recursos Humanos",
      department: "RRHH General",
      level: "Nivel 5",
      seniority: "3-5 años",
      contractType: "Permanente",
      employees: 64,
      gifts: 40,
      percentage: 10,
    },
    {
      id: 2,
      name: "Rifa LCD TV",
      type: "area",
      manager: "JUAN CARLOS REYES COTA",
      area: "LCD TV",
      department: "Produccion",
      level: "Nivel 3",
      seniority: "1-2 años",
      contractType: "Permanente",
      employees: 1,
      gifts: 100,
      percentage: 35,
    },
    {
      id: 3,
      name: "Rifa HM",
      type: "area",
      manager: "OSCAR NATIVIDAD OSUNA LIZARRAGA",
      area: "Montaje",
      department: "Ensamble",
      level: "Nivel 4",
      seniority: "5-10 años",
      contractType: "Temporal",
      employees: 0,
      gifts: 10,
      percentage: 25,
    },
  ])

  const totalSteps = 4

  const resetForm = () => {
    setFormData({
      event: "",
      name: "",
      type: "area",
      manager: "",
      selectedAreas: [],
      selectedDepartments: [],
      contractType: "ALL",
      seniorityOperator: ">=",
      seniorityValue: "",
      levels: ["ALL"],
      gifts: "",
      percentage: "",
    })
    setCurrentStep(1)
    setAddMode(null)
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveRaffle = () => {
    const newRaffle: Raffle = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      manager: MANAGERS.find((m) => m.id.toString() === formData.manager)?.name || "",
      area: formData.selectedAreas.join(", "),
      department: formData.selectedDepartments.join(", "),
      level: formData.levels.join(", "),
      seniority: formData.seniorityValue ? `${formData.seniorityOperator} ${formData.seniorityValue} años` : "Todos",
      contractType: formData.contractType,
      employees: 0,
      gifts: parseInt(formData.gifts) || 0,
      percentage: parseInt(formData.percentage) || 0,
    }
    setRaffles([...raffles, newRaffle])
    resetForm()
  }

  // Table editing functions
  const addEmptyRow = useCallback(() => {
    const newRow: Raffle = {
      id: Date.now(),
      name: "",
      type: "area",
      manager: "",
      area: "",
      department: "",
      level: "",
      seniority: "",
      contractType: "",
      employees: 0,
      gifts: 0,
      percentage: 0,
      isEditing: true,
      isNew: true,
    }
    setRaffles((prev) => [...prev, newRow])
  }, [])

  const updateRaffle = (id: number, field: keyof Raffle, value: string | number) => {
    setRaffles(
      raffles.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const saveRow = (id: number) => {
    setRaffles(
      raffles.map((r) =>
        r.id === id ? { ...r, isEditing: false, isNew: false } : r
      )
    )
  }

  const deleteRow = (id: number) => {
    setRaffles(raffles.filter((r) => r.id !== id))
  }

  const startEditing = (id: number) => {
    setRaffles(raffles.map((r) => (r.id === id ? { ...r, isEditing: true } : r)))
  }

  const cancelEditing = (id: number) => {
    const raffle = raffles.find((r) => r.id === id)
    if (raffle?.isNew) {
      deleteRow(id)
    } else {
      setRaffles(raffles.map((r) => (r.id === id ? { ...r, isEditing: false } : r)))
    }
  }

  const copyRow = (raffle: Raffle) => {
    setCopiedRow({ ...raffle, id: 0, isEditing: false, isNew: false })
  }

  const pasteRow = useCallback(() => {
    if (copiedRow) {
      const newRow = { ...copiedRow, id: Date.now(), isNew: true, isEditing: true }
      setRaffles((prev) => [...prev, newRow])
    }
  }, [copiedRow])

  // Handle paste from clipboard (Excel-like)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (addMode !== "table") return
      
      const clipboardData = e.clipboardData?.getData("text")
      if (!clipboardData) return

      const rows = clipboardData.split("\n").filter((row) => row.trim())
      const newRaffles: Raffle[] = rows.map((row, index) => {
        const cells = row.split("\t")
        return {
          id: Date.now() + index,
          name: cells[0] || "",
          type: cells[1] || "area",
          manager: cells[2] || "",
          area: cells[3] || "",
          department: cells[4] || "",
          level: cells[5] || "",
          seniority: cells[6] || "",
          contractType: cells[7] || "",
          employees: parseInt(cells[8]) || 0,
          gifts: parseInt(cells[9]) || 0,
          percentage: parseInt(cells[10]) || 0,
          isNew: true,
          isEditing: true,
        }
      })
      setRaffles((prev) => [...prev, ...newRaffles])
    },
    [addMode]
  )

  useEffect(() => {
    if (addMode === "table") {
      document.addEventListener("paste", handlePaste)
      return () => document.removeEventListener("paste", handlePaste)
    }
  }, [addMode, handlePaste])

  if (!event) return null

  const assignedGifts = raffles.reduce((sum, r) => sum + r.gifts, 0)
  const availableGifts = event.totalGifts - assignedGifts

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 text-primary-foreground flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{event.name}</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 sr-only">
              Detalles del evento {event.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-8 mt-4 text-base">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {event.startDate} - {event.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span>{event.totalGifts} regalos totales</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30 p-5 flex-shrink-0 flex flex-col">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("rifas")}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all",
                  activeTab === "rifas"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Gift className="h-5 w-5" />
                Rifas
              </button>
              <button
                onClick={() => setActiveTab("asignacion")}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all",
                  activeTab === "asignacion"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-5 w-5" />
                Asignacion de regalos
              </button>
            </nav>

            {/* Stats */}
            <div className="mt-auto space-y-4">
              <div className="bg-card rounded-xl p-5 shadow-sm border">
                <div className="text-sm text-muted-foreground mb-2">Regalos asignados</div>
                <div className="text-3xl font-bold text-primary">{assignedGifts}</div>
                <div className="h-2.5 bg-muted rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(assignedGifts / event.totalGifts) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-card rounded-xl p-5 shadow-sm border">
                <div className="text-sm text-muted-foreground mb-2">Disponibles</div>
                <div className="text-3xl font-bold text-success">{availableGifts}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Rifas Tab */}
            {activeTab === "rifas" && (
              <div className="flex-1 flex flex-col overflow-hidden p-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <h3 className="text-xl font-semibold">Rifas del Evento</h3>
                  
                  {!addMode && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setAddMode("form")}
                        className="gap-2 h-11"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4" />
                        Agregar con Formulario
                      </Button>
                      <Button
                        onClick={() => {
                          setAddMode("table")
                          addEmptyRow()
                        }}
                        className="gap-2 h-11"
                      >
                        <Table2 className="h-4 w-4" />
                        Agregar en Tabla
                      </Button>
                    </div>
                  )}

                  {addMode === "table" && (
                    <div className="flex gap-3 items-center">
                      <Button
                        variant="outline"
                        onClick={addEmptyRow}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nueva Fila
                      </Button>
                      <Button
                        variant="outline"
                        onClick={pasteRow}
                        disabled={!copiedRow}
                        className="gap-2"
                      >
                        <ClipboardPaste className="h-4 w-4" />
                        Pegar Fila
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/70 px-4 py-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        Puedes pegar desde Excel (Ctrl+V)
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAddMode(null)}
                        className="h-10 w-10"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Wizard Form */}
                {addMode === "form" && (
                  <div className="bg-card border rounded-xl shadow-sm mb-5 overflow-hidden flex-shrink-0">
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                      />
                    </div>

                    <div className="p-6">
                      {/* Step 1: Evento */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-bold">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">Seleccionar Evento</h4>
                              <p className="text-sm text-muted-foreground">Paso 1 de 4</p>
                            </div>
                          </div>

                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                            <div className="flex items-center gap-3 text-primary">
                              <Check className="h-6 w-6" />
                              <span className="font-medium text-lg">Evento seleccionado: {event.name}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Info Rifa */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">Informacion de la Rifa</h4>
                              <p className="text-sm text-muted-foreground">Paso 2 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label>Nombre de la Rifa</Label>
                              <Input
                                placeholder="Ej: Rifa Area RH"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                                className="h-11"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo de Rifa</Label>
                              <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v })}
                              >
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">Rifa General</SelectItem>
                                  <SelectItem value="area">Rifa por Area</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label>Manager Responsable</Label>
                              <Select
                                value={formData.manager}
                                onValueChange={(v) => setFormData({ ...formData, manager: v })}
                              >
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Selecciona un manager" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MANAGERS.map((m) => (
                                    <SelectItem key={m.id} value={m.id.toString()}>
                                      {m.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Areas y Filtros */}
                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-bold">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">Areas, Departamentos y Filtros</h4>
                              <p className="text-sm text-muted-foreground">Paso 3 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {/* Areas */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <Label className="text-base">Areas</Label>
                              </div>
                              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-3">
                                {AREAS.map((area) => (
                                  <div key={area} className="flex items-center gap-3">
                                    <Checkbox
                                      id={area}
                                      checked={formData.selectedAreas.includes(area)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setFormData({
                                            ...formData,
                                            selectedAreas: [...formData.selectedAreas, area],
                                          })
                                        } else {
                                          setFormData({
                                            ...formData,
                                            selectedAreas: formData.selectedAreas.filter(
                                              (a) => a !== area
                                            ),
                                          })
                                        }
                                      }}
                                    />
                                    <label htmlFor={area} className="text-sm cursor-pointer">
                                      {area}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Filtros */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-primary" />
                                <Label className="text-base">Filtros de Empleados</Label>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-sm">Tipo de Contrato</Label>
                                  <Select
                                    value={formData.contractType}
                                    onValueChange={(v) =>
                                      setFormData({ ...formData, contractType: v })
                                    }
                                  >
                                    <SelectTrigger className="h-10">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ALL">Todos</SelectItem>
                                      <SelectItem value="TEMPORAL">Temporal</SelectItem>
                                      <SelectItem value="PERMANENTE">Permanente</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Antiguedad</Label>
                                  <div className="flex gap-2">
                                    <Select
                                      value={formData.seniorityOperator}
                                      onValueChange={(v) =>
                                        setFormData({ ...formData, seniorityOperator: v })
                                      }
                                    >
                                      <SelectTrigger className="w-24 h-10">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value=">=">Mayor o igual</SelectItem>
                                        <SelectItem value="<=">Menor o igual</SelectItem>
                                        <SelectItem value="=">Igual</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      placeholder="Años"
                                      className="h-10"
                                      value={formData.seniorityValue}
                                      onChange={(e) =>
                                        setFormData({ ...formData, seniorityValue: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Niveles</Label>
                                  <Select>
                                    <SelectTrigger className="h-10">
                                      <SelectValue placeholder="Todos los niveles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ALL">Todos los niveles</SelectItem>
                                      {Array.from({ length: 18 }, (_, i) => (
                                        <SelectItem key={i} value={`${i + 1}`}>
                                          Nivel {i + 1}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Resumen */}
                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-bold">
                              4
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">Resumen y Configuracion Final</h4>
                              <p className="text-sm text-muted-foreground">Paso 4 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {/* Summary */}
                            <div className="bg-muted/50 rounded-lg p-5 space-y-4">
                              <h5 className="font-medium text-base">Resumen de la Rifa</h5>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Evento:</span>
                                  <span className="font-medium">{event.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Nombre:</span>
                                  <span className="font-medium">{formData.name || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tipo:</span>
                                  <span className="font-medium">{formData.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Areas:</span>
                                  <span className="font-medium">
                                    {formData.selectedAreas.length > 0
                                      ? formData.selectedAreas.join(", ")
                                      : "-"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Gift Assignment */}
                            <div className="space-y-4">
                              <div className="bg-card border rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-4">
                                  <Gift className="h-5 w-5 text-primary" />
                                  <h5 className="font-medium">Disponibilidad de Regalos</h5>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold">{event.totalGifts}</div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-accent">{assignedGifts}</div>
                                    <div className="text-xs text-muted-foreground">Asignados</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-success">{availableGifts}</div>
                                    <div className="text-xs text-muted-foreground">Disponibles</div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Cantidad de Regalos</Label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-11"
                                    value={formData.gifts}
                                    onChange={(e) =>
                                      setFormData({ ...formData, gifts: e.target.value })
                                    }
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Maximo: {availableGifts}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Porcentaje (%)</Label>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-11"
                                    max={100}
                                    value={formData.percentage}
                                    onChange={(e) =>
                                      setFormData({ ...formData, percentage: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between mt-6 pt-5 border-t">
                        <Button
                          variant="outline"
                          onClick={currentStep === 1 ? resetForm : handlePrevStep}
                          className="gap-2 h-11"
                        >
                          {currentStep === 1 ? (
                            <>Cancelar</>
                          ) : (
                            <>
                              <ChevronLeft className="h-4 w-4" />
                              Anterior
                            </>
                          )}
                        </Button>
                        {currentStep < totalSteps ? (
                          <Button onClick={handleNextStep} className="gap-2 h-11">
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button onClick={handleSaveRaffle} className="gap-2 h-11 bg-success hover:bg-success/90 text-success-foreground">
                            <Save className="h-4 w-4" />
                            Guardar Rifa
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table Container with scroll */}
                <div className="flex-1 border rounded-xl overflow-hidden bg-card min-h-0">
                  <div className="h-full overflow-auto">
                    <table className="w-full" style={{ minWidth: "1600px" }}>
                      <thead className="bg-muted/50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Nombre Rifa
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Tipo
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Manager
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Area
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Departamento
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Nivel
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Antiguedad
                          </th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Tipo Contrato
                          </th>
                          <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Empleados
                          </th>
                          <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            # Regalos
                          </th>
                          <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            %
                          </th>
                          <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {raffles.map((raffle) => (
                          <tr
                            key={raffle.id}
                            className={cn(
                              "hover:bg-muted/30 transition-colors",
                              raffle.isNew && "bg-primary/5"
                            )}
                          >
                            {raffle.isEditing ? (
                              <>
                                <td className="px-3 py-3">
                                  <Input
                                    className="h-9 text-sm min-w-[120px]"
                                    value={raffle.name}
                                    onChange={(e) =>
                                      updateRaffle(raffle.id, "name", e.target.value)
                                    }
                                    placeholder="Nombre"
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.type}
                                    onValueChange={(v) => updateRaffle(raffle.id, "type", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[100px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="area">area</SelectItem>
                                      <SelectItem value="general">general</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.manager}
                                    onValueChange={(v) => updateRaffle(raffle.id, "manager", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[180px]">
                                      <SelectValue placeholder="Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {MANAGERS.map((m) => (
                                        <SelectItem key={m.id} value={m.name}>
                                          {m.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.area}
                                    onValueChange={(v) => updateRaffle(raffle.id, "area", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[120px]">
                                      <SelectValue placeholder="Area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {AREAS.map((area) => (
                                        <SelectItem key={area} value={area}>
                                          {area}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.department}
                                    onValueChange={(v) => updateRaffle(raffle.id, "department", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[120px]">
                                      <SelectValue placeholder="Depto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DEPARTMENTS.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                          {dept}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.level}
                                    onValueChange={(v) => updateRaffle(raffle.id, "level", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[100px]">
                                      <SelectValue placeholder="Nivel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {LEVELS.map((level) => (
                                        <SelectItem key={level} value={level}>
                                          {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.seniority}
                                    onValueChange={(v) => updateRaffle(raffle.id, "seniority", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[110px]">
                                      <SelectValue placeholder="Antiguedad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SENIORITY_OPTIONS.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                          {opt}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Select
                                    value={raffle.contractType}
                                    onValueChange={(v) => updateRaffle(raffle.id, "contractType", v)}
                                  >
                                    <SelectTrigger className="h-9 text-sm min-w-[110px]">
                                      <SelectValue placeholder="Contrato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {CONTRACT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-3 py-3">
                                  <Input
                                    type="number"
                                    className="h-9 text-sm text-center w-20"
                                    value={raffle.employees}
                                    onChange={(e) =>
                                      updateRaffle(raffle.id, "employees", parseInt(e.target.value) || 0)
                                    }
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <Input
                                    type="number"
                                    className="h-9 text-sm text-center w-20"
                                    value={raffle.gifts}
                                    onChange={(e) =>
                                      updateRaffle(raffle.id, "gifts", parseInt(e.target.value) || 0)
                                    }
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <Input
                                    type="number"
                                    className="h-9 text-sm text-center w-16"
                                    value={raffle.percentage}
                                    onChange={(e) =>
                                      updateRaffle(raffle.id, "percentage", parseInt(e.target.value) || 0)
                                    }
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                      onClick={() => saveRow(raffle.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => cancelEditing(raffle.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                  {raffle.name}
                                </td>
                                <td className="px-4 py-4">
                                  <Badge variant="secondary" className="text-xs">
                                    {raffle.type}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                                  {raffle.manager}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">{raffle.area}</td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">{raffle.department}</td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">{raffle.level}</td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">{raffle.seniority}</td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">{raffle.contractType}</td>
                                <td className="px-4 py-4 text-center">
                                  <Badge
                                    variant={raffle.employees > 0 ? "default" : "secondary"}
                                    className={cn(
                                      "min-w-[40px]",
                                      raffle.employees > 0 ? "bg-primary" : ""
                                    )}
                                  >
                                    {raffle.employees}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-center font-semibold">{raffle.gifts}</td>
                                <td className="px-4 py-4 text-center text-muted-foreground">
                                  {raffle.percentage}%
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                      onClick={() => startEditing(raffle.id)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                      onClick={() => copyRow(raffle)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => deleteRow(raffle.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Asignacion Tab */}
            {activeTab === "asignacion" && (
              <div className="flex-1 p-6 overflow-auto">
                <div className="text-center py-16 text-muted-foreground">
                  <Gift className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-medium mb-2">Asignacion de Regalos a Rifas</h3>
                  <p className="text-sm">Esta seccion te permite asignar regalos a las rifas creadas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
