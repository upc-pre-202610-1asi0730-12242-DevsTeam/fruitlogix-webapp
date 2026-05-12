<template>
  <div class="device-card-horizontal" :class="statusClass">
    <div class="card-content-left">
      <!-- Icon -->
      <div class="type-icon-box">
        <i :class="typeIcon" />
      </div>

      <!-- ID & Info -->
      <div class="info-group id-group">
        <span class="label">DEVICE ID</span>
        <span class="value">{{ device.deviceId.toUpperCase() }}</span>
      </div>

      <div class="info-group type-group">
        <span class="label">TYPE</span>
        <span class="value type-val">
          <i :class="typeIcon" class="mini-icon" />
          {{ device.deviceType }}
        </span>
      </div>

      <div class="info-group location-group">
        <span class="label">LOCATION</span>
        <span class="value"><i class="pi pi-map-marker" /> {{ device.location }}</span>
      </div>

      <!-- Metric (Dynamic based on type) -->
      <div class="info-group metric-group">
        <span class="label">{{ metricLabel }}</span>
        <span class="value highlight-metric">{{ latestReadingValue }}{{ latestReadingUnit }}</span>
      </div>
    </div>

    <div class="card-content-right">
      <!-- Status Tag -->
      <pv-tag :value="device.status" :severity="statusSeverity" class="status-tag" />

      <!-- Calibrate Button -->
      <pv-button
          label="CALIBRATE"
          class="calibrate-action-btn"
          @click="$emit('calibrate', device.deviceId)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  device: { type: Object, required: true },
  latestReading: { type: Object, default: null }
});

defineEmits(['calibrate']);

const statusClass = computed(() => `status-${props.device.status.toLowerCase()}`);

const typeIcon = computed(() => {
  const icons = {
    'TEMPERATURE_SENSOR': 'pi pi-thermometer',
    'HUMIDITY_SENSOR': 'pi pi-cloud',
    'GPS_TRACKER': 'pi pi-map',
    'WEIGHT_SCALE': 'pi pi-box'
  };
  return icons[props.device.deviceType] || 'pi pi-cog';
});

const metricLabel = computed(() => {
  const labels = {
    'TEMPERATURE_SENSOR': 'LAST READING',
    'HUMIDITY_SENSOR': 'LAST READING',
    'GPS_TRACKER': 'SPEED',
    'WEIGHT_SCALE': 'PAYLOAD'
  };
  return labels[props.device.deviceType] || 'VALUE';
});

const latestReadingValue = computed(() => props.latestReading?.value ?? '--');
const latestReadingUnit = computed(() => {
  if (!props.latestReading) return '';
  return props.device.deviceType === 'HUMIDITY_SENSOR' ? '% RH' : props.latestReading.unit;
});

const statusSeverity = computed(() => {
  const severities = {
    'ACTIVE': 'success',
    'OFFLINE': 'secondary',
    'MAINTENANCE': 'warn',
    'BATTERY_LOW': 'danger'
  };
  return severities[props.device.status] || 'info';
});
</script>

<style scoped>
.device-card-horizontal {
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 20px;
  padding: 1.5rem 2rem;
  color: #e0ead0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;
}

.device-card-horizontal:hover {
  transform: scale(1.01);
  border-color: #c9e265;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.card-content-left {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex: 1;
}

.type-icon-box {
  width: 54px;
  height: 54px;
  background: #2a3d2e;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #c9e265;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #6b8a6b;
  letter-spacing: 0.1em;
}

.value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #e0ead0;
}

.type-val {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #8fba8f;
}
.mini-icon { font-size: 0.75rem; }

.highlight-metric {
  color: #c9e265 !important;
  font-size: 1.25rem !important;
}

.card-content-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.status-tag {
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  padding: 0.25rem 0.75rem !important;
  border-radius: 8px !important;
}

.calibrate-action-btn {
  background: #c9e265 !important;
  color: #1a3020 !important;
  border: none !important;
  font-weight: 900 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(201, 226, 101, 0.3) !important;
}

.calibrate-action-btn:hover {
  background: #d7ec6e !important;
  transform: translateY(-2px);
}

@media (max-width: 1100px) {
  .card-content-left { gap: 1.5rem; }
  .device-card-horizontal { padding: 1rem; flex-wrap: wrap; }
  .card-content-right { width: 100%; justify-content: flex-end; margin-top: 1rem; }
}
</style>
