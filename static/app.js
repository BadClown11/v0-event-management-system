// ===================================
// Event Management System - Main JavaScript
// ===================================

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initializeApp();
});

// ===================================
// Data
// ===================================

const mockEvents = [
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
];

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
];

const LEVELS = Array.from({ length: 18 }, (_, i) => `Nivel ${i + 1}`);

const SENIORITY_OPTIONS = [
  "Menos de 1 ano",
  "1-2 anos",
  "3-5 anos",
  "5-10 anos",
  "Mas de 10 anos",
];

const CONTRACT_TYPES = ["Permanente", "Temporal", "Por proyecto", "Practicante"];

const AREAS = [
  "Administracion",
  "Recursos Humanos",
  "LCD TV",
  "Montaje",
  "Calidad",
  "Ingenieria",
  "Produccion",
];

const MANAGERS = [
  { id: 1, name: "MERCEDES YARAZETH VILLANUEVA ALVARADO" },
  { id: 2, name: "JUAN CARLOS REYES COTA" },
  { id: 3, name: "OSCAR NATIVIDAD OSUNA LIZARRAGA" },
  { id: 4, name: "MARIA GUADALUPE FLORES" },
];

// ===================================
// State
// ===================================

let state = {
  searchQuery: "",
  selectedDate: null,
  selectedEvent: null,
  isModalOpen: false,
  activeTab: "rifas",
  addMode: null, // null, 'form', 'table'
  currentStep: 1,
  copiedRow: null,
  raffles: [
    {
      id: 1,
      name: "Rifa RH",
      type: "area",
      manager: "MERCEDES YARAZETH VILLANUEVA ALVARADO",
      area: "Recursos Humanos",
      department: "RRHH General",
      level: "Nivel 5",
      seniority: "3-5 anos",
      contractType: "Permanente",
      employees: 64,
      gifts: 40,
      percentage: 10,
      isEditing: false,
      isNew: false,
    },
    {
      id: 2,
      name: "Rifa LCD TV",
      type: "area",
      manager: "JUAN CARLOS REYES COTA",
      area: "LCD TV",
      department: "Produccion",
      level: "Nivel 3",
      seniority: "1-2 anos",
      contractType: "Permanente",
      employees: 1,
      gifts: 100,
      percentage: 35,
      isEditing: false,
      isNew: false,
    },
    {
      id: 3,
      name: "Rifa HM",
      type: "area",
      manager: "OSCAR NATIVIDAD OSUNA LIZARRAGA",
      area: "Montaje",
      department: "Ensamble",
      level: "Nivel 4",
      seniority: "5-10 anos",
      contractType: "Temporal",
      employees: 0,
      gifts: 10,
      percentage: 25,
      isEditing: false,
      isNew: false,
    },
  ],
  formData: {
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
  },
  formErrors: {},
};

// ===================================
// Utility Functions
// ===================================

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return dateFns.format(date, "PPP", { locale: dateFns.locale.es });
}

function parseDate(dateStr) {
  const parts = dateStr.split("/");
  return new Date(parts[2], parts[0] - 1, parts[1]);
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === "success" ? "check" : "alert-circle"}" class="icon-md"></i>
    <span class="font-medium">${message}</span>
    <button onclick="this.parentElement.remove()">
      <i data-lucide="x" class="icon-sm"></i>
    </button>
  `;
  container.appendChild(toast);
  
  // Re-create icons in toast
  toast.querySelectorAll('[data-lucide]').forEach(el => {
    const iconName = el.getAttribute('data-lucide');
    el.innerHTML = '';
    const iconSvg = lucide.icons[iconName];
    if (iconSvg) {
      el.innerHTML = iconSvg.toSvg({ class: el.className });
    }
  });
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ===================================
// Event Card Component
// ===================================

function createEventCard(event) {
  const card = document.createElement("div");
  card.className = `event-card ${event.status === "closed" ? "closed" : ""}`;
  card.onclick = () => openEventModal(event);

  card.innerHTML = `
    <div class="status-bar ${event.status}"></div>
    <div class="hover-overlay"></div>
    
    <div class="card-header">
      <h3 class="card-title">${event.name}</h3>
      <span class="badge ${event.status === "open" ? "badge-success" : "badge-secondary"}" style="margin-top: 8px; display: inline-block;">
        ${event.status === "open" ? "Abierto" : "Cerrado"}
      </span>
    </div>

    <div class="card-content">
      <div class="card-info-row">
        <i data-lucide="calendar" class="icon-sm" style="color: var(--primary);"></i>
        <span>${event.startDate} - ${event.endDate}</span>
      </div>

      <div class="card-info-row">
        <i data-lucide="gift" class="icon-sm" style="color: var(--accent);"></i>
        <span>${event.totalGifts} regalos asignados</span>
      </div>

      <div class="card-divider">
        <div class="raffles-header">
          <i data-lucide="ticket" class="icon-sm" style="color: var(--primary);"></i>
          <span class="text-xs font-medium text-muted">Rifas asignadas (${event.raffles.length})</span>
        </div>
        <div class="raffles-scroll">
          ${
            event.raffles.length > 0
              ? event.raffles
                  .map(
                    (raffle) =>
                      `<span class="badge badge-outline">${raffle}</span>`
                  )
                  .join("")
              : '<span class="text-xs text-muted" style="font-style: italic;">Sin rifas asignadas</span>'
          }
        </div>
      </div>
    </div>
  `;

  return card;
}

// ===================================
// Render Functions
// ===================================

function renderEvents() {
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase());

    if (state.selectedDate) {
      const eventStart = parseDate(event.startDate);
      const eventEnd = parseDate(event.endDate);
      const matchesDate =
        state.selectedDate >= eventStart && state.selectedDate <= eventEnd;
      return matchesSearch && matchesDate;
    }

    return matchesSearch;
  });

  const openEvents = filteredEvents.filter((e) => e.status === "open");
  const closedEvents = filteredEvents.filter((e) => e.status === "closed");

  // Update counts
  document.getElementById("total-events-count").textContent = `${mockEvents.length} eventos totales`;
  document.getElementById("open-events-count").textContent = openEvents.length;
  document.getElementById("closed-events-count").textContent = closedEvents.length;

  // Render open events
  const openGrid = document.getElementById("open-events-grid");
  const openEmpty = document.getElementById("open-events-empty");
  openGrid.innerHTML = "";

  if (openEvents.length > 0) {
    openGrid.classList.remove("hidden");
    openEmpty.classList.add("hidden");
    openEvents.forEach((event) => {
      openGrid.appendChild(createEventCard(event));
    });
  } else {
    openGrid.classList.add("hidden");
    openEmpty.classList.remove("hidden");
    const hasFilters = state.searchQuery || state.selectedDate;
    openEmpty.querySelector("p").textContent = hasFilters
      ? "No hay eventos abiertos que coincidan con los filtros"
      : "No hay eventos abiertos";
  }

  // Render closed events
  const closedGrid = document.getElementById("closed-events-grid");
  const closedEmpty = document.getElementById("closed-events-empty");
  closedGrid.innerHTML = "";

  if (closedEvents.length > 0) {
    closedGrid.classList.remove("hidden");
    closedEmpty.classList.add("hidden");
    closedEvents.forEach((event) => {
      closedGrid.appendChild(createEventCard(event));
    });
  } else {
    closedGrid.classList.add("hidden");
    closedEmpty.classList.remove("hidden");
    const hasFilters = state.searchQuery || state.selectedDate;
    closedEmpty.querySelector("p").textContent = hasFilters
      ? "No hay eventos cerrados que coincidan con los filtros"
      : "No hay eventos cerrados";
  }

  // Re-initialize icons
  lucide.createIcons();

  // Update active filters display
  updateFiltersDisplay();
}

function updateFiltersDisplay() {
  const hasFilters = state.searchQuery || state.selectedDate;
  const activeFilters = document.getElementById("active-filters");
  const clearBtn = document.getElementById("clear-filters-btn");
  const searchBadge = document.getElementById("search-filter-badge");
  const dateBadge = document.getElementById("date-filter-badge");

  if (hasFilters) {
    activeFilters.classList.remove("hidden");
    clearBtn.classList.remove("hidden");

    if (state.searchQuery) {
      searchBadge.classList.remove("hidden");
      searchBadge.textContent = `Busqueda: ${state.searchQuery}`;
    } else {
      searchBadge.classList.add("hidden");
    }

    if (state.selectedDate) {
      dateBadge.classList.remove("hidden");
      dateBadge.textContent = `Fecha: ${dateFns.format(state.selectedDate, "PP", { locale: dateFns.locale.es })}`;
    } else {
      dateBadge.classList.add("hidden");
    }
  } else {
    activeFilters.classList.add("hidden");
    clearBtn.classList.add("hidden");
  }
}

// ===================================
// Modal Functions
// ===================================

function openEventModal(event) {
  state.selectedEvent = event;
  state.isModalOpen = true;
  state.activeTab = "rifas";
  state.addMode = null;
  state.currentStep = 1;

  const modal = document.getElementById("event-modal");
  modal.classList.remove("hidden");

  // Update modal content
  document.getElementById("modal-event-name").textContent = event.name;
  document.getElementById("modal-event-dates").textContent = `${event.startDate} - ${event.endDate}`;
  document.getElementById("modal-total-gifts").textContent = `${event.totalGifts} regalos totales`;

  updateSidebarStats();
  renderRafflesTable();
  updateTabUI();
  updateAddModeUI();

  document.body.style.overflow = "hidden";
  lucide.createIcons();
}

function closeEventModal() {
  state.selectedEvent = null;
  state.isModalOpen = false;
  state.addMode = null;

  const modal = document.getElementById("event-modal");
  modal.classList.add("hidden");

  document.body.style.overflow = "";
}

function updateSidebarStats() {
  const assignedGifts = state.raffles.reduce((sum, r) => sum + r.gifts, 0);
  const totalGifts = state.selectedEvent?.totalGifts || 0;
  const availableGifts = totalGifts - assignedGifts;
  const percentage = totalGifts > 0 ? (assignedGifts / totalGifts) * 100 : 0;

  document.getElementById("sidebar-assigned-gifts").textContent = assignedGifts;
  document.getElementById("sidebar-available-gifts").textContent = availableGifts;
  document.getElementById("sidebar-progress-bar").style.width = `${percentage}%`;
}

function updateTabUI() {
  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    const tab = btn.dataset.tab;
    if (tab === state.activeTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });
  document.getElementById(`tab-content-${state.activeTab}`).classList.remove("hidden");
}

function updateAddModeUI() {
  const addButtons = document.getElementById("add-buttons");
  const tableModeButtons = document.getElementById("table-mode-buttons");
  const wizardForm = document.getElementById("wizard-form");

  if (state.addMode === null) {
    addButtons.classList.remove("hidden");
    tableModeButtons.classList.add("hidden");
    wizardForm.classList.add("hidden");
  } else if (state.addMode === "form") {
    addButtons.classList.add("hidden");
    tableModeButtons.classList.add("hidden");
    wizardForm.classList.remove("hidden");
    renderWizardStep();
  } else if (state.addMode === "table") {
    addButtons.classList.add("hidden");
    tableModeButtons.classList.remove("hidden");
    wizardForm.classList.add("hidden");
  }

  // Update paste button state
  const pasteBtn = document.getElementById("paste-row-btn");
  if (pasteBtn) {
    pasteBtn.disabled = !state.copiedRow;
  }
}

// ===================================
// Raffles Table
// ===================================

function renderRafflesTable() {
  const tbody = document.getElementById("raffles-table-body");
  tbody.innerHTML = "";

  state.raffles.forEach((raffle) => {
    const row = document.createElement("tr");
    row.className = `${raffle.isNew ? "table-row-new" : ""} ${raffle.isEditing ? "table-row-editing" : ""}`;

    if (raffle.isEditing) {
      row.innerHTML = createEditableRow(raffle);
    } else {
      row.innerHTML = createReadOnlyRow(raffle);
    }

    tbody.appendChild(row);
  });

  lucide.createIcons();
}

function createEditableRow(raffle) {
  return `
    <td>
      <input type="text" class="form-input table-input table-input-md" value="${raffle.name}" 
        onchange="updateRaffle(${raffle.id}, 'name', this.value)" placeholder="Nombre">
    </td>
    <td>
      <select class="form-input form-select table-input" style="min-width: 100px;" onchange="updateRaffle(${raffle.id}, 'type', this.value)">
        <option value="area" ${raffle.type === "area" ? "selected" : ""}>area</option>
        <option value="general" ${raffle.type === "general" ? "selected" : ""}>general</option>
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input table-input-lg" onchange="updateRaffle(${raffle.id}, 'manager', this.value)">
        <option value="">Manager</option>
        ${MANAGERS.map((m) => `<option value="${m.name}" ${raffle.manager === m.name ? "selected" : ""}>${m.name}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input table-input-md" onchange="updateRaffle(${raffle.id}, 'area', this.value)">
        <option value="">Area</option>
        ${AREAS.map((a) => `<option value="${a}" ${raffle.area === a ? "selected" : ""}>${a}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input table-input-md" onchange="updateRaffle(${raffle.id}, 'department', this.value)">
        <option value="">Depto</option>
        ${DEPARTMENTS.map((d) => `<option value="${d}" ${raffle.department === d ? "selected" : ""}>${d}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input" style="min-width: 100px;" onchange="updateRaffle(${raffle.id}, 'level', this.value)">
        <option value="">Nivel</option>
        ${LEVELS.map((l) => `<option value="${l}" ${raffle.level === l ? "selected" : ""}>${l}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input" style="min-width: 110px;" onchange="updateRaffle(${raffle.id}, 'seniority', this.value)">
        <option value="">Antiguedad</option>
        ${SENIORITY_OPTIONS.map((s) => `<option value="${s}" ${raffle.seniority === s ? "selected" : ""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="form-input form-select table-input" style="min-width: 110px;" onchange="updateRaffle(${raffle.id}, 'contractType', this.value)">
        <option value="">Contrato</option>
        ${CONTRACT_TYPES.map((c) => `<option value="${c}" ${raffle.contractType === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
    </td>
    <td>
      <input type="number" class="form-input table-input table-input-sm" value="${raffle.employees}" 
        onchange="updateRaffle(${raffle.id}, 'employees', parseInt(this.value) || 0)">
    </td>
    <td>
      <input type="number" class="form-input table-input table-input-sm" value="${raffle.gifts}" 
        onchange="updateRaffle(${raffle.id}, 'gifts', parseInt(this.value) || 0)">
    </td>
    <td>
      <input type="number" class="form-input table-input table-input-sm" style="width: 64px;" value="${raffle.percentage}" 
        onchange="updateRaffle(${raffle.id}, 'percentage', parseInt(this.value) || 0)">
    </td>
    <td>
      <div class="table-actions">
        <button class="btn btn-ghost btn-icon" style="color: var(--success);" onclick="saveRow(${raffle.id})">
          <i data-lucide="check" class="icon-sm"></i>
        </button>
        <button class="btn btn-ghost btn-icon" style="color: var(--destructive);" onclick="cancelEditing(${raffle.id})">
          <i data-lucide="x" class="icon-sm"></i>
        </button>
      </div>
    </td>
  `;
}

function createReadOnlyRow(raffle) {
  return `
    <td class="font-medium">${raffle.name}</td>
    <td>
      <span class="badge badge-secondary">${raffle.type}</span>
    </td>
    <td class="text-muted" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${raffle.manager}</td>
    <td>${raffle.area}</td>
    <td>${raffle.department}</td>
    <td>${raffle.level}</td>
    <td>${raffle.seniority}</td>
    <td>${raffle.contractType}</td>
    <td class="text-center">
      <span class="badge ${raffle.employees > 0 ? "badge-default" : "badge-secondary"}" style="min-width: 40px;">
        ${raffle.employees}
      </span>
    </td>
    <td class="text-center font-semibold">${raffle.gifts}</td>
    <td class="text-center text-muted">${raffle.percentage}%</td>
    <td>
      <div class="table-actions">
        <button class="btn btn-ghost btn-icon" style="color: var(--primary);" onclick="startEditing(${raffle.id})">
          <i data-lucide="pencil" class="icon-sm"></i>
        </button>
        <button class="btn btn-ghost btn-icon text-muted" onclick="copyRow(${raffle.id})">
          <i data-lucide="copy" class="icon-sm"></i>
        </button>
        <button class="btn btn-ghost btn-icon" style="color: var(--destructive);" onclick="deleteRow(${raffle.id})">
          <i data-lucide="trash-2" class="icon-sm"></i>
        </button>
      </div>
    </td>
  `;
}

// Raffle table functions
function updateRaffle(id, field, value) {
  if (field === "gifts") {
    const numValue = typeof value === "string" ? parseInt(value) || 0 : value;
    const otherRafflesGifts = state.raffles
      .filter((r) => r.id !== id)
      .reduce((sum, r) => sum + r.gifts, 0);
    const maxGifts = (state.selectedEvent?.totalGifts || 0) - otherRafflesGifts;

    if (numValue > maxGifts) {
      showToast(`Maximo ${maxGifts} regalos disponibles`, "error");
      return;
    }
    if (numValue < 0) {
      showToast("No puede ser negativo", "error");
      return;
    }
  }

  state.raffles = state.raffles.map((r) =>
    r.id === id ? { ...r, [field]: value } : r
  );
  renderRafflesTable();
  updateSidebarStats();
}

function startEditing(id) {
  state.raffles = state.raffles.map((r) =>
    r.id === id ? { ...r, isEditing: true } : r
  );
  renderRafflesTable();
}

function saveRow(id) {
  const raffle = state.raffles.find((r) => r.id === id);
  if (!raffle) return;

  if (!raffle.name.trim()) {
    showToast("El nombre de la rifa es requerido", "error");
    return;
  }

  const otherRafflesGifts = state.raffles
    .filter((r) => r.id !== id)
    .reduce((sum, r) => sum + r.gifts, 0);
  const maxGiftsForThisRow = (state.selectedEvent?.totalGifts || 0) - otherRafflesGifts;

  if (raffle.gifts > maxGiftsForThisRow) {
    showToast(`Solo hay ${maxGiftsForThisRow} regalos disponibles`, "error");
    return;
  }

  if (raffle.gifts < 0) {
    showToast("La cantidad de regalos no puede ser negativa", "error");
    return;
  }

  state.raffles = state.raffles.map((r) =>
    r.id === id ? { ...r, isEditing: false, isNew: false } : r
  );
  showToast("Rifa guardada correctamente", "success");
  renderRafflesTable();
  updateSidebarStats();
}

function cancelEditing(id) {
  const raffle = state.raffles.find((r) => r.id === id);
  if (raffle?.isNew) {
    deleteRow(id);
  } else {
    state.raffles = state.raffles.map((r) =>
      r.id === id ? { ...r, isEditing: false } : r
    );
    renderRafflesTable();
  }
}

function deleteRow(id) {
  state.raffles = state.raffles.filter((r) => r.id !== id);
  renderRafflesTable();
  updateSidebarStats();
}

function copyRow(id) {
  const raffle = state.raffles.find((r) => r.id === id);
  if (raffle) {
    state.copiedRow = { ...raffle, id: 0, isEditing: false, isNew: false };
    showToast("Fila copiada al portapapeles", "success");
    updateAddModeUI();
  }
}

function addEmptyRow() {
  const newRow = {
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
  };
  state.raffles.push(newRow);
  renderRafflesTable();
}

function pasteRow() {
  if (state.copiedRow) {
    const newRow = {
      ...state.copiedRow,
      id: Date.now(),
      isNew: true,
      isEditing: true,
    };
    state.raffles.push(newRow);
    renderRafflesTable();
  }
}

// ===================================
// Wizard Form
// ===================================

function renderWizardStep() {
  const container = document.getElementById("wizard-step-content");
  const progress = document.getElementById("wizard-progress");
  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");

  progress.style.width = `${(state.currentStep / 4) * 100}%`;

  let content = "";

  switch (state.currentStep) {
    case 1:
      content = `
        <div>
          <div class="step-header">
            <div class="step-indicator">1</div>
            <div>
              <h4 class="step-title">Seleccionar Evento</h4>
              <p class="step-subtitle">Paso 1 de 4</p>
            </div>
          </div>
          <div class="event-selected-box">
            <div class="event-selected-content">
              <i data-lucide="check" class="icon-lg"></i>
              <span class="font-medium" style="font-size: var(--font-size-lg);">Evento seleccionado: ${state.selectedEvent?.name || ""}</span>
            </div>
          </div>
        </div>
      `;
      prevBtn.innerHTML = "Cancelar";
      nextBtn.innerHTML = 'Siguiente <i data-lucide="chevron-right" class="icon-sm"></i>';
      nextBtn.className = "btn btn-primary";
      break;

    case 2:
      content = `
        <div>
          <div class="step-header">
            <div class="step-indicator">2</div>
            <div>
              <h4 class="step-title">Informacion de la Rifa</h4>
              <p class="step-subtitle">Paso 2 de 4</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nombre de la Rifa *</label>
              <input type="text" id="form-name" class="form-input ${state.formErrors.name ? "error" : ""}" 
                placeholder="Ej: Rifa Area RH" value="${state.formData.name}" style="height: 44px;">
              ${state.formErrors.name ? `<p class="form-error">${state.formErrors.name}</p>` : ""}
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de Rifa</label>
              <select id="form-type" class="form-input form-select" style="height: 44px;">
                <option value="general" ${state.formData.type === "general" ? "selected" : ""}>Rifa General</option>
                <option value="area" ${state.formData.type === "area" ? "selected" : ""}>Rifa por Area</option>
              </select>
            </div>
            <div class="form-group form-grid-full">
              <label class="form-label">Manager Responsable *</label>
              <select id="form-manager" class="form-input form-select ${state.formErrors.manager ? "error" : ""}" style="height: 44px;">
                <option value="">Selecciona un manager</option>
                ${MANAGERS.map((m) => `<option value="${m.id}" ${state.formData.manager === m.id.toString() ? "selected" : ""}>${m.name}</option>`).join("")}
              </select>
              ${state.formErrors.manager ? `<p class="form-error">${state.formErrors.manager}</p>` : ""}
            </div>
          </div>
        </div>
      `;
      prevBtn.innerHTML = '<i data-lucide="chevron-left" class="icon-sm"></i> Anterior';
      nextBtn.innerHTML = 'Siguiente <i data-lucide="chevron-right" class="icon-sm"></i>';
      nextBtn.className = "btn btn-primary";
      break;

    case 3:
      content = `
        <div>
          <div class="step-header">
            <div class="step-indicator">3</div>
            <div>
              <h4 class="step-title">Areas, Departamentos y Filtros</h4>
              <p class="step-subtitle">Paso 3 de 4</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <div class="filter-header">
                <i data-lucide="building-2" class="icon-md" style="color: var(--primary);"></i>
                <label class="form-label" style="font-size: var(--font-size-base);">Areas *</label>
              </div>
              ${state.formErrors.areas ? `<p class="form-error">${state.formErrors.areas}</p>` : ""}
              <div class="checkbox-list ${state.formErrors.areas ? "error" : ""}">
                ${AREAS.map(
                  (area) => `
                  <div class="checkbox-item">
                    <input type="checkbox" id="area-${area}" class="form-checkbox area-checkbox" 
                      ${state.formData.selectedAreas.includes(area) ? "checked" : ""} data-area="${area}">
                    <label for="area-${area}">${area}</label>
                  </div>
                `
                ).join("")}
              </div>
            </div>
            <div class="filters-panel">
              <div class="filter-header">
                <i data-lucide="filter" class="icon-md" style="color: var(--primary);"></i>
                <label class="form-label" style="font-size: var(--font-size-base);">Filtros de Empleados</label>
              </div>
              <div class="form-group">
                <label class="form-label">Tipo de Contrato</label>
                <select id="form-contract" class="form-input form-select" style="height: 40px;">
                  <option value="ALL" ${state.formData.contractType === "ALL" ? "selected" : ""}>Todos</option>
                  <option value="TEMPORAL" ${state.formData.contractType === "TEMPORAL" ? "selected" : ""}>Temporal</option>
                  <option value="PERMANENTE" ${state.formData.contractType === "PERMANENTE" ? "selected" : ""}>Permanente</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Antiguedad</label>
                <div class="seniority-row">
                  <select id="form-seniority-op" class="form-input form-select" style="height: 40px;">
                    <option value=">=" ${state.formData.seniorityOperator === ">=" ? "selected" : ""}>Mayor o igual</option>
                    <option value="<=" ${state.formData.seniorityOperator === "<=" ? "selected" : ""}>Menor o igual</option>
                    <option value="=" ${state.formData.seniorityOperator === "=" ? "selected" : ""}>Igual</option>
                  </select>
                  <input type="number" id="form-seniority-val" class="form-input" style="height: 40px;"
                    placeholder="Anos" value="${state.formData.seniorityValue}">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Niveles</label>
                <select id="form-levels" class="form-input form-select" style="height: 40px;">
                  <option value="ALL">Todos los niveles</option>
                  ${Array.from({ length: 18 }, (_, i) => `<option value="${i + 1}">Nivel ${i + 1}</option>`).join("")}
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
      prevBtn.innerHTML = '<i data-lucide="chevron-left" class="icon-sm"></i> Anterior';
      nextBtn.innerHTML = 'Siguiente <i data-lucide="chevron-right" class="icon-sm"></i>';
      nextBtn.className = "btn btn-primary";
      break;

    case 4:
      const assignedGifts = state.raffles.reduce((sum, r) => sum + r.gifts, 0);
      const availableGifts = (state.selectedEvent?.totalGifts || 0) - assignedGifts;

      content = `
        <div>
          <div class="step-header">
            <div class="step-indicator">4</div>
            <div>
              <h4 class="step-title">Resumen y Configuracion Final</h4>
              <p class="step-subtitle">Paso 4 de 4</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="summary-box">
              <h5 class="summary-title">Resumen de la Rifa</h5>
              <div class="summary-list">
                <div class="summary-item">
                  <span class="summary-item-label">Evento:</span>
                  <span class="summary-item-value">${state.selectedEvent?.name || ""}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-item-label">Nombre:</span>
                  <span class="summary-item-value">${state.formData.name || "-"}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-item-label">Tipo:</span>
                  <span class="summary-item-value">${state.formData.type}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-item-label">Areas:</span>
                  <span class="summary-item-value">${state.formData.selectedAreas.length > 0 ? state.formData.selectedAreas.join(", ") : "-"}</span>
                </div>
              </div>
            </div>
            <div>
              <div class="gifts-availability-card">
                <div class="gifts-header">
                  <i data-lucide="gift" class="icon-md" style="color: var(--primary);"></i>
                  <h5>Disponibilidad de Regalos</h5>
                </div>
                <div class="gifts-stats">
                  <div>
                    <div class="gifts-stat-value">${state.selectedEvent?.totalGifts || 0}</div>
                    <div class="gifts-stat-label">Total</div>
                  </div>
                  <div>
                    <div class="gifts-stat-value" style="color: var(--accent);">${assignedGifts}</div>
                    <div class="gifts-stat-label">Asignados</div>
                  </div>
                  <div>
                    <div class="gifts-stat-value" style="color: var(--success);">${availableGifts}</div>
                    <div class="gifts-stat-label">Disponibles</div>
                  </div>
                </div>
              </div>
              <div class="final-inputs">
                <div class="form-group">
                  <label class="form-label">Cantidad de Regalos *</label>
                  <input type="number" id="form-gifts" class="form-input ${state.formErrors.gifts ? "error" : ""}" style="height: 44px;"
                    placeholder="0" value="${state.formData.gifts}" min="0" max="${availableGifts}">
                  ${state.formErrors.gifts ? `<p class="form-error">${state.formErrors.gifts}</p>` : `<p class="form-hint">Maximo: ${availableGifts}</p>`}
                </div>
                <div class="form-group">
                  <label class="form-label">Porcentaje (%)</label>
                  <input type="number" id="form-percentage" class="form-input" style="height: 44px;"
                    placeholder="0" value="${state.formData.percentage}" max="100">
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      prevBtn.innerHTML = '<i data-lucide="chevron-left" class="icon-sm"></i> Anterior';
      nextBtn.innerHTML = '<i data-lucide="save" class="icon-sm"></i> Guardar Rifa';
      nextBtn.className = "btn btn-success";
      break;
  }

  container.innerHTML = content;
  lucide.createIcons();

  // Add event listeners for form inputs
  if (state.currentStep === 2) {
    document.getElementById("form-name")?.addEventListener("input", (e) => {
      state.formData.name = e.target.value;
      if (state.formErrors.name) {
        state.formErrors.name = "";
      }
    });
    document.getElementById("form-type")?.addEventListener("change", (e) => {
      state.formData.type = e.target.value;
    });
    document.getElementById("form-manager")?.addEventListener("change", (e) => {
      state.formData.manager = e.target.value;
      if (state.formErrors.manager) {
        state.formErrors.manager = "";
      }
    });
  }

  if (state.currentStep === 3) {
    document.querySelectorAll(".area-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const area = e.target.dataset.area;
        if (e.target.checked) {
          if (!state.formData.selectedAreas.includes(area)) {
            state.formData.selectedAreas.push(area);
          }
        } else {
          state.formData.selectedAreas = state.formData.selectedAreas.filter(
            (a) => a !== area
          );
        }
        if (state.formErrors.areas) {
          state.formErrors.areas = "";
        }
      });
    });
    document.getElementById("form-contract")?.addEventListener("change", (e) => {
      state.formData.contractType = e.target.value;
    });
    document.getElementById("form-seniority-op")?.addEventListener("change", (e) => {
      state.formData.seniorityOperator = e.target.value;
    });
    document.getElementById("form-seniority-val")?.addEventListener("input", (e) => {
      state.formData.seniorityValue = e.target.value;
    });
  }

  if (state.currentStep === 4) {
    document.getElementById("form-gifts")?.addEventListener("input", (e) => {
      state.formData.gifts = e.target.value;
      if (state.formErrors.gifts) {
        state.formErrors.gifts = "";
      }
    });
    document.getElementById("form-percentage")?.addEventListener("input", (e) => {
      state.formData.percentage = e.target.value;
    });
  }
}

function handleWizardNext() {
  if (state.currentStep === 2) {
    state.formErrors = {};
    if (!state.formData.name.trim()) {
      state.formErrors.name = "El nombre es requerido";
    }
    if (!state.formData.manager) {
      state.formErrors.manager = "Selecciona un manager";
    }
    if (Object.keys(state.formErrors).length > 0) {
      showToast("Completa los campos requeridos", "error");
      renderWizardStep();
      return;
    }
  }

  if (state.currentStep === 3) {
    if (state.formData.selectedAreas.length === 0) {
      state.formErrors = { areas: "Selecciona al menos un area" };
      showToast("Selecciona al menos un area", "error");
      renderWizardStep();
      return;
    }
  }

  state.formErrors = {};

  if (state.currentStep < 4) {
    state.currentStep++;
    renderWizardStep();
  } else {
    handleSaveRaffle();
  }
}

function handleWizardPrev() {
  if (state.currentStep === 1) {
    resetForm();
  } else {
    state.currentStep--;
    renderWizardStep();
  }
}

function handleSaveRaffle() {
  state.formErrors = {};

  if (!state.formData.name.trim()) {
    state.formErrors.name = "El nombre es requerido";
  }
  if (!state.formData.manager) {
    state.formErrors.manager = "Selecciona un manager";
  }
  if (state.formData.selectedAreas.length === 0) {
    state.formErrors.areas = "Selecciona al menos un area";
  }

  const giftsNum = parseInt(state.formData.gifts) || 0;
  const assignedGifts = state.raffles.reduce((sum, r) => sum + r.gifts, 0);
  const availableGifts = (state.selectedEvent?.totalGifts || 0) - assignedGifts;

  if (giftsNum > availableGifts) {
    state.formErrors.gifts = `Solo hay ${availableGifts} regalos disponibles`;
  }
  if (giftsNum < 0) {
    state.formErrors.gifts = "La cantidad no puede ser negativa";
  }

  if (Object.keys(state.formErrors).length > 0) {
    showToast("Por favor corrige los errores del formulario", "error");
    renderWizardStep();
    return;
  }

  const newRaffle = {
    id: Date.now(),
    name: state.formData.name,
    type: state.formData.type,
    manager: MANAGERS.find((m) => m.id.toString() === state.formData.manager)?.name || "",
    area: state.formData.selectedAreas.join(", "),
    department: state.formData.selectedDepartments.join(", "),
    level: state.formData.levels.join(", "),
    seniority: state.formData.seniorityValue
      ? `${state.formData.seniorityOperator} ${state.formData.seniorityValue} anos`
      : "Todos",
    contractType: state.formData.contractType,
    employees: 0,
    gifts: parseInt(state.formData.gifts) || 0,
    percentage: parseInt(state.formData.percentage) || 0,
    isEditing: false,
    isNew: false,
  };

  state.raffles.push(newRaffle);
  showToast("Rifa creada correctamente", "success");
  resetForm();
  renderRafflesTable();
  updateSidebarStats();
}

function resetForm() {
  state.formData = {
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
  };
  state.formErrors = {};
  state.currentStep = 1;
  state.addMode = null;
  updateAddModeUI();
}

// ===================================
// Simple Calendar
// ===================================

function renderCalendar(selectedDate = null) {
  const container = document.getElementById("calendar-container");
  const today = new Date();
  let currentMonth = selectedDate ? new Date(selectedDate) : new Date();

  function render() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    let html = `
      <div class="calendar">
        <div class="calendar-header">
          <button class="btn btn-ghost btn-icon" id="cal-prev">
            <i data-lucide="chevron-left" class="icon-sm"></i>
          </button>
          <span class="font-medium">${monthNames[month]} ${year}</span>
          <button class="btn btn-ghost btn-icon" id="cal-next">
            <i data-lucide="chevron-right" class="icon-sm"></i>
          </button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-header">Do</div>
          <div class="calendar-day-header">Lu</div>
          <div class="calendar-day-header">Ma</div>
          <div class="calendar-day-header">Mi</div>
          <div class="calendar-day-header">Ju</div>
          <div class="calendar-day-header">Vi</div>
          <div class="calendar-day-header">Sa</div>
    `;

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      html += `<div class="calendar-day disabled"></div>`;
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = dateFns.isSameDay(date, today);
      const isSelected = state.selectedDate && dateFns.isSameDay(date, state.selectedDate);

      html += `
        <div class="calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" 
          data-date="${date.toISOString()}">${day}</div>
      `;
    }

    html += `</div></div>`;
    container.innerHTML = html;
    lucide.createIcons();

    // Add event listeners
    document.getElementById("cal-prev")?.addEventListener("click", () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      render();
    });

    document.getElementById("cal-next")?.addEventListener("click", () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      render();
    });

    container.querySelectorAll(".calendar-day:not(.disabled)").forEach((el) => {
      if (el.dataset.date) {
        el.addEventListener("click", () => {
          state.selectedDate = new Date(el.dataset.date);
          document.getElementById("date-filter-text").textContent = dateFns.format(
            state.selectedDate,
            "PPP",
            { locale: dateFns.locale.es }
          );
          document.getElementById("date-picker-popover").classList.add("hidden");
          renderEvents();
        });
      }
    });
  }

  render();
}

// ===================================
// Event Listeners Setup
// ===================================

function initializeApp() {
  // Search input
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderEvents();
  });

  // Date filter button
  document.getElementById("date-filter-btn").addEventListener("click", () => {
    const popover = document.getElementById("date-picker-popover");
    popover.classList.toggle("hidden");
    if (!popover.classList.contains("hidden")) {
      renderCalendar(state.selectedDate);
    }
  });

  // Close date picker when clicking outside
  document.addEventListener("click", (e) => {
    const popover = document.getElementById("date-picker-popover");
    const btn = document.getElementById("date-filter-btn");
    if (!popover.contains(e.target) && !btn.contains(e.target)) {
      popover.classList.add("hidden");
    }
  });

  // Clear filters
  document.getElementById("clear-filters-btn").addEventListener("click", () => {
    state.searchQuery = "";
    state.selectedDate = null;
    document.getElementById("search-input").value = "";
    document.getElementById("date-filter-text").textContent = "Filtrar por fecha";
    renderEvents();
  });

  // Modal close
  document.getElementById("modal-close-btn").addEventListener("click", closeEventModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeEventModal);

  // Tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeTab = btn.dataset.tab;
      updateTabUI();
    });
  });

  // Add mode buttons
  document.getElementById("add-form-btn").addEventListener("click", () => {
    state.addMode = "form";
    state.currentStep = 1;
    updateAddModeUI();
  });

  document.getElementById("add-table-btn").addEventListener("click", () => {
    state.addMode = "table";
    addEmptyRow();
    updateAddModeUI();
  });

  document.getElementById("exit-table-mode-btn").addEventListener("click", () => {
    state.addMode = null;
    updateAddModeUI();
  });

  document.getElementById("new-row-btn").addEventListener("click", addEmptyRow);
  document.getElementById("paste-row-btn").addEventListener("click", pasteRow);

  // Wizard navigation
  document.getElementById("wizard-prev-btn").addEventListener("click", handleWizardPrev);
  document.getElementById("wizard-next-btn").addEventListener("click", handleWizardNext);

  // Paste from clipboard (Excel-like)
  document.addEventListener("paste", (e) => {
    if (state.addMode !== "table") return;

    const clipboardData = e.clipboardData?.getData("text");
    if (!clipboardData) return;

    const rows = clipboardData.split("\n").filter((row) => row.trim());
    const newRaffles = rows.map((row, index) => {
      const cells = row.split("\t");
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
      };
    });

    state.raffles = [...state.raffles, ...newRaffles];
    renderRafflesTable();
    showToast(`${newRaffles.length} filas pegadas`, "success");
  });

  // Initial render
  renderEvents();
}
