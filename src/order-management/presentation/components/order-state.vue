<template>
  <pv-dialog
      v-model:visible="internalVisible"
      modal
      :header="`Seguimiento de Pedido ${formatId(order?.id)}`"
      :style="{ width: '850px' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="order-state-dialog"
  >
    <div class="tracking-container" v-if="order">
      <p class="page-subtitle">Cliente: {{ formatText(order.clientName) }} - Fruta: <span v-html="formatText(order.fruitName)"></span></p>

      <div class="content-grid">
        <!-- Columna izq -->
        <div class="order-card">
          <div class="producer-section-title">
            <i class="pi pi-history"/>
            Historial de Estados
          </div>

          <div class="producer-row" :class="{ selected: step === 1 }" @click="changeStatus(1, 'Registrado')">
            <div class="producer-icon" :style="step >= 1 ? 'color: #1e2d22; background: #c8e645;' : ''">
              <i class="pi pi-file-edit"/>
            </div>
            <div class="producer-info">
              <span class="producer-name" :style="step >= 1 ? 'color: #e0ead0;' : 'color: #6b8a6b;'">Pedido Registrado</span>
              <span class="producer-location">Hace 3 días</span>
            </div>
            <div class="radio-outer" :class="{ active: step >= 1 }">
              <div v-if="step >= 1" class="radio-inner" :style="{ background: '#c8e645' }"/>
            </div>
          </div>

          <div class="producer-row" :class="{ selected: step === 2 }" @click="changeStatus(2, 'En Preparación')">
            <div class="producer-icon" :style="step >= 2 ? 'color: #1e2d22; background: #c8e645;' : ''">
              <i class="pi pi-box"/>
            </div>
            <div class="producer-info">
              <span class="producer-name" :style="step >= 2 ? 'color: #e0ead0;' : 'color: #6b8a6b;'">En Preparación</span>
              <span class="producer-location" v-if="step >= 2">Hace 2 días</span>
              <span class="producer-location" v-else>Pendiente</span>
            </div>
            <div class="radio-outer" :class="{ active: step >= 2 }">
              <div v-if="step >= 2" class="radio-inner" :style="{ background: '#c8e645' }"/>
            </div>
          </div>

          <div class="producer-row" :class="{ selected: step === 3 }" @click="changeStatus(3, 'En Camino')">
            <div class="producer-icon" :style="step >= 3 ? 'color: #1e2d22; background: #c8e645;' : ''">
              <i class="pi pi-truck"/>
            </div>
            <div class="producer-info">
              <span class="producer-name" :style="step >= 3 ? 'color: #e0ead0;' : 'color: #6b8a6b;'">En Camino</span>
              <span class="producer-location" v-if="step >= 3">Ayer</span>
              <span class="producer-location" v-else>Pendiente</span>
            </div>
            <div class="radio-outer" :class="{ active: step >= 3 }">
              <div v-if="step >= 3" class="radio-inner" :style="{ background: '#c8e645' }"/>
            </div>
          </div>

          <div class="producer-row" :class="{ selected: step === 4 }" @click="changeStatus(4, 'Entregado')">
            <div class="producer-icon" :style="step >= 4 ? 'color: #1e2d22; background: #c8e645;' : ''">
              <i class="pi pi-check-circle"/>
            </div>
            <div class="producer-info">
              <span class="producer-name" :style="step >= 4 ? 'color: #e0ead0;' : 'color: #6b8a6b;'">Entregado</span>
              <span class="producer-location" v-if="step >= 4">Hoy</span>
              <span class="producer-location" v-else>Pendiente</span>
            </div>
            <div class="radio-outer" :class="{ active: step >= 4 }">
              <div v-if="step >= 4" class="radio-inner" :style="{ background: '#c8e645' }"/>
            </div>
          </div>
        </div>

        <!-- Columna derecha -->
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
              <div class="map-pin origin">ORIGEN</div>
              <div class="map-pin destination">DESTINO</div>
            </div>
            <div class="route-info">
              <div class="route-title"><i class="pi pi-map"/> RUTA DE ENTREGA ESTIMADA</div>
              <div class="route-detail">Origen: Finca Productora</div>
              <div class="route-detail">Destino: Cliente Central</div>
              <div class="route-meta">
                <span>ESTADO ACTUAL: {{ order.status.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Resumen -->
          <div class="summary-card">
            <div class="summary-title">DETALLES DE LA CARGA</div>
            <div class="summary-row">
              <span class="summary-label">Volumen Total</span>
              <span class="summary-value">{{ order.quantity }}</span>
            </div>
            <hr class="summary-divider"/>
            <div class="summary-row">
              <span class="summary-label total-label">Asignado a</span>
              <span class="summary-total" style="font-size: 0.85rem; color: #4ade80;">Productor Local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </pv-dialog>
</template>

<script setup>
import { computed } from 'vue';

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

const emit = defineEmits(['update:visible', 'status-change']);

const internalVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const changeStatus = (newStep, statusStr) => {
  if (props.order) {
    emit('status-change', { orderId: props.order.id, newStatus: statusStr });
  }
};

const formatId = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '');
};

const formatText = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, ' ');
};

// Determine step based on status
const step = computed(() => {
  if (!props.order) return 1;
  const status = props.order.status.toLowerCase();
  if (status.includes('entregado')) return 4;
  if (status.includes('camino')) return 3;
  if (status.includes('retrasado') || status.includes('preparación')) return 2;
  return 1;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

:deep(.p-dialog) {
  font-family: 'DM Sans', sans-serif;
}

:global(.order-state-dialog) {
  font-family: 'DM Sans', sans-serif !important;
  background: #e8f5e4 !important;
  border-radius: 16px !important;
  border: 1px solid #a3b8a0 !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
}

:global(.order-state-dialog .p-dialog-header) {
  background: #e8f5e4 !important;
  color: #1a3020 !important;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
  border-bottom: none !important;
}

:global(.order-state-dialog .p-dialog-title) {
  font-weight: 800 !important;
  font-size: 1.5rem !important;
  letter-spacing: -0.02em !important;
}

:global(.order-state-dialog .p-dialog-content) {
  background: #e8f5e4 !important;
  color: #1a3020 !important;
  padding: 0 1.5rem 1.5rem 1.5rem !important;
  border-bottom-left-radius: 16px !important;
  border-bottom-right-radius: 16px !important;
}

:global(.order-state-dialog .p-dialog-header-icons .p-dialog-header-icon) {
  color: #6b7a6b !important;
}
:global(.order-state-dialog .p-dialog-header-icons .p-dialog-header-icon:hover) {
  background: #a3b8a0 !important;
  color: #1a3020 !important;
}

.tracking-container {
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

.producer-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #8fba8f;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}

.producer-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 1rem;
  background: #2a3d2e;
  border-radius: 10px;
  margin-bottom: 0.55rem;
  border: 1.5px solid transparent;
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
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
  transition: all 0.3s;
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
  height: 180px;
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

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
