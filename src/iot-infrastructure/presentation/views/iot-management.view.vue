<template>
  <div class="page-wrapper">
    <header class="iot-header-premium">
      <div class="header-info">
        <h1 class="page-title-main">IoT Device Fleet</h1>
        <p class="page-subtitle-main">Monitoreo de telemetría y resolución de alertas operativas.</p>
      </div>

      <div class="header-badges">
        <div class="status-badge active">
          <span class="dot"></span>
          <span>{{ activeDevices.length }} ACTIVE</span>
        </div>
        <div class="status-badge alert">
          <span class="dot"></span>
          <span>1 ALERT</span>
        </div>
      </div>
    </header>

    <div class="iot-grid">
      <section class="devices-section">
        <div class="section-header">
          <h2 class="section-title">SENSORES Y TELEMETRÍA</h2>
          <div class="actions">
            <pv-button icon="pi pi-filter" label="FILTRAR" class="p-button-sm p-button-text filter-btn" />
          </div>
        </div>

        <div v-if="isLoading" class="loading-wrap">
          <i class="pi pi-spin pi-spinner" />
          <p>Sincronizando dispositivos...</p>
        </div>

        <div v-else class="devices-lists">
          
          <h3 class="list-subtitle">EN RUTA (VINCULADOS)</h3>
          <div class="device-table-container">
            <table class="iot-table">
              <thead>
                <tr>
                  <th>SENSOR</th>
                  <th>VINCULADO A</th>
                  <th>LECTURA ACTUAL</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dev in activeDevices" :key="dev.id" :class="{ 'row-alert': !dev.isReadingOk }">
                  <td>
                    <div class="td-sensor">
                      <div class="sensor-icon" :class="dev.typeClass">
                        <i :class="dev.icon"></i>
                      </div>
                      <div class="sensor-info">
                        <span class="sensor-id">{{ dev.id }}</span>
                        <span class="sensor-type">{{ dev.type }}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div class="td-linked">
                      <span class="linked-truck"><i class="pi pi-truck"></i> {{ dev.truck }}</span>
                      <span class="linked-order">{{ dev.order }}</span>
                    </div>
                  </td>

                  <td>
                    <div class="td-reading">
                      <span class="reading-value" :class="dev.isReadingOk ? 'text-ok' : 'text-danger'">
                        {{ dev.currentValue }}
                      </span>
                      <span class="reading-threshold">
                        límite {{ dev.threshold }} 
                        <i :class="dev.isReadingOk ? 'pi pi-check text-ok' : 'pi pi-times text-danger'"></i>
                      </span>
                    </div>
                  </td>

                  <td>
                    <div class="td-actions">
                      <button class="btn-action-small" @click="viewAlerts(dev.id)">
                        <i class="pi pi-bell"></i> Alertas
                      </button>
                      <button class="btn-action-small outline" @click="viewOrder(dev.order)">
                        <i class="pi pi-external-link"></i> Pedido
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="list-subtitle mt-2">EN ALMACÉN (INACTIVOS)</h3>
          <div class="device-table-container inactive-container">
            <table class="iot-table">
              <thead>
                <tr>
                  <th>SENSOR</th>
                  <th>ESTADO</th>
                  <th>ÚLTIMA LECTURA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dev in inactiveDevices" :key="dev.id" class="inactive-row">
                  <td>
                    <div class="td-sensor">
                      <div class="sensor-icon inactive-icon">
                        <i :class="dev.icon"></i>
                      </div>
                      <div class="sensor-info">
                        <span class="sensor-id">{{ dev.id }}</span>
                        <span class="sensor-type">{{ dev.type }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge-offline">Sin vinculación</span>
                  </td>
                  <td>
                    <span class="reading-threshold">Payload "--"</span>
                  </td>
                  <td>
                    <button class="btn-action-small disabled" disabled>Asignar a vehículo</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      <aside class="gps-panel">
        <div class="panel-header">
          <div class="header-title">
            <i class="pi pi-map" />
            <span>REAL-TIME TRACKING</span>
          </div>
          <span class="gps-status">Active Signal</span>
        </div>

        <div class="map-container">
          <svg class="map-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0c1f15"/>
                <stop offset="100%" stop-color="#1a2a1e"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#mapGrad)"/>
            <line v-for="i in 8" :key="'h'+i" :x1="0" :x2="400" :y1="i*40" :y2="i*40" stroke="#1e3626" stroke-width="1"/>
            <line v-for="i in 10" :key="'v'+i" :x1="i*40" :x2="i*40" :y1="0" :y2="300" stroke="#1e3626" stroke-width="1"/>
            
            <path d="M 50 250 Q 150 200 200 150 T 350 50" fill="none" stroke="#3d5c42" stroke-width="3" stroke-dasharray="6 6"/>
            
            <circle cx="200" cy="150" r="6" fill="#c9e265"/>
            <circle cx="200" cy="150" r="15" fill="none" stroke="#c9e265" stroke-width="2" opacity="0.5">
              <animate attributeName="r" values="10;25;10" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          
          <div class="map-overlay">
            <div class="tracker-marker">
              <i class="pi pi-truck" />
              <div class="label">ABC-123</div>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// Importamos tu BaseApi para hacer las llamadas a Render
import { BaseApi } from '../../../shared/infrastructure/base-api.js';

const router = useRouter();
const api = new BaseApi();

const rawDevices = ref([]);
const rawReadings = ref([]);
const activeDeliveries = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  await fetchIoTData();
});

async function fetchIoTData() {
  isLoading.value = true;
  try {
    // 1. Llamamos a todas las APIs necesarias en paralelo para mayor velocidad
    const [devicesRes, readingsRes, deliveriesRes] = await Promise.all([
      api.http.get('https://fruitlogix-platform.onrender.com/api/v1/io-t-devices'),
      api.http.get('https://fruitlogix-platform.onrender.com/api/v1/sensor-readings'),
      api.http.get('https://fruitlogix-platform.onrender.com/api/v1/deliveries')
    ]);

    rawDevices.value = devicesRes.data || [];
    rawReadings.value = readingsRes.data || [];
    activeDeliveries.value = deliveriesRes.data || [];

    // INYECCIÓN DE PRUEBA: Si la tabla de dispositivos está vacía, forzamos un par para no romper el UI
    if (rawDevices.value.length === 0) {
      console.log("No hay dispositivos IoT en DB. Inyectando mock data...");
      rawDevices.value = [
        { id: 1, deviceCode: 'DEV-991', deviceType: 'Thermal', location: 'ABC-123', status: 'Active' },
        { id: 2, deviceCode: 'DEV-992', deviceType: 'Humidity', location: 'Almacén', status: 'Inactive' }
      ];
      rawReadings.value = [
        { deviceId: 1, value: 4.5, unit: '°C', timestamp: new Date().toISOString() }
      ];
    }

  } catch (error) {
    console.error("Error cargando el Bounded Context de IoT:", error);
  } finally {
    isLoading.value = false;
  }
}

// 2. Mapeamos y cruzamos la data de C# a la estructura que requiere tu HTML
const enhancedDevices = computed(() => {
  return rawDevices.value.map(device => {

    // a) Buscamos la última lectura de este dispositivo
    const deviceReadings = rawReadings.value.filter(r => r.deviceId === device.id);
    const lastReading = deviceReadings.length > 0
        ? deviceReadings.reduce((latest, current) => new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current)
        : null;

    // b) Definimos iconos y clases según el tipo
    const typeLower = (device.deviceType || '').toLowerCase();
    let icon = 'pi pi-box';
    let typeClass = 'icon-gray';
    let threshold = 0;

    if (typeLower.includes('therm') || typeLower.includes('temp')) {
      icon = 'pi pi-thermometer'; typeClass = 'icon-blue'; threshold = 8.0;
    } else if (typeLower.includes('humid')) {
      icon = 'pi pi-cloud'; typeClass = 'icon-cyan'; threshold = 90.0;
    }

    // c) Validamos si la lectura superó el umbral
    const readingVal = lastReading ? parseFloat(lastReading.value) : 0;
    const isOk = lastReading ? (readingVal <= threshold) : true;

    // d) Buscamos si el camión asociado ('location') está en alguna orden activa
    const linkedDelivery = activeDeliveries.value.find(d =>
        d.vehiclePlate && device.location && d.vehiclePlate.toLowerCase() === device.location.toLowerCase()
    );

    return {
      id: device.deviceCode || `DEV-00${device.id}`,
      dbId: device.id,
      type: (device.deviceType || 'UNKNOWN').toUpperCase(),
      icon: icon,
      typeClass: typeClass,
      truck: device.location && device.location !== 'Almacén' ? device.location : '--',
      order: linkedDelivery ? `#ORD-${linkedDelivery.orderId}` : '--',
      currentValue: lastReading ? `${readingVal}${lastReading.unit}` : '--',
      threshold: threshold ? `${threshold}${lastReading ? lastReading.unit : ''}` : '--',
      isReadingOk: isOk,
      isActive: device.status === 'Active' || device.status === 'Activo'
    };
  });
});

const activeDevices = computed(() => enhancedDevices.value.filter(d => d.isActive));
const inactiveDevices = computed(() => enhancedDevices.value.filter(d => !d.isActive));

function viewAlerts(deviceId) {
  router.push({
    name: 'iot-calibration',
    params: { id: deviceId }
  });
}

function viewOrder(orderId) {
  if(orderId === '--') return;
  const cleanId = orderId.replace('#', '');
  // Asumo que tienes una ruta para ver el detalle de la orden desde aquí, o la rediriges al dashboard principal
  router.push({ name: 'logistics-monitoring' });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem;
  background: #E1EBE1;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1a3020;
}

.iot-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title-main {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
}

.page-subtitle-main {
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a6b4a;
  margin: 0;
}

.header-badges {
  display: flex;
  gap: 1rem;
}

.status-badge {
  background: #1e2d22;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #FFFFFF;
  border: 1px solid rgba(255,255,255,0.05);
}

.status-badge.active .dot { background: #D4E952; box-shadow: 0 0 10px rgba(212, 233, 82, 0.4); }
.status-badge.alert .dot { background: #f87171; box-shadow: 0 0 10px rgba(248, 113, 113, 0.5); }

.status-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.iot-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
  align-items: start;
}

/* ── TABLAS DE DISPOSITIVOS ── */
.devices-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.section-title { font-size: 1.1rem; font-weight: 800; color: #1a3020; margin: 0; }
.filter-btn { color: #4a6b4a !important; font-weight: 700 !important; }

.list-subtitle {
  font-size: 0.7rem;
  font-weight: 800;
  color: #6b8a6b;
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
}
.mt-2 { margin-top: 2rem; }

.device-table-container {
  background: #1e2d22;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
}

.inactive-container {
  background: #142116;
  opacity: 0.85;
}

.iot-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.iot-table th {
  background: rgba(0,0,0,0.2);
  color: #8fba8f;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.iot-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  vertical-align: middle;
}

.iot-table tr:last-child td {
  border-bottom: none;
}

.row-alert {
  background: rgba(248, 113, 113, 0.05);
  border-left: 3px solid #f87171;
}

/* Celdas personalizadas */
.td-sensor {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.sensor-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
}
.icon-blue { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.icon-cyan { background: rgba(45, 212, 191, 0.15); color: #2dd4bf; }
.inactive-icon { background: rgba(255,255,255,0.05); color: #6b8a6b; }

.sensor-info { display: flex; flex-direction: column; gap: 0.2rem; }
.sensor-id { font-size: 0.9rem; font-weight: 800; color: #FFFFFF; }
.sensor-type { font-size: 0.65rem; color: #8fba8f; }

.td-linked {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.linked-truck { font-size: 0.8rem; font-weight: 700; color: #D4E952; display: flex; align-items: center; gap: 0.4rem; }
.linked-order { font-size: 0.7rem; color: #9ab39d; font-weight: 600; }

.td-reading {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.reading-value { font-size: 1.1rem; font-weight: 900; }
.reading-threshold { font-size: 0.7rem; color: #8fba8f; display: flex; align-items: center; gap: 4px; }
.text-ok { color: #4ade80; }
.text-danger { color: #f87171; }

.badge-offline {
  background: rgba(255,255,255,0.05);
  color: #8fba8f;
  font-size: 0.65rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
}

/* Botones de acción nuevos */
.td-actions {
  display: flex;
  gap: 0.5rem;
}
.btn-action-small {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #FFFFFF;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
  transition: all 0.2s;
}
.btn-action-small:hover:not(:disabled) {
  background: #2a3d2e;
  border-color: #4a6b4a;
}
.btn-action-small.outline {
  background: transparent;
  color: #D4E952;
  border-color: rgba(212, 233, 82, 0.3);
}
.btn-action-small.outline:hover {
  background: rgba(212, 233, 82, 0.1);
}
.btn-action-small.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


/* ── GPS TRACKER PANEL ── */
.gps-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; color: #1a3020; letter-spacing: 0.1em; }
.gps-status { font-size: 0.7rem; font-weight: 800; color: #4ade80; background: rgba(74, 222, 128, 0.15); padding: 0.2rem 0.6rem; border-radius: 4px; }

.map-container {
  height: 280px;
  background: #0c1f15;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.05);
}
.map-svg { width: 100%; height: 100%; display: block; }

.tracker-marker {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #D4E952;
  color: #1a3020;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.gps-data-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  color: #e0ead0;
  border: 1px solid rgba(255,255,255,0.05);
}
.data-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.d-label { font-size: 0.75rem; color: #8fba8f; font-weight: 600; }
.d-value { font-size: 0.9rem; font-weight: 800; color: #FFFFFF; }
.divider { border: none; border-top: 1px solid #2a3d2e; margin: 1.25rem 0; }
.gps-note { font-size: 0.75rem; color: #8fba8f; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.4; margin: 0; }
.gps-note i { color: #D4E952; margin-top: 2px; }

@media (max-width: 1100px) {
  .iot-grid { grid-template-columns: 1fr; }
  .gps-panel { position: static; }
}
</style>