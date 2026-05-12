<template>
  <div class="page-wrapper">

    <nav class="breadcrumb">
      <span>Inicio</span>
      <span class="sep">></span>
      <span>Productores</span>
      <span class="sep">></span>
      <span class="active">{{ isEditing ? 'Editar Productor' : 'Agregar Productor' }}</span>
    </nav>

    <h1 class="page-title">{{ isEditing ? 'Editar Productor' : 'Agregar Productor' }}</h1>

    <form class="producer-card" @submit.prevent="handleSubmit">

      <!-- Datos Generales -->
      <section class="section">
        <div class="section-header"><span class="section-title">Datos Generales</span></div>
        <div class="form-grid">
          <div class="field">
            <label class="field-label">Tipo de productor</label>
            <pv-select v-model="form.producerType" :options="producerTypes" optionLabel="label" optionValue="value"
                       placeholder="Selecciona un tipo" class="w-full" :invalid="!!errors.producerType" />
            <small v-if="errors.producerType" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.producerType }}
            </small>
          </div>
          <div class="field">
            <label class="field-label">Nombre completo</label>
            <pv-input-text v-model="form.fullName" class="w-full" :invalid="!!errors.fullName" />
            <small v-if="errors.fullName" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.fullName }}
            </small>
          </div>
          <div class="field">
            <label class="field-label">RUC</label>
            <pv-input-text v-model="form.taxId" class="w-full" :invalid="!!errors.taxId" placeholder="11 dígitos" />
            <small v-if="errors.taxId" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.taxId }}
            </small>
          </div>
          <div class="field">
            <label class="field-label">Nombre de la empresa / finca</label>
            <pv-input-text v-model="form.legalName" class="w-full" :invalid="!!errors.legalName" />
            <small v-if="errors.legalName" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.legalName }}
            </small>
          </div>
        </div>
      </section>

      <!-- Contacto -->
      <section class="section">
        <div class="section-header"><span class="section-title">Contacto</span></div>
        <div class="form-grid">
          <div class="field">
            <label class="field-label">Email</label>
            <pv-input-text v-model="form.email" type="email" class="w-full" :invalid="!!errors.email" />
            <small v-if="errors.email" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.email }}
            </small>
          </div>
          <div class="field">
            <label class="field-label">Teléfono</label>
            <pv-input-text v-model="form.phone" class="w-full" :invalid="!!errors.phone" placeholder="+51 999 999 999" />
            <small v-if="errors.phone" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.phone }}
            </small>
          </div>
        </div>
      </section>

      <!-- Ubicación -->
      <section class="section">
        <div class="section-header"><span class="section-title">Ubicación</span></div>
        <div class="form-grid">
          <div class="field">
            <label class="field-label">País</label>
            <pv-input-text v-model="form.country" class="w-full" placeholder="Perú" />
          </div>
          <div class="field">
            <label class="field-label">Región</label>
            <pv-input-text v-model="form.region" class="w-full" placeholder="Lima" />
          </div>
          <div class="field">
            <label class="field-label">Ciudad / Distrito</label>
            <pv-input-text v-model="form.city" class="w-full" placeholder="Lurín" />
          </div>
          <div class="field">
            <label class="field-label">Dirección</label>
            <pv-input-text v-model="form.address" class="w-full" />
          </div>
        </div>
      </section>

      <!-- Producción -->
      <section class="section">
        <div class="section-header"><span class="section-title">Producción</span></div>
        <div class="form-grid">
          <div class="field">
            <label class="field-label">Cultivo principal</label>
            <pv-input-text v-model="form.crop" class="w-full" :invalid="!!errors.crop"
                           placeholder="Ej: Palta Hass, Arándano, Mango..." />
            <small v-if="errors.crop" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.crop }}
            </small>
          </div>
          <div class="field">
            <label class="field-label">Hectáreas cultivadas</label>
            <pv-input-number v-model="form.cultivatedHectares" :min="0" :minFractionDigits="2" class="w-full" />
          </div>
          <div class="field">
            <label class="field-label">Producción mensual (kg)</label>
            <pv-input-text v-model="form.monthlyProduction" class="w-full" placeholder="Ej: 10,000" />
          </div>
          <div class="field">
            <label class="field-label">Fecha de inicio de operaciones</label>
            <pv-date-picker v-model="form.operationsStartDate" dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa" class="w-full" />
          </div>
          <div class="field">
            <label class="field-label">Calificación (0 a 5)</label>
            <pv-input-number v-model="form.rating" :min="0" :max="5"
                             :minFractionDigits="1" :maxFractionDigits="1" class="w-full" />
          </div>
        </div>
      </section>

      <!-- Certificaciones -->
      <section class="section">
        <div class="section-header"><span class="section-title">Certificaciones</span></div>
        <div class="form-grid-single">
          <div class="field">
            <label class="field-label">Sellos y normas vigentes</label>
            <pv-input-text v-model="form.certifications" class="w-full"
                           placeholder="Ej: GlobalG.A.P, HACCP, ISO 22000" />
          </div>
        </div>
      </section>

      <!-- Acciones -->
      <div class="form-actions">
        <button class="cancel-btn" type="button" @click="onCancel">Cancelar</button>
        <button class="save-btn" type="submit">
          {{ isEditing ? 'Guardar cambios' : 'Guardar Productor' }}
        </button>
      </div>
    </form>

    <pv-dialog v-model:visible="showSuccess" :modal="true" :closable="false" :style="{ width: '420px' }"
               :pt="{
                 root:    { style: 'border-radius: 20px; overflow: hidden; border: none;' },
                 content: { style: 'padding: 0; border-radius: 20px;' },
                 header:  { style: 'display: none;' }
               }">
      <div class="success-dialog">
        <h2 class="success-title">¡PRODUCTOR REGISTRADO EXITOSAMENTE!</h2>
        <div class="success-icon-wrapper">
          <div class="success-icon"><i class="pi pi-check"/></div>
        </div>
        <div class="success-actions">
          <button class="success-btn" type="button" @click="handleSuccessClose">Volver</button>
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
  { label: 'Persona natural', value: 'NATURAL' },
  { label: 'Empresa / SAC',   value: 'EMPRESA' },
  { label: 'Cooperativa',     value: 'COOPERATIVA' }
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
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.breadcrumb {
  font-size: 0.72rem;
  color: #6b7a6b;
  margin-bottom: 0.6rem;
  display: flex;
  gap: 0.3rem;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.breadcrumb .sep    { color: #a3b8a0; }
.breadcrumb .active { color: #1a3020; font-weight: 700; }

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.producer-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 920px;
}

.section { display: flex; flex-direction: column; gap: 1rem; }
.section-header { display: flex; align-items: center; gap: 0.75rem; }
.section-title  { font-size: 1rem; font-weight: 700; color: #e0ead0; }

.form-grid, .form-grid-single {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

.field       { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.8rem; font-weight: 500; color: #c8dcc8; }

.field-error {
  color: #f87171;
  font-size: 0.74rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

:deep(.p-inputtext),
:deep(.p-datepicker-input),
:deep(.p-inputnumber-input),
:deep(.p-select) {
  background: #ffffff !important;
  border: 1.5px solid #ffffff !important;
  color: #1a3020 !important;
  border-radius: 8px !important;
  font-size: 0.88rem !important;
  padding: 0.6rem 0.85rem !important;
}
:deep(.p-invalid .p-inputtext),
:deep(.p-invalid .p-datepicker-input),
:deep(.p-invalid .p-inputnumber-input),
:deep(.p-invalid.p-select) { border-color: #f87171 !important; }

.form-actions { display: flex; justify-content: flex-end; gap: 0.85rem; padding-top: 0.5rem; }

.cancel-btn, .save-btn {
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}
.cancel-btn {
  padding: 0.65rem 1.5rem;
  background: transparent;
  color: #e0ead0;
  border: 1.5px solid #3d5c42;
  transition: background 0.15s;
}
.cancel-btn:hover { background: #2a3d2e; }

.save-btn {
  padding: 0.65rem 1.75rem;
  background: #c8e645;
  color: #1a3020;
  border: none;
  font-weight: 800;
  transition: background 0.15s, transform 0.1s;
}
.save-btn:hover  { background: #d4f06e; transform: translateY(-1px); }
.save-btn:active { transform: translateY(0); }

.success-dialog {
  background: #dff0da;
  border-radius: 20px;
  padding: 2.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}
.success-title {
  font-size: 1.45rem;
  font-weight: 900;
  color: #2d5a35;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
}
.success-icon-wrapper { display: flex; align-items: center; justify-content: center; }
.success-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: #2d5a35;
  display: flex; align-items: center; justify-content: center;
}
.success-icon .pi { font-size: 2rem; color: #dff0da; }
.success-actions { width: 100%; display: flex; justify-content: flex-end; }
.success-btn {
  padding: 0.55rem 1.4rem;
  background: #2d5a35;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.success-btn:hover { background: #1e3d24; }

.w-full { width: 100%; }

@media (max-width: 640px) {
  .form-grid, .form-grid-single { grid-template-columns: 1fr; }
}
</style>
