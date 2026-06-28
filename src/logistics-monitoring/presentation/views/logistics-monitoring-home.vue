<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header-section">
      <div class="title-area">
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span class="sep">></span>
          <span class="active">Logística y Seguimiento</span>
        </nav>
        <h1 class="page-title">Rastreo de Pedidos</h1>
        <p class="page-subtitle">Ingresa el código de tu pedido para conocer su estado actual en tiempo real.</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-card">
        <div class="search-header">
          <i class="pi pi-search-plus" />
          <span>CONSULTA DE RASTREO</span>
        </div>
        <div class="search-body">
          <div class="input-wrap">
            <pv-input-text
                v-model="trackingId"
                placeholder="Ej: #ORD-2024-001"
                class="tracking-input"
                :class="{ 'p-invalid': errorMsg }"
                @keyup.enter="handleSearch"
            />
            <button class="track-btn" @click="handleSearch" :disabled="isLoading">
              <i v-if="isLoading" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-map-marker" />
              RASTREAR
            </button>
          </div>
          <small v-if="errorMsg" class="error-msg">
            <i class="pi pi-exclamation-circle" /> {{ errorMsg }}
          </small>
        </div>
      </div>
    </div>

    <!-- Tracking Result -->
    <div v-if="foundOrder" class="result-section">
      <div class="result-header">
        <div class="order-id-badge">PEDIDO {{ foundOrder.id }}</div>
        <div class="status-indicator" :class="statusClass">
          <span class="dot" /> {{ foundOrder.status }}
        </div>
      </div>

      <div class="tracking-grid">
        <!-- Visual Timeline -->
        <div class="timeline-card">
          <div class="card-label">FLUJO LOGÍSTICO</div>
          
          <div class="timeline">
            <div v-for="(step, i) in timelineSteps" :key="i" class="timeline-item" :class="{ active: currentStep >= i + 1 }">
              <div class="step-marker">
                <i :class="step.icon" />
              </div>
              <div class="step-content">
                <span class="step-title">{{ step.label }}</span>
                <span class="step-desc">{{ currentStep >= i + 1 ? 'Completado' : 'Pendiente' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="info-card">
          <div class="card-label">DETALLES DEL ENVÍO</div>
          <div class="info-row">
            <span class="info-label">Cliente</span>
            <span class="info-value">{{ foundOrder.clientName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Carga</span>
            <span class="info-value">{{ foundOrder.quantity }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Origen</span>
            <span class="info-value">{{ foundOrder.producer || 'Productor Local' }}</span>
          </div>
          <hr class="divider" />
          <div class="map-preview">
            <img src="https://media.bikemap.net/routes/14746781/staticmaps/in_1cd954e7-41bf-4700-bc04-397435420426_694x400_bikemap-2021-3D-static.png" alt="Mapa" />
            <div class="map-overlay">
              <span>MAPA DE RUTA ACTIVO</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty/Welcome state if no search -->
    <div v-else-if="!errorMsg" class="welcome-section">
      <div class="welcome-illustration">
        <i class="pi pi-truck" />
      </div>
      <p>Introduce un ID de pedido válido para visualizar su estado logístico.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderManagementStore } from '../../../order-management/application/order-management.store.js';

const store = useOrderManagementStore();

const trackingId = ref('');
const foundOrder = ref(null);
const errorMsg   = ref('');
const isLoading  = ref(false);

const timelineSteps = [
  { label: 'Registrado', icon: 'pi pi-file-edit' },
  { label: 'En Preparación', icon: 'pi pi-box' },
  { label: 'En Camino', icon: 'pi pi-truck' },
  { label: 'Entregado', icon: 'pi pi-check-circle' }
];

const currentStep = computed(() => {
  if (!foundOrder.value) return 0;
  const s = foundOrder.value.status.toLowerCase();
  if (s.includes('entregado')) return 4;
  if (s.includes('camino'))    return 3;
  if (s.includes('retrasado') || s.includes('preparación') || s.includes('asignado')) return 2;
  return 1;
});

const statusClass = computed(() => {
  if (!foundOrder.value) return '';
  const s = foundOrder.value.status.toLowerCase();
  if (s.includes('entregado')) return 'status-delivered';
  if (s.includes('camino'))    return 'status-transit';
  if (s.includes('retrasado')) return 'status-delayed';
  return 'status-pending';
});

async function handleSearch() {
  const id = trackingId.value.trim();
  if (!id) {
    errorMsg.value = 'Por favor, ingresa un ID de pedido.';
    foundOrder.value = null;
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    if (!store.ordersLoaded) {
      await store.fetchOrders();
    }
    
    // US013TASK23 - ID invalida: Validación de códigos de pedido inexistentes
    const order = store.getOrderById(id);
    
    if (order) {
      foundOrder.value = order;
      errorMsg.value = '';
    } else {
      foundOrder.value = null;
      errorMsg.value = 'El código de pedido no existe o es inválido. Por favor, verifícalo e intenta nuevamente.';
    }
  } catch (e) {
    errorMsg.value = 'Ocurrió un error al consultar el pedido.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ── Header ─────────────────────────────────── */
.breadcrumb {
  font-size: 0.72rem;
  color: #6b7a6b;
  margin-bottom: 0.6rem;
  display: flex; gap: 0.3rem; align-items: center;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.breadcrumb .sep    { color: #a3b8a0; }
.breadcrumb .active { color: #1a3020; font-weight: 700; }

.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.35rem;
  letter-spacing: -0.02em;
}
.page-subtitle {
  font-size: 0.88rem;
  color: #4a6b4a;
  margin: 0 0 2rem;
}

/* ── Search Section ─────────────────────────── */
.search-section {
  max-width: 700px;
  margin-bottom: 2rem;
}
.search-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}
.search-header {
  font-size: 0.7rem;
  font-weight: 800;
  color: #c9e265;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.search-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.input-wrap {
  display: flex;
  gap: 0.75rem;
}
.tracking-input {
  flex: 1;
  background: #2a3d2e !important;
  border: 1.5px solid #3d5c42 !important;
  color: #e0ead0 !important;
  border-radius: 10px !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.95rem !important;
}
.tracking-input::placeholder { color: #5d7a5d !important; }

.track-btn {
  background: #c9e265;
  color: #1a3020;
  border: none;
  border-radius: 10px;
  padding: 0 1.5rem;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}
.track-btn:hover { background: #d6ec6e; transform: translateY(-1px); }
.track-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.error-msg {
  color: #f87171;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-left: 0.25rem;
}

/* ── Result Section ─────────────────────────── */
.result-section {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.order-id-badge {
  background: #1e2d22;
  color: #e0ead0;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
}
.dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.status-delivered { color: #1bb37e; }
.status-transit   { color: #e5b95e; }
.status-delayed   { color: #f87171; }
.status-pending   { color: #9ab39d; }

.tracking-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
}

.timeline-card, .info-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}

.card-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #8fba8f;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  padding-left: 1rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 1.75rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 2px;
  background: #2a3d2e;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.step-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2a3d2e;
  color: #4a6b4a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s;
  border: 2px solid #1e2d22;
}

.timeline-item.active .step-marker {
  background: #c9e265;
  color: #1a3020;
  box-shadow: 0 0 15px rgba(201, 226, 101, 0.3);
}

.step-content {
  display: flex;
  flex-direction: column;
}
.step-title {
  font-weight: 700;
  color: #6b8a6b;
  font-size: 0.95rem;
}
.timeline-item.active .step-title { color: #e0ead0; }
.step-desc {
  font-size: 0.75rem;
  color: #4a6b4a;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.info-label { color: #6b8a6b; font-size: 0.85rem; }
.info-value { color: #e0ead0; font-weight: 600; font-size: 0.85rem; }

.divider { border: none; border-top: 1px solid #2a3d2e; margin: 1.25rem 0; }

.map-preview {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  height: 140px;
}
.map-preview img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.map-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 45, 34, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-overlay span {
  font-size: 0.6rem;
  font-weight: 800;
  color: #c9e265;
  letter-spacing: 0.1em;
  padding: 0.4rem 0.75rem;
  background: rgba(30, 45, 34, 0.8);
  border-radius: 4px;
}

/* ── Welcome Section ────────────────────────── */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  color: #8fba8f;
  text-align: center;
}
.welcome-illustration {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #1e2d22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #3d5c42;
  margin-bottom: 1.5rem;
}
.welcome-section p { max-width: 320px; font-size: 0.9rem; line-height: 1.5; }

@media (max-width: 900px) {
  .tracking-grid { grid-template-columns: 1fr; }
}
</style>
