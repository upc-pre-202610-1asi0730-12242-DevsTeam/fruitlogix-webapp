<template>
  <span :class="['status-badge', statusClass]">{{ formattedStatus }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true }
});

const statusClass = computed(() => {
  const map = {
    'PENDIENTE_PAGO': 'badge-warning',
    'CONFIRMADO': 'badge-info',
    'EN_PRODUCCION': 'badge-info',
    'EN_DISTRIBUCION': 'badge-info',
    'EN_RUTA': 'badge-active',
    'ENTREGADO': 'badge-success',
    'VENCIDA': 'badge-danger',
    'PENDIENTE': 'badge-warning',
    'PAGADA': 'badge-success'
  };
  return map[props.status] || 'badge-default';
});

const formattedStatus = computed(() => {
  // Replace underscores with spaces and format
  return props.status.replace(/_/g, ' ');
});
</script>

<style scoped>
.status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.badge-warning {
  background: rgba(255, 152, 0, 0.15);
  color: #f57c00;
}
.badge-info {
  background: rgba(33, 150, 243, 0.15);
  color: #1976d2;
}
.badge-active {
  background: rgba(215, 236, 110, 0.3);
  color: #5a7a10;
}
.badge-success {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}
.badge-danger {
  background: rgba(244, 67, 54, 0.15);
  color: #d32f2f;
}
.badge-default {
  background: #f0f0f0;
  color: #666;
}
</style>
