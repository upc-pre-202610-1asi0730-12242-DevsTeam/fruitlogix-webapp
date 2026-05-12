<template>
  <div class="page-wrapper" v-if="delivery">
    <!-- Header Area -->
    <header class="tracking-header">
      <div class="header-left">
        <pv-button icon="pi pi-arrow-left" class="back-btn" @click="router.back()" />
        <div class="title-wrap">
          <span class="context-label">DELIVERY TRACKING</span>
          <h1 class="order-title">Order {{ delivery.orderId }}</h1>
        </div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <span class="dot pulse"></span>
          <span>Sensors Active</span>
        </div>
      </div>
    </header>

    <div class="details-grid">
      <!-- Left Column -->
      <aside class="side-panel">
        <!-- Driver Card -->
        <div class="card driver-card">
          <div class="card-header-mini">
            <i class="pi pi-user" />
            <span>ASSIGNED DRIVER</span>
          </div>
          <div class="driver-profile">
            <div class="driver-avatar-wrap">
              <img src="https://ui-avatars.com/api/?name=Carlos+Mendez&background=c9e265&color=1a3020&size=100&bold=true" alt="Driver" class="driver-avatar" />
              <div class="rating-badge">
                <i class="pi pi-star-fill" /> 4.9
              </div>
            </div>
            <div class="driver-info">
              <h3>{{ delivery.assignedDriver }}</h3>
              <span class="phone-link"><i class="pi pi-phone" /> +1 (555) 019-2831</span>
            </div>
          </div>
          <pv-button label="Message Driver" icon="pi pi-comment" class="msg-btn" />
        </div>

        <!-- Vehicle Details Card -->
        <div class="card vehicle-card">
          <div class="card-header-mini">
            <i class="pi pi-truck" />
            <span>VEHICLE DETAILS</span>
          </div>
          <div class="vehicle-info-grid">
            <div class="info-box">
              <span class="box-label">PLATE NUMBER</span>
              <span class="box-value">{{ delivery.vehiclePlate }}</span>
            </div>
            <div class="info-box">
              <span class="box-label">VEHICLE TYPE</span>
              <span class="box-value">Refrigerated 18T</span>
            </div>
          </div>
        </div>

        <!-- Cargo Manifest Card -->
        <div class="card manifest-card">
          <div class="card-header-mini">
            <i class="pi pi-list" />
            <span>CARGO MANIFEST</span>
          </div>
          <div class="manifest-list">
            <div class="manifest-item">
              <div class="item-left">
                <i class="pi pi-apple icon-fruit" />
                <span>Gala Apples (Premium)</span>
              </div>
              <span class="item-qty">2,400 kg</span>
            </div>
            <div class="manifest-item">
              <div class="item-left">
                <i class="pi pi-shopping-bag icon-fruit" />
                <span>Table Grapes</span>
              </div>
              <span class="item-qty">1,150 kg</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column -->
      <main class="main-content">
        <!-- Sensor Row -->
        <div class="sensor-row">
          <!-- Temp Card -->
          <div class="card sensor-card temp">
            <div class="card-header-mini">
              <div class="label-with-icon">
                <i class="pi pi-thermometer" />
                <span>Internal Temperature</span>
              </div>
              <span class="sensor-status green">Stable</span>
            </div>
            <div class="sensor-main">
              <div class="sensor-value">4.2<span class="unit">°C</span></div>
              <div class="sparkline">
                <svg viewBox="0 0 100 30" class="spark-svg">
                  <path d="M0,25 Q10,15 20,20 T40,18 T60,22 T80,15 T100,20" class="spark-path temp-path" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Humidity Card -->
          <div class="card sensor-card hum">
            <div class="card-header-mini">
              <div class="label-with-icon">
                <i class="pi pi-cloud" />
                <span>Relative Humidity</span>
              </div>
              <span class="sensor-status yellow"><i class="pi pi-arrow-down" /> -2%</span>
            </div>
            <div class="sensor-main">
              <div class="sensor-value">85<span class="unit">%</span></div>
              <div class="sparkline">
                <svg viewBox="0 0 100 30" class="spark-svg">
                  <path d="M0,20 Q20,25 40,15 T60,20 T80,22 T100,10" class="spark-path hum-path" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Telemetry Card -->
        <div class="card telemetry-card">
          <div class="card-header-mini">
            <i class="pi pi-map" />
            <span>ACTIVE ROUTE TELEMETRY</span>
          </div>

          <!-- Progress Stepper -->
          <div class="route-stepper">
            <div class="stepper-line">
              <div class="line-progress" style="width: 75%"></div>
            </div>
            <div class="step completed">
              <div class="step-dot"></div>
              <div class="step-info">
                <span class="step-name">Finca El Sol</span>
                <span class="step-time">06:00 AM</span>
              </div>
            </div>
            <div class="step completed">
              <div class="step-dot"></div>
              <div class="step-info">
                <span class="step-name">Checkpoint Alpha</span>
                <span class="step-time">09:30 AM</span>
              </div>
            </div>
            <div class="step active">
              <div class="step-dot"><i class="pi pi-truck" /></div>
              <div class="step-info">
                <span class="step-name">In Transit</span>
                <span class="step-time">Current</span>
              </div>
            </div>
            <div class="step pending">
              <div class="step-dot"></div>
              <div class="step-info">
                <span class="step-name">Processing Hub Central</span>
                <span class="step-time">ETA: 12:45 PM</span>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="telemetry-stats">
            <div class="t-stat">
              <span class="t-label">Current Speed</span>
              <span class="t-value">82 <small>km/h</small></span>
            </div>
            <div class="t-stat">
              <span class="t-label">Distance Left</span>
              <span class="t-value">45 <small>km</small></span>
            </div>
            <div class="t-stat">
              <span class="t-label">ETA Countdown</span>
              <span class="t-value highlight">00:45:00</span>
            </div>
            <div class="t-stat">
              <span class="t-label">Path Deviation</span>
              <span class="t-value">0.0%</span>
            </div>
          </div>
        </div>

        <div class="card alerts-log-card">
          <div class="card-header-mini">
            <div class="label-with-icon">
              <i class="pi pi-bell" />
              <span>QUALITY ALERTS LOG</span>
            </div>
            <pv-button label="VER DETALLES" icon="pi pi-external-link" class="p-button-text detail-link-btn" @click="router.push({ name: 'analytics-incidents' })" />
          </div>
          <div class="alerts-list-full">
            <div class="alert-row warning">
              <div class="alert-icon-box"><i class="pi pi-exclamation-triangle" /></div>
              <div class="alert-text">
                <span class="alert-msg">Humidity Threshold Warning</span>
                <span class="alert-sub">Relative humidity dropped below 82% briefly during door opening at checkpoint.</span>
              </div>
              <span class="alert-time-tag">09:32 AM</span>
            </div>
            <div class="alert-row info">
              <div class="alert-icon-box"><i class="pi pi-info-circle" /></div>
              <div class="alert-text">
                <span class="alert-msg">Optimal Temperature Reached</span>
                <span class="alert-sub">Container temperature stabilized at target 4.2°C.</span>
              </div>
              <span class="alert-time-tag">06:45 AM</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLogisticsMonitoringStore } from '../../application/logistics-monitoring.store.js';

const route = useRoute();
const router = useRouter();
const store = useLogisticsMonitoringStore();

const delivery = computed(() => {
  const id = route.params.id;
  return store.deliveries.find(d => d.deliveryId === id);
});

onMounted(async () => {
  if (!store.deliveries.length) {
    await store.fetchDeliveries();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.page-wrapper {
  padding: 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1a3020;
}

/* ── Header ─────────────────────────────────── */
.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  background: white !important;
  color: #1a3020 !important;
  border: none !important;
  border-radius: 12px !important;
  width: 44px !important;
  height: 44px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.context-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #6b8a6b;
  letter-spacing: 0.1em;
  display: block;
}

.order-title {
  font-size: 1.75rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
}

.status-indicator {
  background: #d4e4d4;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
.pulse { animation: pulse-green 2s infinite; }
@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* ── Grid Layout ────────────────────────────── */
.details-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  color: #e0ead0;
  border: 1px solid #2a3d2e;
}

.card-header-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: #8fba8f;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
}
.card-header-mini i { margin-right: 0.5rem; font-size: 0.8rem; }

.detail-link-btn {
  font-size: 0.6rem !important;
  font-weight: 800 !important;
  color: #c9e265 !important;
  padding: 0 !important;
  letter-spacing: 0.05em !important;
}
.detail-link-btn:hover { text-decoration: underline; }

/* ── Left Column ── */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.driver-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.driver-avatar-wrap {
  position: relative;
}
.driver-avatar {
  width: 64px; height: 64px;
  border-radius: 12px;
  object-fit: cover;
}
.rating-badge {
  position: absolute;
  bottom: -6px; right: -6px;
  background: #1a3020;
  color: #facc15;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid #facc15;
}

.driver-info h3 { font-size: 1.1rem; margin: 0 0 0.25rem; }
.phone-link { font-size: 0.75rem; color: #8fba8f; }

.msg-btn {
  width: 100%;
  background: transparent !important;
  border: 1.5px solid #3d5c42 !important;
  color: #c9e265 !important;
  border-radius: 10px !important;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
}

.vehicle-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.info-box {
  background: #2a3d2e;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.box-label { font-size: 0.55rem; color: #6b8a6b; font-weight: 800; }
.box-value { font-size: 0.85rem; font-weight: 700; color: #e0ead0; }

.manifest-list { display: flex; flex-direction: column; gap: 1rem; }
.manifest-item { display: flex; justify-content: space-between; align-items: center; }
.item-left { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 600; }
.icon-fruit { color: #c9e265; }
.item-qty { font-size: 0.85rem; color: #8fba8f; font-weight: 700; }

/* ── Right Column ── */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sensor-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.sensor-status {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.sensor-status.green  { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
.sensor-status.yellow { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }

.sensor-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 0.5rem;
}
.sensor-value { font-size: 3rem; font-weight: 900; color: #e0ead0; line-height: 1; }
.sensor-value .unit { font-size: 1.25rem; font-weight: 600; color: #6b8a6b; margin-left: 0.25rem; }

.sparkline { width: 140px; height: 50px; }
.spark-svg { width: 100%; height: 100%; }
.spark-path { fill: none; stroke-width: 3; stroke-linecap: round; }
.temp-path { stroke: #c9e265; filter: drop-shadow(0 0 5px rgba(201, 226, 101, 0.4)); }
.hum-path  { stroke: #60a5fa; filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.4)); }

/* ── Telemetry Card ── */
.route-stepper {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 1.5rem 1rem 2.5rem;
}
.stepper-line {
  position: absolute;
  top: 15px; left: 0; right: 0;
  height: 4px;
  background: #2a3d2e;
  border-radius: 2px;
}
.line-progress {
  height: 100%;
  background: #c9e265;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(201, 226, 101, 0.5);
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.step-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #1e2d22;
  border: 4px solid #2a3d2e;
  transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
}
.step.completed .step-dot { background: #c9e265; border-color: #c9e265; }
.step.active .step-dot {
  background: #c9e265; border-color: #c9e265;
  color: #1a3020; font-size: 1rem;
  box-shadow: 0 0 15px rgba(201, 226, 101, 0.4);
}

.step-info { position: absolute; top: 40px; white-space: nowrap; text-align: center; }
.step-name { display: block; font-size: 0.8rem; font-weight: 800; color: #8fba8f; }
.step.active .step-name { color: #c9e265; }
.step-time { font-size: 0.65rem; color: #6b8a6b; font-weight: 700; }

.telemetry-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #2a3d2e;
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1rem;
}
.t-stat { display: flex; flex-direction: column; gap: 0.3rem; }
.t-label { font-size: 0.6rem; color: #6b8a6b; font-weight: 800; letter-spacing: 0.05em; }
.t-value { font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
.t-value small { font-size: 0.7rem; color: #6b8a6b; margin-left: 2px; }
.t-value.highlight { color: #c9e265; }

/* ── Alerts Log ── */
.alerts-list-full { display: flex; flex-direction: column; gap: 0.75rem; }
.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #2a3d2e;
  border-radius: 12px;
  position: relative;
  border-left: 4px solid transparent;
}
.alert-row.warning { border-left-color: #fbbf24; }
.alert-row.info    { border-left-color: #60a5fa; }

.alert-icon-box {
  font-size: 1.1rem;
  margin-top: 0.2rem;
}
.warning .alert-icon-box { color: #fbbf24; }
.info .alert-icon-box    { color: #60a5fa; }

.alert-text { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
.alert-msg { font-size: 0.85rem; font-weight: 800; color: #e0ead0; }
.alert-sub { font-size: 0.75rem; color: #8fba8f; line-height: 1.4; }
.alert-time-tag { font-size: 0.65rem; color: #6b8a6b; font-weight: 700; }

@media (max-width: 1100px) {
  .details-grid { grid-template-columns: 1fr; }
}
</style>
