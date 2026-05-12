<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="iot-header-premium">
      <div class="header-info">
        <h1 class="page-title-main">IoT Device Fleet</h1>
        <p class="page-subtitle-main">Real-time status and sensor calibration for orchard logistics.</p>
      </div>

      <div class="header-badges">
        <div class="status-badge active">
          <span class="dot"></span>
          <span>{{ store.deviceStats.active }} ACTIVE</span>
        </div>
        <div class="status-badge alert">
          <span class="dot"></span>
          <span>2 BATTERY LOW</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="iot-grid">
      <!-- Devices Panel -->
      <section class="devices-section">
        <div class="section-header">
          <h2 class="section-title">EQUIPOS CONECTADOS</h2>
          <div class="actions">
            <pv-button icon="pi pi-plus" label="REGISTRAR" class="p-button-sm add-btn" />
          </div>
        </div>

        <div v-if="store.isLoading" class="loading-wrap">
          <i class="pi pi-spin pi-spinner" />
          <p>Sincronizando dispositivos...</p>
        </div>

        <div v-else class="devices-stack">
          <device-card
              v-for="device in store.devices"
              :key="device.deviceId"
              :device="device"
              :latest-reading="getLatestReading(device.deviceId)"
              @calibrate="handleCalibrate"
          />
        </div>
      </section>

      <!-- GPS Tracker Panel -->
      <aside class="gps-panel">
        <div class="panel-header">
          <div class="header-title">
            <i class="pi pi-map" />
            <span>REAL-TIME TRACKING</span>
          </div>
          <span class="gps-status">Active Signal</span>
        </div>

        <!-- Google Maps Placeholder Container -->
        <div class="map-container">
          <img src="https://media.bikemap.net/routes/14746781/staticmaps/in_1cd954e7-41bf-4700-bc04-397435420426_694x400_bikemap-2021-3D-static.png" alt="Map View" class="map-image" />
          <div class="map-overlay">
            <div class="tracker-marker pulse">
              <i class="pi pi-truck" />
              <div class="label">TRK-8821</div>
            </div>
          </div>
        </div>

        <div class="gps-data-card">
          <div class="data-row">
            <span class="d-label">Última Ubicación</span>
            <span class="d-value">-12.0464, -77.0428</span>
          </div>
          <div class="data-row">
            <span class="d-label">Velocidad Actual</span>
            <span class="d-value">82 km/h</span>
          </div>
          <hr class="divider" />
          <p class="gps-note">
            <i class="pi pi-info-circle" /> Detección de retrasos automática activada vía GPS_TRACKER.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useIoTInfrastructureStore } from '../../application/iot-infrastructure.store.js';
import DeviceCard from '../components/device-card.vue';

const store = useIoTInfrastructureStore();
const router = useRouter();

onMounted(async () => {
  await store.fetchDevices();
  await store.fetchReadings();
});

function getLatestReading(deviceId) {
  return store.readings
      .filter(r => r.deviceId === deviceId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
}

function handleCalibrate(deviceId) {
  router.push({ name: 'iot-calibration', params: { id: deviceId } });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1a3020;
}

.iot-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.page-title-main {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.25rem;
}

.page-subtitle-main {
  font-size: 1rem;
  color: #4a6b4a;
  margin: 0;
}

.header-badges {
  display: flex;
  gap: 1rem;
}

.status-badge {
  background: rgba(30, 45, 34, 0.05);
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #4a6b4a;
  border: 1px solid rgba(30,45,34,0.1);
}

.status-badge.active .dot { background: #4ade80; box-shadow: 0 0 10px rgba(74, 222, 128, 0.5); }
.status-badge.alert .dot { background: #f87171; box-shadow: 0 0 10px rgba(248, 113, 113, 0.5); }

.status-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.iot-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.section-title { font-size: 0.75rem; font-weight: 900; color: #1a3020; letter-spacing: 0.12em; margin: 0; }
.add-btn {
  background: #1e2d22 !important;
  color: #c9e265 !important;
  border: none !important;
  font-weight: 800 !important;
}

.devices-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  color: #6b8a6b;
}
.loading-wrap i { font-size: 2rem; margin-bottom: 1rem; color: #c9e265; }

.gps-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800; color: #1a3020; letter-spacing: 0.1em; }
.gps-status { font-size: 0.65rem; font-weight: 800; color: #4ade80; }

.map-container {
  height: 300px;
  background: #1e2d22;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid #2a3d2e;
}
.map-image { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }

.tracker-marker {
  position: absolute;
  top: 50%; left: 50%;
  background: #c9e265;
  color: #1a3020;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 0.75rem;
}
.tracker-marker.pulse { animation: map-pulse 2s infinite; }
@keyframes map-pulse {
  0% { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(201, 226, 101, 0); }
  100% { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0); }
}

.gps-data-card {
  background: #1e2d22;
  border-radius: 20px;
  padding: 1.5rem;
  color: #e0ead0;
}
.data-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.d-label { font-size: 0.75rem; color: #6b8a6b; font-weight: 600; }
.d-value { font-size: 0.85rem; font-weight: 800; }
.divider { border: none; border-top: 1px solid #2a3d2e; margin: 1.25rem 0; }
.gps-note { font-size: 0.7rem; color: #8fba8f; display: flex; gap: 0.5rem; line-height: 1.4; margin: 0; }
</style>
