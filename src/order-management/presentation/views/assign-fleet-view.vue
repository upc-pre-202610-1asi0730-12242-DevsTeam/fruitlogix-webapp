<template>
  <div class="assign-wrapper">
    <!-- Breadcrumb with Back Button -->
    <div class="breadcrumb-bar">
      <button class="back-btn" @click="goBack" title="Volver al Paso 1"><i class="pi pi-arrow-left"></i></button>
      <div class="breadcrumb">
        <span class="crumb-link" @click="goHome">Pedidos</span>
        <i class="pi pi-angle-right"></i>
        <span class="crumb-link" @click="goToDetail">{{ order?.id || 'PED-000' }}</span>
        <i class="pi pi-angle-right"></i>
        <span class="crumb-current">Asignar Flota</span>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper-container">
      <div class="step completed">
        <div class="step-circle"><i class="pi pi-check"></i></div>
        <span class="step-label">Seleccionar Productor</span>
      </div>
      <div class="step-line completed-line"></div>
      <div class="step active">
        <div class="step-circle">2</div>
        <span class="step-label">Asignar Flota</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-circle">3</div>
        <span class="step-label">Confirmar</span>
      </div>
    </div>

    <h1 class="page-title">Asignación de Flota</h1>

    <div class="content-layout">
      <div class="main-column">
        <!-- Header Box -->
        <div class="info-card header-box">
          <div class="header-box-left">
            <span class="header-box-label">ASIGNANDO PARA</span>
            <h2 class="header-box-title">{{ order?.id || 'PED-089' }} <span class="header-box-desc">— Mango, Plátano, Naranja</span></h2>
          </div>
          <div class="header-box-right">
            <div class="header-box-stat">
              <span class="stat-label">Volumen</span>
              <span class="stat-value">480 kg</span>
            </div>
            <div class="header-box-stat">
              <span class="stat-label">Entrega</span>
              <span class="stat-value accent">Mar 15, 8:00 AM</span>
            </div>
          </div>
        </div>

        <!-- Fleet Selection Grid -->
        <div class="fleet-grid">
          <!-- Vehicle Card -->
          <div class="info-card fleet-card">
            <div class="fleet-card-top">
              <div class="fleet-card-info">
                <div class="fleet-icon-wrap">
                  <i class="pi pi-truck"></i>
                </div>
                <div>
                  <h3 class="fleet-title">ABC-123</h3>
                  <p class="fleet-sub">Camión Refrigerado</p>
                </div>
              </div>
              <div class="fleet-actions">
                <button class="ghost-btn"><i class="pi pi-pencil"></i> Cambiar</button>
                <span class="status-badge available">Disponible</span>
              </div>
            </div>
            <div class="fleet-card-bottom">
              <div class="fleet-meta">
                <span class="meta-label">Capacidad</span>
                <span class="meta-value">2,000 kg max</span>
              </div>
              <div class="fleet-meta">
                <span class="meta-label">Telemetría (IoT)</span>
                <span class="meta-value iot-active"><span class="dot"></span> 5°C · Ref. Activa</span>
              </div>
            </div>
          </div>

          <!-- Driver Card -->
          <div class="info-card fleet-card">
            <div class="fleet-card-top">
              <div class="fleet-card-info">
                <div class="driver-avatar">
                  <img src="https://ui-avatars.com/api/?name=Carlos+Avila&background=1e2d22&color=c9e265&rounded=true" alt="Carlos Ávila" />
                </div>
                <div>
                  <h3 class="fleet-title">Carlos Ávila</h3>
                  <p class="fleet-sub">Licencia: A-IIb</p>
                </div>
              </div>
              <div class="fleet-actions">
                <button class="ghost-btn"><i class="pi pi-pencil"></i> Cambiar</button>
                <span class="status-badge available">Disponible</span>
              </div>
            </div>
            <div class="fleet-card-bottom">
              <div class="fleet-meta">
                <span class="meta-label">Calificación</span>
                <span class="meta-value rating">4.9 <i class="pi pi-star-fill"></i></span>
              </div>
              <div class="fleet-meta">
                <span class="meta-label">Horas de Turno</span>
                <span class="meta-value">2h restantes (ok)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Route Estimation Card -->
        <div class="info-card route-card">
          <div class="route-map-placeholder">
            <i class="pi pi-map-marker map-icon"></i>
            <button class="map-btn">Ver Mapa Ruta</button>
          </div>
          <div class="route-details">
            <div class="route-header">
              <h3 class="route-title"><i class="pi pi-directions"></i> Ruta Estimada</h3>
              <span class="route-type">Vía Rápida Sur</span>
            </div>
            <div class="route-stats">
              <div class="r-stat">
                <span class="meta-label">Distancia</span>
                <span class="r-value">67 km</span>
              </div>
              <div class="r-stat">
                <span class="meta-label">ETA (Tiempo Est.)</span>
                <span class="r-value">1h 45min</span>
              </div>
              <div class="r-stat">
                <span class="meta-label">Tráfico</span>
                <span class="r-value traffic-ok">Fluido</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="side-column">
        <!-- Confirmation Box -->
        <div class="info-card confirm-box">
      <h3 class="confirm-title">Resumen de Asignación</h3>
      <div class="confirm-list">
        <div class="confirm-item">
          <i class="pi pi-check-circle check-icon"></i>
          <span class="c-label">Productor:</span>
          <span class="c-value">{{ wizardProducerName }}</span>
        </div>
        <div class="confirm-item">
          <i class="pi pi-check-circle check-icon"></i>
          <span class="c-label">Vehículo:</span>
          <span class="c-value">{{ orderStore.wizardVehicle }} (Camión Refrigerado)</span>
        </div>
        <div class="confirm-item">
          <i class="pi pi-check-circle check-icon"></i>
          <span class="c-label">Conductor:</span>
          <span class="c-value">{{ orderStore.wizardDriver }}</span>
        </div>
        <div class="confirm-item">
          <i class="pi pi-check-circle check-icon"></i>
          <span class="c-label">Ruta:</span>
          <span class="c-value">67km (ETA: 1h 45min)</span>
        </div>
      </div>

          <button class="confirm-submit-btn" @click="nextStep">
            Siguiente
          </button>
        </div>
      </div>
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

function goHome() {
  router.push({ name: 'order-list' });
}

function goToDetail() {
  if (order.value?.id) {
    router.push({ name: 'order-detail', params: { id: order.value.id } });
  } else {
    goHome();
  }
}

function goBack() {
  if (order.value?.id) {
    router.push({ name: 'assign-producer', params: { id: order.value.id } });
  } else {
    goToDetail();
  }
}

const wizardProducerName = computed(() => {
  const p = orderStore.wizardProducer;
  if (p?.name) {
    const fruits = p.stock?.map(s => s.name).join(', ');
    return fruits ? `${p.name} (${fruits})` : p.name;
  }
  return 'Sin seleccionar';
});

async function nextStep() {
  if (order.value?.id) {
    router.push({ name: 'assign-success', params: { id: order.value.id } });
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.assign-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ── Breadcrumb & Back ── */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.back-btn {
  background: transparent;
  border: none;
  color: #1a3020;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;
  padding: 0.5rem;
}
.back-btn:hover {
  color: #4a6b4a;
  transform: scale(1.05);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b8a6b;
}
.crumb-link {
  cursor: pointer;
  transition: color 0.15s;
}
.crumb-link:hover {
  color: #1a3020;
}
.breadcrumb i {
  font-size: 0.7rem;
}
.crumb-current {
  color: #1a3020;
  font-weight: 800;
}

/* ── Stepper ── */
.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
  background: #1e2d22; /* Matches the dark theme card */
  border: 1px solid #2a3d2e;
  padding: 1.5rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
.step.active .step-label {
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

.page-title {
  font-size: 2rem;
  font-weight: 900;
  color: #1a3020;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.03em;
}

/* ── Layout ── */
.content-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}
.main-column {
  flex: 1;
  min-width: 0;
}
.side-column {
  width: 380px;
  flex-shrink: 0;
}

/* ── Base Card ── */
.info-card {
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  color: #e0ead0;
}

/* ── Header Box ── */
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-left: 4px solid #c9e265;
}
.header-box-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #8fba8f;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.header-box-title {
  margin: 0.3rem 0 0 0;
  font-size: 1.25rem;
  font-weight: 800;
}
.header-box-desc {
  font-weight: 500;
  color: #a3b8a0;
}
.header-box-right {
  display: flex;
  gap: 2.5rem;
}
.header-box-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}
.stat-label {
  font-size: 0.7rem;
  color: #6b8a6b;
  font-weight: 600;
}
.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
}
.stat-value.accent {
  color: #c9e265;
}

/* ── Fleet Grid ── */
.fleet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.fleet-card {
  padding: 1.5rem;
  margin-bottom: 0;
}
.fleet-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.fleet-card-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.fleet-icon-wrap {
  width: 48px;
  height: 48px;
  background: rgba(201, 226, 101, 0.1);
  border: 1px solid rgba(201, 226, 101, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #c9e265;
}
.driver-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #2a3d2e;
}
.fleet-title {
  margin: 0 0 0.2rem 0;
  font-size: 1.15rem;
  font-weight: 800;
}
.fleet-sub {
  margin: 0;
  font-size: 0.85rem;
  color: #8fba8f;
}
.fleet-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.ghost-btn {
  background: #2a3d2e;
  border: none;
  color: #e0ead0;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.15s;
}
.ghost-btn:hover {
  background: #3d5c42;
}
.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
}
.status-badge.available {
  background: rgba(201, 226, 101, 0.15);
  color: #c9e265;
  border: 1px solid rgba(201, 226, 101, 0.3);
}

.fleet-card-bottom {
  display: flex;
  background: #1a2a1e;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #2a3d2e;
}
.fleet-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.meta-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b8a6b;
}
.meta-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e0ead0;
}
.meta-value.iot-active {
  color: #c9e265;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.meta-value.rating {
  color: #e5b95e;
}
.dot {
  width: 6px;
  height: 6px;
  background: #c9e265;
  border-radius: 50%;
  box-shadow: 0 0 5px #c9e265;
}

/* ── Route Card ── */
.route-card {
  display: flex;
  padding: 0;
  overflow: hidden;
  align-items: stretch;
}
.route-map-placeholder {
  width: 280px;
  background: #0c1f15;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #2a3d2e;
}
.map-icon {
  font-size: 2.5rem;
  color: #3d5c42;
  margin-bottom: 1rem;
}
.map-btn {
  background: #1e2d22;
  border: 1px solid #3d5c42;
  color: #c9e265;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.map-btn:hover {
  background: #2a3d2e;
}
.route-details {
  padding: 1.5rem 2rem;
  flex: 1;
}
.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.route-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.route-type {
  font-size: 0.8rem;
  font-weight: 600;
  color: #8fba8f;
}
.route-stats {
  display: flex;
  gap: 3rem;
}
.r-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.r-value {
  font-size: 1.4rem;
  font-weight: 800;
}
.traffic-ok {
  color: #c9e265;
}

/* ── Confirm Box ── */
.confirm-box {
  background: #1e2d22; /* Changed to dark mode card styling */
  color: #e0ead0;
  padding: 2rem;
  margin-bottom: 0;
}
.confirm-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  color: #ffffff;
}
.confirm-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.confirm-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
}
.check-icon {
  color: #c9e265;
  font-size: 1.25rem;
}
.c-label {
  width: 100px;
  color: #6b8a6b;
  font-weight: 600;
}
.c-value {
  font-weight: 700;
}
.confirm-submit-btn {
  width: 100%;
  padding: 1.1rem;
  background: #c9e265;
  color: #122216;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 900;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.15s, transform 0.1s;
}
.confirm-submit-btn:hover {
  background: #d6ec6e;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
  }
  .side-column {
    width: 100%;
  }
}
@media (max-width: 900px) {
  .fleet-grid {
    grid-template-columns: 1fr;
  }
  .route-card {
    flex-direction: column;
  }
  .route-map-placeholder {
    width: 100%;
    height: 150px;
    border-right: none;
    border-bottom: 1px solid #2a3d2e;
  }
  .header-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}
</style>
