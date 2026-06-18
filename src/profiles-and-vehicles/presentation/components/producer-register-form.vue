<template>
  <div class="page-wrapper">

    <div class="header-section">
      <div>
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span class="sep">></span>
          <span>Productores</span>
          <span class="sep">></span>
          <span class="active">{{ isEditing ? 'Editar Productor' : 'Nuevo Productor' }}</span>
        </nav>
        <h1 class="page-title">{{ isEditing ? 'Actualizar Ficha Técnica' : 'Registro de Productor' }}</h1>
        <p class="page-subtitle">Comienza a documentar a un nuevo proveedor para la red de suministro global.</p>
      </div>
      <div class="header-actions">
        <button class="cancel-btn-top" type="button" @click="onCancel">
          <i class="pi pi-times" /> Cancelar
        </button>
        <button class="save-btn-top" type="button" @click="triggerSubmit">
          <i class="pi pi-check" /> {{ isEditing ? 'Guardar cambios' : 'Finalizar Registro' }}
        </button>
      </div>
    </div>

    <form id="producerForm" class="dashboard-form-grid" @submit.prevent="handleSubmit">
      
      <div class="main-column">
        
        <div class="form-card">
          <div class="card-header">
            <i class="pi pi-id-card card-icon"></i>
            <h2 class="card-title">Datos Empresariales</h2>
          </div>
          <div class="form-grid">
            <div class="field full-width">
              <label class="field-label">Nombre completo del titular</label>
              <pv-input-text v-model="form.fullName" class="w-full" :invalid="!!errors.fullName" placeholder="Ingresa el nombre del propietario" />
              <small v-if="errors.fullName" class="field-error"><i class="pi pi-info-circle"/> {{ errors.fullName }}</small>
            </div>
            
            <div class="field">
              <label class="field-label">Nombre de la Empresa / Finca</label>
              <pv-input-text v-model="form.legalName" class="w-full" :invalid="!!errors.legalName" placeholder="Ej: Agrícola del Norte" />
              <small v-if="errors.legalName" class="field-error"><i class="pi pi-info-circle"/> {{ errors.legalName }}</small>
            </div>

            <div class="field">
              <label class="field-label">Tipo de entidad</label>
              <pv-select v-model="form.producerType" :options="producerTypes" optionLabel="label" optionValue="value"
                         placeholder="Seleccionar..." class="w-full" :invalid="!!errors.producerType" />
              <small v-if="errors.producerType" class="field-error"><i class="pi pi-info-circle"/> {{ errors.producerType }}</small>
            </div>

            <div class="field">
              <label class="field-label">RUC / ID Tributario</label>
              <pv-input-text v-model="form.taxId" class="w-full" :invalid="!!errors.taxId" placeholder="Número de 11 dígitos" />
              <small v-if="errors.taxId" class="field-error"><i class="pi pi-info-circle"/> {{ errors.taxId }}</small>
            </div>
            
            <div class="field">
              <label class="field-label">Inicio de Operaciones</label>
              <pv-date-picker v-model="form.operationsStartDate" dateFormat="dd/mm/yy" placeholder="Seleccionar fecha" class="w-full" />
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="card-header">
            <i class="pi pi-chart-line card-icon"></i>
            <h2 class="card-title">Capacidad Agrícola</h2>
          </div>
          <div class="form-grid">
            <div class="field">
              <label class="field-label">Cultivo Principal Mapeado</label>
              <div class="input-with-icon">
                <i class="pi pi-tag input-icon-left"></i>
                <pv-input-text v-model="form.crop" class="w-full pl-icon" :invalid="!!errors.crop" placeholder="Ej: Palta Hass, Mango" />
              </div>
              <small v-if="errors.crop" class="field-error"><i class="pi pi-info-circle"/> {{ errors.crop }}</small>
            </div>

            <div class="field">
              <label class="field-label">Hectáreas de Cultivo</label>
              <div class="input-with-icon">
                <pv-input-number v-model="form.cultivatedHectares" :min="0" :minFractionDigits="2" class="w-full" placeholder="0.00" />
                <span class="input-icon-right">Ha</span>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Volumen Mensual Estimado</label>
              <div class="input-with-icon">
                <pv-input-text v-model="form.monthlyProduction" class="w-full" placeholder="Ej: 10,000" />
                <span class="input-icon-right">kg</span>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Calificación Base Interna</label>
              <pv-input-number v-model="form.rating" :min="0" :max="5" :minFractionDigits="1" :maxFractionDigits="1" class="w-full" placeholder="0.0 - 5.0" />
            </div>
          </div>
        </div>
      </div>

      <div class="side-column">
        
        <div class="form-card">
          <div class="card-header">
            <i class="pi pi-map-marker card-icon"></i>
            <h2 class="card-title">Base de Operaciones</h2>
          </div>
          <div class="form-grid-single">
            <div class="field-row">
              <div class="field half">
                <label class="field-label">País</label>
                <pv-input-text v-model="form.country" class="w-full" placeholder="Perú" />
              </div>
              <div class="field half">
                <label class="field-label">Región / Estado</label>
                <pv-input-text v-model="form.region" class="w-full" placeholder="Lima" />
              </div>
            </div>
            <div class="field">
              <label class="field-label">Ciudad / Provincia</label>
              <pv-input-text v-model="form.city" class="w-full" placeholder="Lurín" />
            </div>
            <div class="field">
              <label class="field-label">Dirección Fiscal / Lote</label>
              <pv-input-text v-model="form.address" class="w-full" placeholder="Dirección exacta" />
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="card-header">
            <i class="pi pi-address-book card-icon"></i>
            <h2 class="card-title">Contacto Directo</h2>
          </div>
          <div class="form-grid-single">
            <div class="field">
              <label class="field-label">Correo Electrónico</label>
              <div class="input-with-icon">
                <i class="pi pi-envelope input-icon-left"></i>
                <pv-input-text v-model="form.email" type="email" class="w-full pl-icon" :invalid="!!errors.email" placeholder="correo@agricola.com" />
              </div>
              <small v-if="errors.email" class="field-error"><i class="pi pi-info-circle"/> {{ errors.email }}</small>
            </div>
            
            <div class="field">
              <label class="field-label">Número de Teléfono</label>
              <div class="input-with-icon">
                <i class="pi pi-phone input-icon-left"></i>
                <pv-input-text v-model="form.phone" class="w-full pl-icon" :invalid="!!errors.phone" placeholder="+51 999 999 999" />
              </div>
              <small v-if="errors.phone" class="field-error"><i class="pi pi-info-circle"/> {{ errors.phone }}</small>
            </div>
          </div>
          
          <div class="divider"></div>

          <div class="card-header mt-3">
            <i class="pi pi-check-circle card-icon"></i>
            <h2 class="card-title">Auditoría</h2>
          </div>
          <div class="field">
            <label class="field-label">Sellos y Normas Vigentes</label>
            <pv-input-text v-model="form.certifications" class="w-full" placeholder="Ej: GlobalG.A.P, HACCP, ISO 22000" />
            <small class="field-helper">Separa los certificados con comas.</small>
          </div>
        </div>

      </div>
    </form>

    <pv-dialog v-model:visible="showSuccess" :modal="true" :closable="false" :style="{ width: '420px' }"
               :pt="{
                 root:    { style: 'border-radius: 20px; overflow: hidden; border: 1px solid rgba(212, 233, 82, 0.3); background: #1e2d22;' },
                 content: { style: 'padding: 0; border-radius: 20px; background: transparent;' },
                 header:  { style: 'display: none;' }
               }">
      <div class="success-dialog">
        <div class="success-icon-wrapper">
          <div class="success-icon"><i class="pi pi-check-circle"/></div>
        </div>
        <h2 class="success-title">Alta de Productor Exitosa</h2>
        <p class="success-desc">El perfil del productor se ha incorporado correctamente a la red de la cadena de suministro de FruitLogix.</p>
        <div class="success-actions">
          <button class="success-btn" type="button" @click="handleSuccessClose">Entendido, Volver a la lista</button>
        </div>
      </div>
    </pv-dialog>

  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfilesAndVehiclesStore } from '../../application/profiles-and-vehicles.store.js';
import { validateProducerForm } from '../../application/validators/producer-form.validator.js';

const router = useRouter();
const route  = useRoute();
const store  = useProfilesAndVehiclesStore();

const isEditing = computed(() => !!route.params.id);

const producerTypes = [
  { label: 'Persona Natural', value: 'NATURAL' },
  { label: 'Empresa / SAC',   value: 'EMPRESA' },
  { label: 'Cooperativa Agrícola', value: 'COOPERATIVA' }
];

const form = reactive({
  producerType: '',
  fullName: '',
  taxId: '',
  legalName: '',
  email: '',
  phone: '',
  country: 'Perú',
  region: 'Lima',
  city: '',
  address: '',
  crop: '',
  cultivatedHectares: null,
  monthlyProduction: '',
  operationsStartDate: null,
  rating: null,
  certifications: ''
});

const errors      = ref({});
const showSuccess = ref(false);

onMounted(async () => {
  if (!store.producers.length) await store.fetchProducers();
  if (isEditing.value) {
    const existing = store.getProducerById(route.params.id);
    if (existing) Object.assign(form, existing);
  }
});

function validate() {
  const result = validateProducerForm(form);
  errors.value = result.errors;
  return result.valid;
}

// Vinculación del botón superior con el form
function triggerSubmit() {
  const formElement = document.getElementById('producerForm');
  if (formElement) formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}

async function handleSubmit() {
  if (!validate()) return;
  if (isEditing.value) {
    await store.updateProducer(route.params.id, { ...form });
  } else {
    await store.addProducer({ ...form });
  }
  showSuccess.value = true;
}

function handleSuccessClose() {
  showSuccess.value = false;
  router.push({ name: 'profiles-and-vehicles-list' });
}

function onCancel() {
  router.push({ name: 'profiles-and-vehicles-list' });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

.page-wrapper {
  padding: 2rem 3rem 4rem;
  background: #E1EBE1;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ── Header ─────────────────────────────────── */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(26, 48, 32, 0.1);
}

.breadcrumb {
  font-size: 0.72rem;
  color: #6b7a6b;
  margin-bottom: 0.8rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}
.breadcrumb .sep { color: #a3b8a0; }
.breadcrumb .active { color: #1a3020; }

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.4rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #4a6b4a;
  margin: 0;
}

/* Top Actions */
.header-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn-top, .save-btn-top {
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.8rem 1.5rem;
}

.cancel-btn-top {
  background: transparent;
  color: #4a6b4a;
  border: 1.5px solid rgba(26, 48, 32, 0.2);
}
.cancel-btn-top:hover { background: rgba(26, 48, 32, 0.05); color: #1a3020; border-color: rgba(26, 48, 32, 0.4); }

.save-btn-top {
  background: #D4E952;
  color: #1a3020;
  border: none;
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.3);
}
.save-btn-top:hover { background: #e2f57a; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(212, 233, 82, 0.4); }

/* ── Form Dashboard Layout ──────────────────── */
.dashboard-form-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;
  align-items: start;
}

.main-column, .side-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Cards ──────────────────────────────────── */
.form-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-icon {
  font-size: 1.2rem;
  color: #D4E952;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.01em;
}

.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 2rem 0 0 0;
}
.mt-3 { margin-top: 1.5rem; }

/* ── Grid Interno de Formulario ─────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-grid-single {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-row {
  display: flex;
  gap: 1.5rem;
}
.half { flex: 1; min-width: 0; }
.full-width { grid-column: span 2; }

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label { 
  font-size: 0.75rem; 
  font-weight: 700; 
  color: #9ab39d; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
}
.field-helper {
  font-size: 0.7rem;
  color: #6b8a6b;
  margin-top: 0.2rem;
}

.field-error {
  color: #ff6b6b;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  margin-top: 0.2rem;
}

/* ── Inputs y Decoradores ───────────────────── */
:deep(.p-inputtext),
:deep(.p-datepicker-input),
:deep(.p-inputnumber-input),
:deep(.p-select) {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #FFFFFF !important;
  border-radius: 8px !important;
  font-size: 0.95rem !important;
  padding: 0.8rem 1rem !important;
  box-shadow: none !important;
  transition: all 0.2s;
}

:deep(.p-inputtext:focus),
:deep(.p-datepicker-input:focus),
:deep(.p-inputnumber-input:focus),
:deep(.p-select:focus) {
  border-color: #D4E952 !important;
  box-shadow: 0 0 0 2px rgba(212, 233, 82, 0.1) !important;
}

:deep(.p-inputtext::placeholder) { color: rgba(255, 255, 255, 0.3) !important; }

:deep(.p-invalid .p-inputtext),
:deep(.p-invalid .p-datepicker-input),
:deep(.p-invalid .p-inputnumber-input),
:deep(.p-invalid.p-select) { 
  border-color: #ff6b6b !important; 
  background: rgba(255, 107, 107, 0.05) !important;
}

/* Select text override to make it white */
:deep(.p-select-label) { color: #FFFFFF !important; }

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon-left {
  position: absolute;
  left: 1rem;
  color: #9ab39d;
  font-size: 0.9rem;
  z-index: 1;
}
.pl-icon { padding-left: 2.5rem !important; }

.input-icon-right {
  position: absolute;
  right: 1rem;
  color: #9ab39d;
  font-size: 0.85rem;
  font-weight: 700;
  z-index: 1;
}

.w-full { width: 100%; }

/* ── Modal Success ──────────────────────────── */
.success-dialog {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}
.success-icon-wrapper {
  margin-bottom: 0.5rem;
}
.success-icon .pi {
  font-size: 4.5rem;
  color: #D4E952;
  filter: drop-shadow(0 0 12px rgba(212, 233, 82, 0.4));
}
.success-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
}
.success-desc {
  font-size: 0.95rem;
  color: #9ab39d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}
.success-actions { width: 100%; display: flex; justify-content: center; }
.success-btn {
  padding: 0.8rem 2rem;
  background: #D4E952;
  color: #1a3020;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}
.success-btn:hover { background: #e2f57a; transform: translateY(-2px); }

/* ── Responsive ─────────────────────────────── */
@media (max-width: 1024px) {
  .dashboard-form-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .header-section { flex-direction: column; align-items: stretch; gap: 1.5rem; }
  .header-actions { justify-content: flex-start; }
}

@media (max-width: 640px) {
  .page-wrapper { padding: 1.5rem; }
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: auto; }
  .field-row { flex-direction: column; gap: 1.5rem; }
  .header-actions { flex-direction: column; width: 100%; }
  .header-actions button { width: 100%; justify-content: center; }
}
</style>