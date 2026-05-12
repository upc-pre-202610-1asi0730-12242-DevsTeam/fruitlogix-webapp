<template>
  <div class="delivery-card" :class="{ 'delayed': delivery.currentStatus === 'DELAYED' }">
    <div class="card-header">
      <div class="delivery-id">
        <i class="pi pi-box"/>
        <span>PEDIDO {{ delivery.orderId }}</span>
      </div>
      <pv-tag :value="statusLabel" :severity="statusSeverity" class="status-tag" />
    </div>

    <div class="card-body">
      <div class="info-row">
        <div class="info-item">
          <span class="label">CONDUCTOR</span>
          <span class="value">{{ delivery.assignedDriver }}</span>
        </div>
        <div class="info-item text-right">
          <span class="label">VEHÍCULO</span>
          <span class="value">{{ delivery.vehiclePlate }}</span>
        </div>
      </div>

      <div class="eta-section">
        <div class="eta-header">
          <i class="pi pi-clock"/>
          <span>LLEGADA ESTIMADA</span>
        </div>
        <div class="eta-value">{{ formattedETA }}</div>
      </div>

      <!-- Real-time Sensor Data (Mocked/Static for now) -->
      <div class="sensor-grid">
        <div class="sensor-item">
          <i class="pi pi-thermometer sensor-icon temp"/>
          <div class="sensor-info">
            <span class="sensor-label">TEMP.</span>
            <span class="sensor-value">4.2°C</span>
          </div>
        </div>
        <div class="sensor-item">
          <i class="pi pi-cloud sensor-icon hum"/>
          <div class="sensor-info">
            <span class="sensor-label">HUM.</span>
            <span class="sensor-value">85%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-actions">
      <pv-button
          v-if="delivery.currentStatus === 'PENDING_DISPATCH'"
          label="INICIAR RUTA"
          icon="pi pi-play"
          class="action-btn start-btn"
          @click="$emit('start', delivery.deliveryId)"
      />
      <pv-button
          v-if="delivery.currentStatus === 'IN_TRANSIT'"
          label="REPORTAR RETRASO"
          icon="pi pi-exclamation-triangle"
          class="action-btn delay-btn"
          @click="$emit('delay', delivery.deliveryId)"
      />
      <pv-button
          label="DETALLES"
          icon="pi pi-map"
          class="action-btn detail-btn"
          @click="handleDetails"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { useRouter } from 'vue-router';

const props = defineProps({
  delivery: {
    type: Object,
    required: true
  }
});

const router = useRouter();

function handleDetails() {
  router.push({ name: 'delivery-details', params: { id: props.delivery.deliveryId } });
}

const statusLabel = computed(() => {
  const labels = {
    'PENDING_DISPATCH': 'PENDIENTE',
    'IN_TRANSIT': 'EN RUTA',
    'DELAYED': 'RETRASADO',
    'DELIVERED': 'ENTREGADO',
    'FAILED': 'FALLIDO'
  };
  return labels[props.delivery.currentStatus] || props.delivery.currentStatus;
});

const statusSeverity = computed(() => {
  const severities = {
    'PENDING_DISPATCH': 'info',
    'IN_TRANSIT': 'success',
    'DELAYED': 'danger',
    'DELIVERED': 'success',
    'FAILED': 'danger'
  };
  return severities[props.delivery.currentStatus] || 'info';
});

const formattedETA = computed(() => {
  if (!props.delivery.estimatedTimeOfArrival) return 'N/A';
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(new Date(props.delivery.estimatedTimeOfArrival));
});
</script>

<style scoped>
.delivery-card {
  background: #1e2d22;
  border-radius: 20px;
  padding: 1.5rem;
  color: #e0ead0;
  border: 1px solid #2a3d2e;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.delivery-card:hover {
  transform: translateY(-5px);
  border-color: #c9e265;
  box-shadow: 0 15px 35px rgba(201, 226, 101, 0.1);
}

.delivery-card.delayed {
  border-color: #f87171;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delivery-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  color: #c9e265;
}

.status-tag {
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #6b8a6b;
  letter-spacing: 0.1em;
}

.value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e0ead0;
}

.eta-section {
  background: #2a3d2e;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.eta-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #8fba8f;
  letter-spacing: 0.05em;
}

.eta-value {
  font-size: 1.1rem;
  font-weight: 900;
  color: #d4f7b4;
}

.sensor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sensor-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sensor-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.sensor-icon.temp { background: rgba(248, 113, 113, 0.1); color: #f87171; }
.sensor-icon.hum  { background: rgba(96, 165, 250, 0.1); color: #60a5fa; }

.sensor-info {
  display: flex;
  flex-direction: column;
}

.sensor-label { font-size: 0.55rem; font-weight: 800; color: #6b8a6b; }
.sensor-value { font-size: 0.85rem; font-weight: 700; color: #e0ead0; }

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 10px;
  padding: 0.6rem 0;
  transition: all 0.2s;
}

.start-btn { background: #c9e265 !important; border: none !important; color: #1a3020 !important; }
.start-btn:hover { background: #d6ec6e !important; }

.delay-btn { background: transparent !important; border: 1px solid #f87171 !important; color: #f87171 !important; }
.delay-btn:hover { background: rgba(248, 113, 113, 0.1) !important; }

.detail-btn { background: #2a3d2e !important; border: none !important; color: #e0ead0 !important; }
.detail-btn:hover { background: #3d5c42 !important; }

.text-right { text-align: right; }

@media (max-width: 480px) {
  .delivery-card { padding: 1rem; }
  .sensor-grid { grid-template-columns: 1fr; gap: 0.75rem; }
  .card-actions { flex-direction: column; }
  .action-btn { width: 100%; }
  .eta-value { font-size: 0.9rem; }
}
</style>
