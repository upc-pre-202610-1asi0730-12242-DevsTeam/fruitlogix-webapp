<template>
  <pv-dialog
      v-model:visible="internalVisible"
      modal
      :header="`Editar Pedido ${formatId(order?.id)}`"
      :style="{ width: '850px' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="order-edit-dialog"
  >
    <div class="edit-container" v-if="order">
      <p class="page-subtitle">
        Modifica los datos del pedido de
        <span v-html="formatText(order.clientName)"></span> —
        <span v-html="formatText(order.fruitName)"></span>
      </p>

      <!-- Restriction Message -->
      <div v-if="isRestricted" class="restriction-banner">
        <i class="pi pi-exclamation-circle" />
        <div>
          <span class="banner-title">PEDIDO RESTRINGIDO</span>
          <p class="banner-text">Este pedido se encuentra en estado <strong>{{ order.status }}</strong> y no admite modificaciones.</p>
        </div>
      </div>

      <div class="content-grid">
        <!-- Columna izquierda: formulario -->
        <form class="order-card" @submit.prevent="handleSubmit">

          <div class="form-grid">
            <!-- Tipo de fruta -->
            <div class="field">
              <label class="field-label">TIPO DE FRUTA</label>
              <pv-select
                  v-model="form.fruitType"
                  :options="fruitOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecciona un tipo de fruta"
                  class="w-full"
                  :invalid="!!errors.fruitType"
              />
              <small v-if="errors.fruitType" class="field-error">
                <i class="pi pi-info-circle"/> {{ errors.fruitType }}
              </small>
            </div>

            <!-- Cantidad -->
            <div class="field">
              <label class="field-label">CANTIDAD (KG)</label>
              <pv-input-number
                  v-model="form.quantity"
                  placeholder="0.00"
                  :min="0"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  class="w-full"
                  :invalid="!!errors.quantity"
              />
              <small v-if="errors.quantity" class="field-error">
                <i class="pi pi-info-circle"/> {{ errors.quantity }}
              </small>
            </div>

            <!-- Fecha de entrega -->
            <div class="field">
              <label class="field-label">FECHA DE ENTREGA</label>
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

            <!-- Cliente comercial -->
            <div class="field">
              <label class="field-label">CLIENTE COMERCIAL</label>
              <pv-input-text
                  v-model="form.commercialClientId"
                  placeholder="Ej: Supermercados Global"
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
              Asignar Productor
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
                <span class="rating-label">CALIFICACIÓN</span>
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

        <!-- Columna derecha -->
        <div class="right-col">
          <!-- Resumen actualizado -->
          <div class="summary-card">
            <div class="summary-title">RESUMEN DEL PEDIDO</div>
            <div class="summary-row">
              <span class="summary-label">Subtotal Estimado</span>
              <span class="summary-value">S/. {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Logística &amp; Manejo</span>
              <span class="summary-value">S/. {{ logistics.toFixed(2) }}</span>
            </div>
            <hr class="summary-divider"/>
            <div class="summary-row">
              <span class="summary-label total-label">Total Final</span>
              <span class="summary-total">S/. {{ totalFinal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Estado actual -->
          <div class="status-card">
            <div class="status-card-title">
              <i class="pi pi-info-circle"/> ESTADO ACTUAL
            </div>
            <div class="status-value">
              <span class="status-badge" :class="statusClass">
                {{ order.status }}
              </span>
            </div>
            <p class="status-note">El estado sólo puede modificarse desde el seguimiento de pedido.</p>
          </div>

          <!-- Botones -->
          <button
              class="confirm-btn"
              :class="{ disabled: isRestricted }"
              type="button"
              @click="!isRestricted && handleSubmit()"
          >
            <i class="pi pi-save"/>
            Guardar Cambios
          </button>
          <button class="cancel-btn" type="button" @click="internalVisible = false">
            <i class="pi pi-times"/>
            {{ isRestricted ? 'Cerrar' : 'Cancelar' }}
          </button>
          <p class="confirm-note">
            AL GUARDAR, SE ACTUALIZARÁN LOS DATOS DEL PEDIDO Y SE NOTIFICARÁ AL PRODUCTOR ASIGNADO.
          </p>
        </div>
      </div>
    </div>
  </pv-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'save']);

const internalVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const fruitOptions = [
  { label: 'Palta',     value: 'palta'    },
  { label: 'Mango',     value: 'mango'    },
  { label: 'Arándano',  value: 'arandano' },
  { label: 'Fresa',     value: 'fresa'    },
  { label: 'Limón',     value: 'limon'    },
  { label: 'Manzana',   value: 'manzana'  },
  { label: 'Pera',      value: 'pera'     },
  { label: 'Cereza',    value: 'cereza'   },
  { label: 'Uva',       value: 'uva'      },
];

const producers = ref([
  { id: 'p1', name: 'Juan Martinez',    location: 'Lurin, Lima',    rating: '4.9' },
  { id: 'p2', name: 'Julian Del Valle', location: 'Mala, Cañete',   rating: '4.7' },
  { id: 'p3', name: 'Wilber Mendoza',   location: 'Chilca, Cañete', rating: '4.8' },
]);

const form = ref({
  fruitType:          null,
  quantity:           null,
  deliveryDueDate:    null,
  commercialClientId: '',
  producerId:         null,
});

const errors = ref({});

watch(
    () => props.order,
    (newOrder) => {
      if (!newOrder) return;
      form.value = {
        fruitType:          newOrder.fruitType          ?? null,
        quantity:           parseFloat(newOrder.quantity) || null,
        deliveryDueDate:    newOrder.deliveryDueDate     ? new Date(newOrder.deliveryDueDate) : null,
        commercialClientId: newOrder.clientName?.replace(/\n/g, ' ')  ?? '',
        producerId:         newOrder.producerId          ?? null,
      };
      errors.value = {};
    },
    { immediate: true }
);

const UNIT_PRICE    = 8.5;
const LOGISTICS_PCT = 0.05;

const subtotal   = computed(() => (form.value.quantity || 0) * UNIT_PRICE);
const logistics  = computed(() => subtotal.value * LOGISTICS_PCT);
const totalFinal = computed(() => subtotal.value + logistics.value);

const statusClass = computed(() => {
  if (!props.order) return '';
  const s = props.order.status?.toLowerCase() ?? '';
  if (s.includes('entregado')) return 'badge-delivered';
  if (s.includes('camino'))    return 'badge-transit';
  if (s.includes('cancelado')) return 'badge-cancelled';
  return 'badge-delayed';
});

const isRestricted = computed(() => {
  if (!props.order) return false;
  const s = props.order.status?.toLowerCase() ?? '';
  return s.includes('entregado') || s.includes('cancelado');
});

function validate() {
  errors.value = {};
  let valid = true;
  if (!form.value.fruitType) {
    errors.value.fruitType = 'El tipo de fruta es obligatorio.'; valid = false;
  }
  if (!form.value.quantity || form.value.quantity <= 0) {
    errors.value.quantity = 'La cantidad es obligatoria.'; valid = false;
  }
  if (!form.value.deliveryDueDate) {
    errors.value.deliveryDueDate = 'La fecha de entrega es obligatoria.'; valid = false;
  }
  if (!form.value.commercialClientId?.trim()) {
    errors.value.commercialClientId = 'El cliente es obligatorio.'; valid = false;
  }
  if (!form.value.producerId) {
    errors.value.producerId = 'Selecciona un productor.'; valid = false;
  }
  return valid;
}

function handleSubmit() {
  if (!validate()) return;
  emit('save', {
    orderId:            props.order.id,
    fruitType:          form.value.fruitType,
    quantity:           form.value.quantity,
    deliveryDueDate:    form.value.deliveryDueDate,
    commercialClientId: form.value.commercialClientId,
    producerId:         form.value.producerId,
    totalAmount:        totalFinal.value,
  });
  internalVisible.value = false;
}

const formatId   = (text) => text ? text.replace(/\n/g, '') : '';
const formatText = (text) => text ? text.replace(/\n/g, ' ') : '';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

:deep(.p-dialog) {
  font-family: 'DM Sans', sans-serif;
}

:global(.order-edit-dialog) {
  font-family: 'DM Sans', sans-serif !important;
  background: #e8f5e4 !important;
  border-radius: 16px !important;
  border: 1px solid #a3b8a0 !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
}

:global(.order-edit-dialog .p-dialog-header) {
  background: #e8f5e4 !important;
  color: #1a3020 !important;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
  border-bottom: none !important;
}

:global(.order-edit-dialog .p-dialog-title) {
  font-weight: 800 !important;
  font-size: 1.5rem !important;
  letter-spacing: -0.02em !important;
}

:global(.order-edit-dialog .p-dialog-content) {
  background: #e8f5e4 !important;
  color: #1a3020 !important;
  padding: 0 1.5rem 1.5rem 1.5rem !important;
  border-bottom-left-radius: 16px !important;
  border-bottom-right-radius: 16px !important;
}

:global(.order-edit-dialog .p-dialog-header-icons .p-dialog-header-icon) {
  color: #6b7a6b !important;
}
:global(.order-edit-dialog .p-dialog-header-icons .p-dialog-header-icon:hover) {
  background: #a3b8a0 !important;
  color: #1a3020 !important;
}

.edit-container {
  font-family: 'DM Sans', sans-serif;
}

.page-subtitle {
  font-size: 0.87rem;
  color: #4a6b4a;
  margin: 0 0 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  align-items: start;
}

.order-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.75rem;
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

.mt-sm { margin-top: 0.4rem; }

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

:deep(.p-select-label)    { color: #e0ead0 !important; }
:deep(.p-select-dropdown) { color: #8fba8f !important; }

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
.producer-row:hover    { background: #31492f; }
.producer-row.selected { border-color: #4ade80; background: #2d4a31; }

.producer-icon {
  width: 36px; height: 36px; min-width: 36px;
  border-radius: 8px;
  background: #3d5c42;
  display: flex; align-items: center; justify-content: center;
  color: #4ade80; font-size: 1rem;
}

.producer-info  { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
.producer-name  { font-size: 0.87rem; font-weight: 600; color: #e0ead0; }
.producer-location { font-size: 0.73rem; color: #6b8a6b; }

.producer-rating { display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem; }
.rating-top      { font-size: 0.87rem; font-weight: 700; color: #e0ead0; display: flex; align-items: center; gap: 0.25rem; }
.rating-star     { color: #facc15; font-size: 0.72rem; }
.rating-label    { font-size: 0.6rem; color: #6b8a6b; letter-spacing: 0.07em; }

.radio-outer {
  width: 18px; height: 18px; min-width: 18px;
  border-radius: 50%;
  border: 2px solid #3d5c42;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s;
}
.radio-outer.active { border-color: #4ade80; }
.radio-inner { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; }

.right-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Summary card */
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

.summary-label  { font-size: 0.82rem; color: #c8dcc8; }
.summary-value  { font-size: 0.82rem; color: #e0ead0; font-weight: 600; }
.total-label    { font-weight: 700; color: #e0ead0; }
.summary-total  { font-size: 1rem; font-weight: 800; color: #d4f7b4; }
.summary-divider { border: none; border-top: 1px solid #2a3d2e; margin: 0.7rem 0; }

/* Status card */
.status-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.2rem 1.4rem;
}

.status-card-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #8fba8f;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.status-value   { margin-bottom: 0.6rem; }

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-delivered { background: #1bb37e; color: white; }
.badge-transit   { background: rgba(212,163,75,0.15); color: #e5b95e; border: 1px solid rgba(212,163,75,0.2); }
.badge-delayed   { background: rgba(242,95,92,0.15);  color: #f25f5c; border: 1px solid rgba(242,95,92,0.2); }

.status-note {
  font-size: 0.68rem;
  color: #6b8a6b;
  line-height: 1.45;
  margin: 0;
}

/* Buttons */
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
  font-family: 'DM Sans', sans-serif;
}
.confirm-btn:hover  { background: #d4f06e; transform: translateY(-1px); }
.confirm-btn:active { transform: translateY(0); }

.cancel-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  color: #6b8a6b;
  border: 1.5px solid #3d5c42;
  border-radius: 12px;
  font-size: 0.87rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, color 0.15s;
  font-family: 'DM Sans', sans-serif;
}
.cancel-btn:hover { background: #2a3d2e; color: #e0ead0; }

.confirm-note {
  font-size: 0.65rem;
  color: #6b8a6b;
  text-align: center;
  letter-spacing: 0.03em;
  line-height: 1.55;
  margin: 0;
}

/* ── Restriction Banner ── */
.restriction-banner {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fca5a5;
}
.restriction-banner .pi {
  font-size: 1.5rem;
}
.banner-title {
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.2rem;
}
.banner-text {
  font-size: 0.85rem;
  margin: 0;
  color: #f87171;
}
.confirm-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #4a5d4a;
  color: #1a3020;
}
.confirm-btn.disabled:hover { transform: none; }

.badge-cancelled { background: rgba(120, 113, 108, 0.2); color: #a8a29e; border: 1px solid rgba(120, 113, 108, 0.3); }

.w-full { width: 100%; }

@media (max-width: 768px) {
  .content-grid { grid-template-columns: 1fr; }
  .form-grid    { grid-template-columns: 1fr; }
}
</style>
