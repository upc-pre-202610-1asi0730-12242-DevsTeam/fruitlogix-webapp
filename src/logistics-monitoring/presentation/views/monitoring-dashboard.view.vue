<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header-section">
      <div class="title-area">
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span class="sep">></span>
          <span class="active">Logística y Monitoreo</span>
        </nav>
        <h1 class="page-title">Monitoreo de Envíos</h1>
        <p class="page-subtitle">Seguimiento en tiempo real de la flota y condiciones de carga.</p>
      </div>

      <div class="header-stats">
        <div class="stat-box">
          <span class="stat-label">EN RUTA</span>
          <span class="stat-value">{{ store.activeDeliveriesCount }}</span>
        </div>
        <div class="stat-box alert">
          <span class="stat-label">RETRASOS</span>
          <span class="stat-value">2</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- Left Panel: Cards -->
      <section class="cards-panel">
        <div class="panel-header">
          <h2 class="panel-title">DESPACHOS ACTIVOS</h2>
          <div class="filter-btns">
            <button class="filter-btn active">TODOS</button>
            <button class="filter-btn">RETRASADOS</button>
          </div>
        </div>

        <div v-if="store.isLoading" class="loading-state">
          <i class="pi pi-spin pi-spinner"/>
          <p>Cargando información logística...</p>
        </div>

        <div v-else class="cards-grid">
          <delivery-card
              v-for="delivery in store.deliveries"
              :key="delivery.deliveryId"
              :delivery="delivery"
              @start="handleStart"
              @delay="handleDelay"
          />
        </div>

        <!-- Empty state -->
        <div v-if="!store.isLoading && !store.deliveries.length" class="empty-state">
          <i class="pi pi-truck empty-icon"/>
          <p>No hay despachos activos en este momento.</p>
        </div>
      </section>

      <!-- Right Panel: Map & Real-time Info -->
      <aside class="monitoring-panel">
        <div class="map-container">
          <div class="map-overlay-header">
            <i class="pi pi-map-marker"/>
            <span>FLOTA EN TIEMPO REAL</span>
          </div>
          <!-- Mock Map -->
          <img
              src="https://media.bikemap.net/routes/14746781/staticmaps/in_1cd954e7-41bf-4700-bc04-397435420426_694x400_bikemap-2021-3D-static.png"
              alt="Live Fleet Map"
              class="live-map"
          />
          <div class="map-markers">
            <div class="map-pin truck" style="top: 30%; left: 40%;">#ORD-001</div>
            <div class="map-pin truck delayed" style="top: 60%; left: 55%;">#ORD-002</div>
          </div>
        </div>

        <div class="telemetry-panel">
          <h3 class="panel-subtitle">ALERTAS RECIENTES</h3>
          <div class="alerts-list">
            <div class="alert-item quality">
              <div class="alert-icon"><i class="pi pi-exclamation-triangle"/></div>
              <div class="alert-content">
                <span class="alert-title">ALERTA DE TEMPERATURA</span>
                <span class="alert-desc">Pedido #ORD-001 superó los 5.0°C en Lince.</span>
                <span class="alert-time">Hace 5 min</span>
              </div>
            </div>
            <div class="alert-item delay">
              <div class="alert-icon"><i class="pi pi-clock"/></div>
              <div class="alert-content">
                <span class="alert-title">RETRASO DETECTADO</span>
                <span class="alert-desc">Pedido #ORD-002 detenido en Tráfico Intenso.</span>
                <span class="alert-time">Hace 12 min</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Delay Modal (PrimeVue) -->
    <pv-dialog v-model:visible="showDelayDialog" header="Reportar Retraso" modal :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="reason">Motivo del Retraso</label>
          <pv-input-text id="reason" v-model="delayReason" placeholder="Ej: Tráfico, Avería..." />
        </div>
      </div>
      <template #footer>
        <pv-button label="CANCELAR" icon="pi pi-times" class="p-button-text" @click="showDelayDialog = false" />
        <pv-button label="CONFIRMAR" icon="pi pi-check" @click="confirmDelay" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLogisticsMonitoringStore } from '../../application/logistics-monitoring.store.js';
import DeliveryCard from '../components/delivery-card.vue';

const store = useLogisticsMonitoringStore();

const showDelayDialog = ref(false);
const delayReason    = ref('');
const selectedDeliveryId = ref(null);

onMounted(() => {
  store.fetchDeliveries();
});

function handleStart(id) {
  store.startDelivery(id);
}

function handleDelay(id) {
  selectedDeliveryId.value = id;
  showDelayDialog.value = true;
}

function confirmDelay() {
  if (selectedDeliveryId.value && delayReason.value) {
    store.reportDelay(selectedDeliveryId.value, delayReason.value);
    showDelayDialog.value = false;
    delayReason.value = '';
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


.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

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
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-box {
  background: #1e2d22;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  border: 1px solid #2a3d2e;
}
.stat-box.alert { border-color: rgba(248, 113, 113, 0.3); }
.stat-label { font-size: 0.6rem; font-weight: 800; color: #c9e265; letter-spacing: 0.1em; }
.stat-box.alert .stat-label { color: #fca5a5; }
.stat-value { font-size: 1.8rem; font-weight: 900; color: #e5ecd8; }


.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}


.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-title {
  font-size: 0.75rem;
  font-weight: 900;
  color: #1a3020;
  letter-spacing: 0.12em;
  margin: 0;
}

.filter-btns {
  display: flex;
  background: rgba(30, 45, 34, 0.05);
  padding: 4px;
  border-radius: 10px;
}
.filter-btn {
  border: none;
  background: transparent;
  padding: 0.4rem 1rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #6b8a6b;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.filter-btn.active {
  background: #1e2d22;
  color: #c9e265;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  color: #6b8a6b;
}
.loading-state i { font-size: 2rem; margin-bottom: 1rem; color: #c9e265; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.2; }


.monitoring-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 1.5rem;
}

.map-container {
  height: 400px;
  background: #1e2d22;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid #2a3d2e;
}

.map-overlay-header {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: rgba(30, 45, 34, 0.85);
  backdrop-filter: blur(8px);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #c9e265;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  z-index: 5;
  border: 1px solid rgba(201, 226, 101, 0.2);
}

.live-map {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.map-pin {
  position: absolute;
  background: #c9e265;
  color: #1a3020;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 6;
}
.map-pin.delayed { background: #f87171; color: white; }

.telemetry-panel {
  background: #1e2d22;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}

.panel-subtitle {
  font-size: 0.65rem;
  font-weight: 800;
  color: #8fba8f;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
}

.alerts-list { display: flex; flex-direction: column; gap: 0.75rem; }

.alert-item {
  display: flex;
  gap: 1rem;
  background: #2a3d2e;
  padding: 0.85rem;
  border-radius: 12px;
  border-left: 4px solid transparent;
}
.alert-item.quality { border-left-color: #f87171; }
.alert-item.delay   { border-left-color: #fbbf24; }

.alert-icon { font-size: 1rem; margin-top: 0.2rem; }
.alert-item.quality .alert-icon { color: #f87171; }
.alert-item.delay   .alert-icon { color: #fbbf24; }

.alert-content { display: flex; flex-direction: column; gap: 0.1rem; }
.alert-title { font-size: 0.7rem; font-weight: 800; color: #e0ead0; }
.alert-desc  { font-size: 0.75rem; color: #8fba8f; line-height: 1.4; }
.alert-time  { font-size: 0.6rem; color: #4a6b4a; margin-top: 0.25rem; }

@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .monitoring-panel { position: static; }
}
</style>
