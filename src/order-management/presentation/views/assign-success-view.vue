<template>
<div class="success-wrapper">
    <button class="back-btn-corner" @click="goBack" title="Volver al Paso 2"><i class="pi pi-arrow-left"></i></button>

    <!-- Stepper -->
    <div class="stepper-container">
      <div class="step completed">
        <div class="step-circle"><i class="pi pi-check"></i></div>
        <span class="step-label">Seleccionar Productor</span>
      </div>
      <div class="step-line completed-line"></div>
      <div class="step completed">
        <div class="step-circle"><i class="pi pi-check"></i></div>
        <span class="step-label">Asignar Flota</span>
      </div>
      <div class="step-line completed-line"></div>
      <div class="step active">
        <div class="step-circle">3</div>
        <span class="step-label">Confirmar</span>
      </div>
    </div>

    <!-- Central Success State -->
    <div class="success-content">
      <div class="glow-icon">
        <i class="pi pi-check"></i>
      </div>
      
      <h1 class="success-title">¡Asignación Exitosa!</h1>
      
      <p class="success-subtitle">
        El productor <strong>{{ producerName }}</strong> y el camión <strong>{{ vehicleName }}</strong> 
        han sido asignados y despachados para el pedido <strong>{{ order?.id || 'PED-089' }}</strong>.
      </p>

      <button class="return-btn" @click="confirmAndActivate">
        Confirmar y Asignar Pedido <i class="pi pi-send"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderManagementStore } from '../../application/order-management.store.js';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderManagementStore();

const order = computed(() => {
  const id = route.params.id;
  return orderStore.orders.find(o => o.id === id || String(o.id) === String(id)) || null;
});

onMounted(async () => {
  if (!orderStore.ordersLoaded) {
    await orderStore.fetchOrders();
  }
});

// Read from wizard state (set in Step 1 & 2)
const producerName = computed(() => orderStore.wizardProducer?.name || 'Productor');
const vehicleName = computed(() => orderStore.wizardVehicle || 'ABC-123');
const driverName = computed(() => orderStore.wizardDriver || 'Conductor');

function goBack() {
  if (order.value?.id) {
    router.push({ name: 'assign-fleet', params: { id: order.value.id } });
  }
}

function confirmAndActivate() {
  // Capture the order ID before any mutations
  const orderId = order.value?.id;
  if (!orderId) {
    router.push({ name: 'order-list' });
    return;
  }

  // Synchronous local state update (no await, no network dependency)
  const success = orderStore.assignOrder(orderId, {
    producerId: Number(orderStore.wizardProducer?.id) || 1,
    producer: producerName.value,
    driver: driverName.value,
    vehicle: vehicleName.value,
    status: 'En Ruta',
    statusClass: 'status-transit'
  });

  console.log('[Step 3] assignOrder result:', success, 'navigating to order-detail with id:', orderId);

  // Clear wizard state
  orderStore.clearWizard();

  // Navigate immediately — no network call blocking this
  router.push({ name: 'order-detail', params: { id: orderId } });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.success-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.back-btn-corner {
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  background: transparent;
  border: none;
  color: #1a3020;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  font-size: 1.25rem;
  padding: 0.5rem;
}
.back-btn-corner:hover {
  color: #4a6b4a;
  transform: scale(1.05);
}

/* ── Stepper ── */
.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  padding: 1.5rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2a3d2e;
  color: #8fba8f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.step.completed .step-circle {
  background: rgba(201, 226, 101, 0.15);
  color: #c9e265;
}
.step.active .step-circle {
  background: #c9e265;
  color: #122216;
}
.step-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #8fba8f;
}
.step.active .step-label,
.step.completed .step-label {
  color: #e0ead0;
}
.step-line {
  flex: 1;
  height: 2px;
  background: #2a3d2e;
  margin: 0 1rem;
  transform: translateY(-10px);
}
.step-line.completed-line {
  background: #c9e265;
}

/* ── Central Success State ── */
.success-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 20px;
  padding: 3rem 1.5rem;
  max-width: 650px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-height: 500px;
}

.glow-icon {
  width: 80px;
  height: 80px;
  background: rgba(201, 226, 101, 0.15);
  border: 2px solid #c9e265;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 30px rgba(201, 226, 101, 0.4), inset 0 0 15px rgba(201, 226, 101, 0.2);
  animation: float 3s ease-in-out infinite;
}
.glow-icon i {
  font-size: 2.2rem;
  color: #c9e265;
  text-shadow: 0 0 10px rgba(201, 226, 101, 0.5);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); box-shadow: 0 0 40px rgba(201, 226, 101, 0.6), inset 0 0 25px rgba(201, 226, 101, 0.3); }
  100% { transform: translateY(0px); }
}

.success-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
}

.success-subtitle {
  font-size: 1.05rem;
  color: #a3b8a0;
  max-width: 480px;
  line-height: 1.5;
  margin: 0 0 2rem 0;
}
.success-subtitle strong {
  color: #e0ead0;
}

.return-btn {
  padding: 1.1rem 2.5rem;
  border-radius: 12px;
  background: #c9e265;
  color: #122216;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.return-btn:hover {
  background: #d6ec6e;
  box-shadow: 0 0 20px rgba(201, 226, 101, 0.4);
  transform: translateY(-2px);
}
</style>
