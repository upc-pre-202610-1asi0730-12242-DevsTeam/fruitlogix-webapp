<template>
  <div class="page-wrapper">

    <nav class="breadcrumb">
      <span>{{ t('orders.breadcrumb.home') }}</span>
      <span class="sep">></span>
      <span>{{ t('orders.breadcrumb.orders') }}</span>
      <span class="sep">></span>
      <span class="active">{{ t('orders.breadcrumb.create') }}</span>
    </nav>

    <h1 class="page-title">{{ t('orders.register.title') }}</h1>
    <p class="page-subtitle">{{ t('orders.register.subtitle') }}</p>

    <div class="content-grid">

      <!-- Columna izq del form-->
      <form class="order-card" @submit.prevent="handleSubmit">

        <!-- Frutas seleccionadas -->
        <div class="field fruit-field-full">
          <label class="field-label">{{ t('orders.register.fruits_label') }}</label>
          <button type="button" class="select-fruits-btn" :class="{ 'has-error': !!errors.selectedFruits }" @click="$emit('open-fruit-selector')">
            <i class="pi pi-shopping-cart"/>
            {{ t('orders.register.select_fruits') }}
            <span v-if="selectedFruits.length" class="fruits-count-badge">{{ selectedFruits.length }}</span>
          </button>
          <div v-if="selectedFruits.length" class="fruits-chips">
            <span v-for="f in selectedFruits" :key="f.id" class="fruit-chip">
              {{ f.name }} · {{ f.quantity }} kg
            </span>
          </div>
          <small v-if="errors.selectedFruits" class="field-error">
            <i class="pi pi-info-circle"/> {{ errors.selectedFruits }}
          </small>
        </div>

        <div class="form-grid">

          <div class="field">
            <label class="field-label">{{ t('orders.register.delivery_date') }}</label>
            <pv-date-picker
                v-model="form.deliveryDueDate"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                class="w-full"
                :invalid="!!errors.deliveryDueDate"
            />
            <small v-if="errors.deliveryDueDate" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.deliveryDueDate }}
            </small>
          </div>

          <div class="field">
            <label class="field-label">{{ t('orders.register.commercial_client') }}</label>
            <pv-input-text
                v-model="form.commercialClientId"
                :placeholder="t('orders.register.client_placeholder')"
                class="w-full"
                :invalid="!!errors.commercialClientId"
            />
            <small v-if="errors.commercialClientId" class="field-error">
              <i class="pi pi-info-circle"/> {{ errors.commercialClientId }}
            </small>
          </div>
        </div>

        <!-- Asignar productor -->
        <div class="producer-section">
          <div class="producer-section-title">
            <i class="pi pi-map-marker"/>
            {{ t('orders.register.assign_producer') }}
          </div>

          <div
              v-for="producer in producers"
              :key="producer.id"
              class="producer-row"
              :class="{ selected: form.producerId === producer.id }"
              @click="form.producerId = producer.id"
          >
            <div class="producer-icon">
              <i class="pi pi-truck"/>
            </div>
            <div class="producer-info">
              <span class="producer-name">{{ producer.name }}</span>
              <span class="producer-location">{{ producer.location }}</span>
            </div>
            <div class="producer-rating">
              <div class="rating-top">
                <i class="pi pi-star-fill rating-star"/> {{ producer.rating }}
              </div>
              <span class="rating-label">{{ t('orders.register.rating') }}</span>
            </div>
            <div class="radio-outer" :class="{ active: form.producerId === producer.id }">
              <div v-if="form.producerId === producer.id" class="radio-inner"/>
            </div>
          </div>

          <small v-if="errors.producerId" class="field-error mt-sm">
            <i class="pi pi-info-circle"/> {{ errors.producerId }}
          </small>
        </div>

      </form>

      <!-- ── Columna derecha ── -->
      <div class="right-col">

        <!-- Mapa -->
        <div class="map-card">
          <div class="map-area">
            <img
                src="https://media.bikemap.net/routes/14746781/staticmaps/in_1cd954e7-41bf-4700-bc04-397435420426_694x400_bikemap-2021-3D-static.png"
                alt="Mapa de ruta de entrega"
                class="map-img"
            />
            <div class="map-controls">
              <button class="map-btn" type="button">+</button>
              <button class="map-btn" type="button">−</button>
            </div>
            <div class="map-pin origin">{{ t('orders.register.map.origin_label') }}</div>
            <div class="map-pin destination">{{ t('orders.register.map.destination_label') }}</div>
          </div>
          <div class="route-info">
            <div class="route-title"><i class="pi pi-map"/> {{ t('orders.register.map.title') }}</div>
            <div class="route-detail">Origen: SJL</div>
            <div class="route-detail">Destino: Surco</div>
            <div class="route-meta">
              <span>{{ t('orders.register.map.distance') }}: 1.9KM</span>
              <span>{{ t('orders.register.map.time') }}: 40min</span>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="summary-card">
          <div class="summary-title">{{ t('orders.register.summary.title') }}</div>
          <div class="summary-row">
            <span class="summary-label">{{ t('orders.register.summary.subtotal') }}</span>
            <span class="summary-value">S/. {{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('orders.register.summary.logistics') }}</span>
            <span class="summary-value">S/. {{ logistics.toFixed(2) }}</span>
          </div>
          <hr class="summary-divider"/>
          <div class="summary-row">
            <span class="summary-label total-label">{{ t('orders.register.summary.total') }}</span>
            <span class="summary-total">S/. {{ totalFinal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Confirmar -->
        <button class="confirm-btn" type="button" @click="handleSubmit">
          <i class="pi pi-check-circle"/>
          {{ t('orders.register.confirm_btn') }}
        </button>
        <p class="confirm-note">
          {{ t('orders.register.confirm_note') }}
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import { useI18n } from 'vue-i18n'
import { validateOrderForm } from '../../application/validators/order-form.validator.js'

const props = defineProps({
  selectedFruits: { type: Array, default: () => [] },
  formData: { type: Object, required: true }
})

const emit = defineEmits(['submit', 'cancel', 'open-fruit-selector'])
const { t } = useI18n();

const producers = ref([
  {id: 'p1', name: 'Juan Martinez',   location: 'Lurin, Lima',    rating: '4.9'},
  {id: 'p2', name: 'Julian Del Valle', location: 'Mala, Cañete',  rating: '4.7'},
  {id: 'p3', name: 'Wilber Mendoza',  location: 'Chilca, Cañete', rating: '4.8'},
])

// Usamos directamente el objeto del prop para mantener la reactividad compartida
const form = props.formData;

const errors = ref({})

const LOGISTICS_PCT = 0.05

const subtotal   = computed(() => props.selectedFruits.reduce((s, f) => s + f.quantity * f.price, 0))
const logistics  = computed(() => subtotal.value * LOGISTICS_PCT)
const totalFinal = computed(() => subtotal.value + logistics.value)

function validate() {
  const result = validateOrderForm({
    selectedFruits: props.selectedFruits,
    deliveryDueDate: form.deliveryDueDate,
    commercialClientId: form.commercialClientId,
    producerId: form.producerId
  }, { requireProducer: true })
  errors.value = result.errors
  return result.valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    selectedFruits: props.selectedFruits,
    fruitType: props.selectedFruits.map(f => f.name).join(', '),
    quantity: props.selectedFruits.reduce((s, f) => s + f.quantity, 0),
    deliveryDueDate: form.deliveryDueDate,
    commercialClientId: form.commercialClientId,
    producerId: form.producerId,
    status: t('orders.register.status_registered'),
    totalVolume: props.selectedFruits.reduce((s, f) => s + f.quantity, 0),
    totalAmount: totalFinal.value,
  })
}
</script>

<style scoped>
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

.breadcrumb .sep {
  color: #a3b8a0;
}

.breadcrumb .active {
  color: #1a3020;
  font-weight: 700;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.87rem;
  color: #4a6b4a;
  margin: 0 0 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 370px;
  gap: 1.25rem;
  align-items: start;
}

.order-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.75rem;
}

/* Fruit selector button + chips */
.fruit-field-full {
  margin-bottom: 1.1rem;
}

.select-fruits-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #c8e645, #a8d020);
  border: none;
  border-radius: 12px;
  color: #1a3020;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(200, 230, 69, 0.3);
  width: 100%;
}
.select-fruits-btn:hover {
  background: linear-gradient(135deg, #d4f06e, #b8e030);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(200, 230, 69, 0.4);
}
.select-fruits-btn:active { transform: translateY(0); }
.select-fruits-btn.has-error { box-shadow: 0 0 0 2px #f87171; }

.fruits-count-badge {
  margin-left: auto;
  background: #1a3020;
  color: #c8e645;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 99px;
}

.fruits-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.fruit-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  background: #2a3d2e;
  border: 1px solid #4ade80;
  border-radius: 99px;
  font-size: 0.73rem;
  font-weight: 600;
  color: #d4f7b4;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #8fba8f;
}

.field-error {
  color: #f87171;
  font-size: 0.74rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.mt-sm {
  margin-top: 0.4rem;
}

:deep(.p-inputtext),
:deep(.p-datepicker-input),
:deep(.p-select),
:deep(.p-inputnumber-input) {
  background: #2a3d2e !important;
  border: 1.5px solid #3d5c42 !important;
  color: #e0ead0 !important;
  border-radius: 8px !important;
  font-size: 0.88rem !important;
}

:deep(.p-inputtext::placeholder),
:deep(.p-datepicker-input::placeholder),
:deep(.p-inputnumber-input::placeholder) {
  color: #5d7a5d !important;
}

:deep(.p-select-label) {
  color: #e0ead0 !important;
}

:deep(.p-select-dropdown) {
  color: #8fba8f !important;
}

:deep(.p-invalid .p-inputtext),
:deep(.p-invalid .p-select),
:deep(.p-invalid .p-datepicker-input),
:deep(.p-invalid .p-inputnumber-input) {
  border-color: #f87171 !important;
}

.producer-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #8fba8f;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
}

.producer-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 1rem;
  background: #2a3d2e;
  border-radius: 10px;
  margin-bottom: 0.55rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: border-color 0.15s, background 0.15s;
}

.producer-row:hover {
  background: #31492f;
}

.producer-row.selected {
  border-color: #4ade80;
  background: #2d4a31;
}

.producer-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 8px;
  background: #3d5c42;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  font-size: 1rem;
}

.producer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.producer-name {
  font-size: 0.87rem;
  font-weight: 600;
  color: #e0ead0;
}

.producer-location {
  font-size: 0.73rem;
  color: #6b8a6b;
}

.producer-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.rating-top {
  font-size: 0.87rem;
  font-weight: 700;
  color: #e0ead0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-star {
  color: #facc15;
  font-size: 0.72rem;
}

.rating-label {
  font-size: 0.6rem;
  color: #6b8a6b;
  letter-spacing: 0.07em;
}

.radio-outer {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border-radius: 50%;
  border: 2px solid #3d5c42;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.radio-outer.active {
  border-color: #4ade80;
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
}

/* ── Columna derecha ── */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-card {
  background: #1e2d22;
  border-radius: 16px;
  overflow: hidden;
}

.map-area {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.map-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.map-btn {
  width: 28px;
  height: 28px;
  background: #1e2d22cc;
  border: 1px solid #3d5c42;
  color: #8fba8f;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.map-pin {
  position: absolute;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 2;
}

.map-pin.origin {
  top: 18px;
  right: 28px;
  background: #1e2d22cc;
  color: #4ade80;
  border: 1px solid #4ade80;
  backdrop-filter: blur(4px);
}

.map-pin.destination {
  bottom: 22px;
  right: 28px;
  background: #1e2d22cc;
  color: #f87171;
  border: 1px solid #f87171;
  backdrop-filter: blur(4px);
}

.route-info {
  padding: 0.9rem 1.2rem;
}

.route-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #4ade80;
  margin-bottom: 0.45rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.route-detail {
  font-size: 0.78rem;
  color: #c8dcc8;
  margin-bottom: 0.1rem;
}

.route-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.45rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #6b8a6b;
}

.summary-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.2rem 1.4rem;
}

.summary-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #8fba8f;
  margin-bottom: 0.9rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
}

.summary-label {
  font-size: 0.82rem;
  color: #c8dcc8;
}

.summary-value {
  font-size: 0.82rem;
  color: #e0ead0;
  font-weight: 600;
}

.total-label {
  font-weight: 700;
  color: #e0ead0;
}

.summary-divider {
  border: none;
  border-top: 1px solid #2a3d2e;
  margin: 0.7rem 0;
}

.summary-total {
  font-size: 1rem;
  font-weight: 800;
  color: #d4f7b4;
}

.confirm-btn {
  width: 100%;
  padding: 0.85rem;
  background: #c8e645;
  color: #1a3020;
  border: none;
  border-radius: 12px;
  font-size: 0.93rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, transform 0.1s;
}

.confirm-btn:hover {
  background: #d4f06e;
  transform: translateY(-1px);
}

.confirm-btn:active {
  transform: translateY(0);
}

.confirm-note {
  font-size: 0.65rem;
  color: #6b8a6b;
  text-align: center;
  letter-spacing: 0.03em;
  line-height: 1.55;
  margin: 0;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>