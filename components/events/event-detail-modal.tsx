"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [showRaffleForm, setShowRaffleForm] = useState(false)
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
    setShowRaffleForm(false)
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
  const addEmptyRow = () => {
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
    setRaffles([...raffles, newRow])
  }

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

  const pasteRow = () => {
    if (copiedRow) {
      const newRow = { ...copiedRow, id: Date.now(), isNew: true, isEditing: true }
      setRaffles([...raffles, newRow])
    }
  }

  // Handle paste from clipboard (Excel-like)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
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
      setRaffles([...raffles, ...newRaffles])
    },
    [raffles]
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
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-6 mt-3 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {event.startDate} - {event.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span>{event.totalGifts} regalos totales</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r bg-muted/30 p-4 flex-shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("rifas")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === "rifas"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Gift className="h-4 w-4" />
                Rifas
              </button>
              <button
                onClick={() => setActiveTab("asignacion")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === "asignacion"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                Asignacion de regalos
              </button>
            </nav>

            {/* Stats */}
            <div className="mt-8 space-y-4">
              <div className="bg-card rounded-xl p-4 shadow-sm border">
                <div className="text-xs text-muted-foreground mb-1">Regalos asignados</div>
                <div className="text-2xl font-bold text-primary">{assignedGifts}</div>
                <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(assignedGifts / event.totalGifts) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-sm border">
                <div className="text-xs text-muted-foreground mb-1">Disponibles</div>
                <div className="text-2xl font-bold text-success">{availableGifts}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Rifas Tab */}
            {activeTab === "rifas" && (
              <div className="flex-1 flex flex-col overflow-hidden p-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rifas del Evento</h3>
                  
                  {!showRaffleForm && !addMode && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setAddMode("form")}
                        className="gap-2"
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
                        className="gap-2"
                      >
                        <Table2 className="h-4 w-4" />
                        Agregar en Tabla
                      </Button>
                    </div>
                  )}

                  {addMode === "table" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addEmptyRow}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nueva Fila
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={pasteRow}
                        disabled={!copiedRow}
                        className="gap-2"
                      >
                        <ClipboardPaste className="h-4 w-4" />
                        Pegar Fila
                      </Button>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
                        <AlertCircle className="h-3 w-3" />
                        Puedes pegar desde Excel (Ctrl+V)
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddMode(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Wizard Form */}
                {addMode === "form" && (
                  <div className="bg-card border rounded-xl shadow-sm mb-4 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="h-1 bg-muted">
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
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold">Seleccionar Evento</h4>
                              <p className="text-sm text-muted-foreground">Paso 1 de 4</p>
                            </div>
                          </div>

                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="h-5 w-5" />
                              <span className="font-medium">Evento seleccionado: {event.name}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Info Rifa */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold">Informacion de la Rifa</h4>
                              <p className="text-sm text-muted-foreground">Paso 2 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nombre de la Rifa</Label>
                              <Input
                                placeholder="Ej: Rifa Area RH"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo de Rifa</Label>
                              <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v })}
                              >
                                <SelectTrigger>
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
                                <SelectTrigger>
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
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold">Areas, Departamentos y Filtros</h4>
                              <p className="text-sm text-muted-foreground">Paso 3 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {/* Areas */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <Label>Areas</Label>
                              </div>
                              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                {AREAS.map((area) => (
                                  <div key={area} className="flex items-center gap-2">
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
                                <Filter className="h-4 w-4 text-primary" />
                                <Label>Filtros de Empleados</Label>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label className="text-xs">Tipo de Contrato</Label>
                                  <Select
                                    value={formData.contractType}
                                    onValueChange={(v) =>
                                      setFormData({ ...formData, contractType: v })
                                    }
                                  >
                                    <SelectTrigger className="h-9">
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
                                  <Label className="text-xs">Antiguedad</Label>
                                  <div className="flex gap-2">
                                    <Select
                                      value={formData.seniorityOperator}
                                      onValueChange={(v) =>
                                        setFormData({ ...formData, seniorityOperator: v })
                                      }
                                    >
                                      <SelectTrigger className="w-20 h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value=">=">≥</SelectItem>
                                        <SelectItem value="<=">≤</SelectItem>
                                        <SelectItem value="=">=</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      placeholder="Años"
                                      className="h-9"
                                      value={formData.seniorityValue}
                                      onChange={(e) =>
                                        setFormData({ ...formData, seniorityValue: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs">Niveles</Label>
                                  <Select>
                                    <SelectTrigger className="h-9">
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
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              4
                            </div>
                            <div>
                              <h4 className="font-semibold">Resumen y Configuracion Final</h4>
                              <p className="text-sm text-muted-foreground">Paso 4 de 4</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {/* Summary */}
                            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                              <h5 className="font-medium">Resumen de la Rifa</h5>
                              <div className="space-y-2 text-sm">
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
                              <div className="bg-card border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Gift className="h-4 w-4 text-primary" />
                                  <h5 className="font-medium">Disponibilidad de Regalos</h5>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                  <div>
                                    <div className="text-2xl font-bold">{event.totalGifts}</div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-warning">{assignedGifts}</div>
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
                      <div className="flex justify-between mt-6 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={currentStep === 1 ? resetForm : handlePrevStep}
                          className="gap-2"
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
                          <Button onClick={handleNextStep} className="gap-2">
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button onClick={handleSaveRaffle} className="gap-2 bg-success hover:bg-success/90">
                            <Save className="h-4 w-4" />
                            Guardar Rifa
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="flex-1 border rounded-xl overflow-hidden bg-card">
                  <ScrollArea className="h-full">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1400px]">
                        <thead className="bg-muted/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[140px]">
                              Nombre Rifa
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[80px]">
                              Tipo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[200px]">
                              Manager
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]">
                              Area
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]">
                              Departamento
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">
                              Nivel
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">
                              Antiguedad
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[110px]">
                              Tipo Contrato
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[80px]">
                              Empleados
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[80px]">
                              # Regalos
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[60px]">
                              %
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]">
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
                                  <td className="px-2 py-2">
                                    <Input
                                      className="h-8 text-sm"
                                      value={raffle.name}
                                      onChange={(e) =>
                                        updateRaffle(raffle.id, "name", e.target.value)
                                      }
                                      placeholder="Nombre"
                                    />
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.type}
                                      onValueChange={(v) => updateRaffle(raffle.id, "type", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="area">area</SelectItem>
                                        <SelectItem value="general">general</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.manager}
                                      onValueChange={(v) => updateRaffle(raffle.id, "manager", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
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
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.area}
                                      onValueChange={(v) => updateRaffle(raffle.id, "area", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Area" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {AREAS.map((a) => (
                                          <SelectItem key={a} value={a}>
                                            {a}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.department}
                                      onValueChange={(v) => updateRaffle(raffle.id, "department", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Depto" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {DEPARTMENTS.map((d) => (
                                          <SelectItem key={d} value={d}>
                                            {d}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.level}
                                      onValueChange={(v) => updateRaffle(raffle.id, "level", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Nivel" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {LEVELS.map((l) => (
                                          <SelectItem key={l} value={l}>
                                            {l}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.seniority}
                                      onValueChange={(v) => updateRaffle(raffle.id, "seniority", v)}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Antiguedad" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {SENIORITY_OPTIONS.map((s) => (
                                          <SelectItem key={s} value={s}>
                                            {s}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2">
                                    <Select
                                      value={raffle.contractType}
                                      onValueChange={(v) =>
                                        updateRaffle(raffle.id, "contractType", v)
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Contrato" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {CONTRACT_TYPES.map((c) => (
                                          <SelectItem key={c} value={c}>
                                            {c}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-2 py-2 text-center">
                                    <Input
                                      type="number"
                                      className="h-8 text-sm w-16 mx-auto text-center"
                                      value={raffle.employees}
                                      onChange={(e) =>
                                        updateRaffle(raffle.id, "employees", parseInt(e.target.value) || 0)
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-2 text-center">
                                    <Input
                                      type="number"
                                      className="h-8 text-sm w-16 mx-auto text-center"
                                      value={raffle.gifts}
                                      onChange={(e) =>
                                        updateRaffle(raffle.id, "gifts", parseInt(e.target.value) || 0)
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-2 text-center">
                                    <Input
                                      type="number"
                                      className="h-8 text-sm w-14 mx-auto text-center"
                                      value={raffle.percentage}
                                      onChange={(e) =>
                                        updateRaffle(raffle.id, "percentage", parseInt(e.target.value) || 0)
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-2">
                                    <div className="flex items-center justify-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-success hover:text-success"
                                        onClick={() => saveRow(raffle.id)}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={() => cancelEditing(raffle.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-3 text-sm font-medium">{raffle.name}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="secondary" className="text-xs">
                                      {raffle.type}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm">{raffle.manager}</td>
                                  <td className="px-4 py-3 text-sm">{raffle.area}</td>
                                  <td className="px-4 py-3 text-sm">{raffle.department}</td>
                                  <td className="px-4 py-3 text-sm">{raffle.level}</td>
                                  <td className="px-4 py-3 text-sm">{raffle.seniority}</td>
                                  <td className="px-4 py-3 text-sm">{raffle.contractType}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-primary font-semibold cursor-pointer hover:underline">
                                      {raffle.employees}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center font-medium">{raffle.gifts}</td>
                                  <td className="px-4 py-3 text-center">{raffle.percentage}%</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => startEditing(raffle.id)}
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => copyRow(raffle)}
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={() => deleteRow(raffle.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
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
                  </ScrollArea>
                </div>
              </div>
            )}

            {/* Asignacion Tab */}
            {activeTab === "asignacion" && (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">Asignacion de Regalos a Rifas</h3>
                    <p className="text-sm mt-2">Esta seccion estara disponible proximamente</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
