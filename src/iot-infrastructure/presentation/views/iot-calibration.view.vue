<template>
  <div class="page-wrapper" v-if="device">
    <div v-if="hasActiveBreach" class="breach-alert-panel">
      <div class="alert-icon-wrap"><i class="pi pi-exclamation-triangle" /></div>
      <div class="alert-content">
        <h3 class="alert-title">Critical {{ device?.deviceType?.split('_')[0] || 'TEMPERATURE' }} Breach Detected</h3>
        <p class="alert-desc">
          Lectura actual: <strong class="text-danger">8.4°C</strong>.
          El umbral máximo configurado es 6.0°C. Integridad de la cadena de frío en riesgo.
        </p>
      </div>
      <div class="alert-actions">
        <pv-button label="Notificar Conductor" class="notify-btn" />
        <pv-button icon="pi pi-times" class="p-button-text p-button-secondary" />
      </div>
    </div>

    <header class="calibration-header">
      <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text back-btn" @click="router.back()" />
      <div class="header-titles">
        <span class="context-label">IOT / TELEMETRÍA / {{ device?.deviceId || 'DEV-001' }}</span>
        <h1 class="main-title">{{ device?.deviceType || 'THERMAL_SENSOR' }}</h1>
      </div>
    </header>

    <div class="calibration-grid">
      <aside class="rules-column">
        <div class="card rules-card">
          <div class="card-header-mini">
            <h2 class="card-title">Configuración de Reglas</h2>
            <i class="pi pi-sliders-h" />
          </div>

          <div class="rule-group active">
            <div class="rule-header">
              <div class="rule-label">
                <i class="pi pi-thermometer" />
                <span>TEMPERATURA</span>
              </div>
              <pv-input-switch v-model="tempRuleActive" />
            </div>
            
            <div class="threshold-inputs">
              <div class="input-field">
                <label>LÍMITE MÍNIMO</label>
                <div class="input-wrap">
                  <pv-input-number v-model="minTemp" mode="decimal" :minFractionDigits="1" class="transparent-input" />
                  <span class="unit">°C</span>
                </div>
              </div>
              <div class="input-field">
                <label>LÍMITE MÁXIMO</label>
                <div class="input-wrap">
                  <pv-input-number v-model="maxTemp" mode="decimal" :minFractionDigits="1" class="transparent-input" />
                  <span class="unit">°C</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rule-group disabled">
            <div class="rule-header">
              <div class="rule-label">
                <i class="pi pi-cloud" />
                <span>HUMEDAD</span>
              </div>
              <pv-input-switch :modelValue="false" />
            </div>
          </div>

          <pv-button label="AÑADIR REGLA" icon="pi pi-plus-circle" class="add-rule-btn" />
        </div>
      </aside>

      <main class="analysis-column">
        <div class="card chart-card">
          <div class="chart-header">
            <div class="chart-titles">
              <h2 class="card-title">Análisis de Telemetría en Vivo</h2>
              <p class="card-subtitle">Visualizando fluctuaciones térmicas de {{ device?.deviceId || 'DEV-001' }}</p>
            </div>
            <div class="chart-tabs">
              <button class="tab active">Tiempo Real</button>
              <button class="tab">Historial 24h</button>
            </div>
          </div>

          <div class="chart-container" style="height: 240px;">
            <pv-chart type="line" :data="chartData" :options="chartOptions" style="height: 100%; width: 100%;" />
          </div>

          <div class="chart-footer-stats">
            <div class="mini-stat">
              <span class="ms-label">TEMP. PROMEDIO</span>
              <span class="ms-value">4.2 <small>°C</small></span>
            </div>
            <div class="mini-stat">
              <span class="ms-label">VARIANZA PICO</span>
              <span class="ms-value highlight">+2.4 <small>°C</small></span>
            </div>
            <div class="mini-stat">
              <span class="ms-label">ESTADO ACTUAL</span>
              <span class="ms-value status-alert"><span class="dot"></span> BRECHA ACTIVA</span>
            </div>
          </div>
        </div>

        <div class="feed-section">
          <div class="feed-header">
            <h3 class="feed-title">Feed de Telemetría en Vivo</h3>
            <span class="pause-link">PAUSAR FEED <i class="pi pi-pause" /></span>
          </div>

          <div class="feed-grid">
            <div class="feed-item alert-danger">
              <div class="fi-icon"><i class="pi pi-thermometer" /></div>
              <div class="fi-info">
                <span class="fi-meta">TEMP • DEV-001</span>
                <span class="fi-value">8.4°C</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:45</span>
                <span class="custom-badge-danger">ALERTA</span>
              </div>
            </div>
            
            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-cloud" /></div>
              <div class="fi-info">
                <span class="fi-meta">HUMEDAD • DEV-002</span>
                <span class="fi-value">88%</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:41</span>
                <pv-tag value="ÓPTIMO" severity="success" />
              </div>
            </div>

            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-lock" /></div>
              <div class="fi-info">
                <span class="fi-meta">PUERTA • DEV-003</span>
                <span class="fi-value">CERRADA</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:38</span>
                <pv-tag value="ÓPTIMO" severity="success" />
              </div>
            </div>

            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-thermometer" /></div>
              <div class="fi-info">
                <span class="fi-meta">TEMP • DEV-004</span>
                <span class="fi-value">3.8°C</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:35</span>
                <pv-tag value="ÓPTIMO" severity="success" />
              </div>
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
import { useIoTInfrastructureStore } from '../../application/iot-infrastructure.store.js';

const route = useRoute();
const router = useRouter();
const store = useIoTInfrastructureStore();

const device = computed(() => {
  const found = store.devices.find(d => d.deviceId === route.params.id);
  if (found) return found;
  return { deviceId: 'DEV-001', deviceType: 'THERMAL_SENSOR' };
});

const latestReading = computed(() => {
  const readings = store.readings.filter(r => r.deviceId === route.params.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return readings.length ? readings[0] : { value: '8.4', unit: '°C' };
});

const hasActiveBreach = ref(true);
const tempRuleActive = ref(true);
const minTemp = ref(2.0);
const maxTemp = ref(6.0);

const chartData = ref({
  labels: ['14:00', '14:15', '14:30', '14:45', '15:00', '15:15', 'LIVE'],
  datasets: [
    {
      label: 'Temperatura °C',
      data: [3.2, 4.5, 3.8, 4.9, 6.2, 7.5, 8.4],
      fill: true,
      borderColor: '#c9e265',
      backgroundColor: 'rgba(201, 226, 101, 0.1)',
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#c9e265'
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a3020',
      titleColor: '#c9e265',
      bodyColor: '#e0ead0',
      borderColor: '#2a3d2e',
      borderWidth: 1,
      padding: 10,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#e0ead0', font: { size: 12, family: "'DM Sans', sans-serif" } },
      title: { display: true, text: 'TIEMPO (HORA)', color: '#8fba8f', font: { size: 11, weight: 'bold', family: "'DM Sans', sans-serif" }, padding: { top: 10 } }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#e0ead0', font: { size: 12, family: "'DM Sans', sans-serif" } },
      title: { display: true, text: 'TEMPERATURA (°C)', color: '#8fba8f', font: { size: 11, weight: 'bold', family: "'DM Sans', sans-serif" }, padding: { bottom: 10 } },
      min: 0,
      max: 10
    }
  }
});

onMounted(async () => {
  if (!store.devices.length) await store.fetchDevices();
  if (!store.readings.length) await store.fetchReadings();
});
</script>

<style scoped>
.page-wrapper {
  padding: 1.5rem 2rem;
  background: #E1EBE1;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* ── Breach Alert ───────────────────────────── */
.breach-alert-panel {
  background: #1e2d22;
  border: 1.5px solid rgba(248, 113, 113, 0.3);
  border-radius: 16px;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(248, 113, 113, 0.1);
}

.alert-icon-wrap {
  width: 48px; height: 48px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #f87171; font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-title { font-size: 1.1rem; font-weight: 800; color: #fca5a5; margin: 0 0 0.25rem; }
.alert-desc { font-size: 0.85rem; color: #8fba8f; margin: 0; line-height: 1.4; }
.text-danger { color: #f87171; }

.alert-actions { margin-left: auto; display: flex; gap: 1rem; align-items: center; }
.notify-btn {
  background: #E05252 !important; color: #ffffff !important;
  border: none !important; font-weight: 900 !important; font-size: 0.8rem !important;
  padding: 0.6rem 1.5rem !important; border-radius: 10px !important;
}

/* ── Header ─────────────────────────────────── */
.calibration-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.back-btn { background: white !important; color: #1a3020 !important; border-radius: 12px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
.context-label { font-size: 0.7rem; font-weight: 800; color: #6b8a6b; letter-spacing: 0.1em; display: block; text-transform: uppercase; margin-bottom: 0.2rem;}
.main-title { font-size: 1.8rem; font-weight: 900; margin: 0; color: #1a3020; letter-spacing: -0.02em; }

/* ── Grid ───────────────────────────────────── */
.calibration-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
}

.card {
  background: #1e2d22;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 1.5rem;
  color: #e0ead0;
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}

.card-header-mini {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 2rem; color: #c9e265;
}
.card-title { font-size: 1.1rem; font-weight: 800; margin: 0; color: #e0ead0; }

/* ── Rules Column ── */
.rule-group {
  background: #2a3d2e;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}
.rule-group.active { border-color: rgba(201, 226, 101, 0.5); }
.rule-group.disabled { opacity: 0.5; }

.rule-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.25rem;
}
.rule-label { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 800; }
.rule-label i { color: #c9e265; }

.threshold-inputs { display: flex; flex-direction: column; gap: 1rem; }
.input-field label { font-size: 0.65rem; font-weight: 800; color: #8fba8f; display: block; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
.input-wrap {
  background: #1e2d22; padding: 0.4rem 0.75rem; border-radius: 10px;
  display: flex; justify-content: space-between; align-items: center;
  border: 1px solid #3d5c42;
}
.input-wrap .unit { font-size: 0.8rem; color: #8fba8f; font-weight: 700; }

:deep(.transparent-input input) {
  background: transparent !important;
  border: none !important;
  color: #FFFFFF !important;
  font-family: 'DM Sans', sans-serif !important;
  font-weight: 800 !important;
  font-size: 1rem !important;
  padding: 0 !important;
  box-shadow: none !important;
  width: 100% !important;
  outline: none !important;
}

.add-rule-btn {
  width: 100%; background: transparent !important; border: 1.5px dashed #3d5c42 !important;
  color: #8fba8f !important; font-weight: 800 !important; font-size: 0.8rem !important;
  border-radius: 12px !important; margin-top: 1rem; padding: 0.8rem !important;
}
.add-rule-btn:hover { background: rgba(255,255,255,0.02) !important; color: #e0ead0 !important; }

/* ── Analysis Column ── */
.chart-card { margin-bottom: 1.5rem; /* Reducido de 2rem a 1.5rem */ }
.chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; /* Reducido de 2rem a 1.5rem */ }
.card-subtitle { font-size: 0.85rem; color: #8fba8f; margin: 0.25rem 0 0; }

.chart-tabs { display: flex; background: #2a3d2e; padding: 4px; border-radius: 10px; }
.tab {
  border: none; background: transparent; color: #8fba8f; font-size: 0.75rem; font-weight: 800;
  padding: 0.5rem 1rem; cursor: pointer; border-radius: 8px; transition: all 0.2s;
}
.tab:hover { color: #e0ead0; }
.tab.active { background: #c9e265; color: #1a3020; }

.chart-container { height: 260px; /* Reducido de 280px a 260px */ position: relative; width: 100%; }

.chart-footer-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem; margin-top: 1rem; /* Reducido de 2rem a 1rem */ border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;
}
.mini-stat { display: flex; flex-direction: column; gap: 0.4rem; }
.ms-label { font-size: 0.65rem; font-weight: 800; color: #8fba8f; letter-spacing: 0.05em; }
.ms-value { font-size: 1.5rem; font-weight: 900; color: #FFFFFF; }
.ms-value.highlight { color: #fca5a5; }
.ms-value.status-alert { font-size: 0.85rem; color: #f87171; display: flex; align-items: center; gap: 0.5rem; }
.ms-value .dot { width: 8px; height: 8px; background: #f87171; border-radius: 50%; }

/* ── Feed Section ── */
.feed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.feed-title { font-size: 1rem; font-weight: 800; color: #1a3020; margin: 0; }
.pause-link { font-size: 0.7rem; font-weight: 800; color: #4a6b4a; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: color 0.2s; }
.pause-link:hover { color: #1a3020; }

.feed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.feed-item {
  background: #1e2d22; border-radius: 16px; padding: 1.25rem;
  display: flex; align-items: center; gap: 1.25rem; border: 1px solid rgba(255,255,255,0.05);
}

/* 🟢 ARREGLO: Feed item de alerta rediseñado */
.feed-item.alert-danger {
  background: #8c2b29; /* Fondo rojo oscuro */
  border-color: #c53030; /* Borde rojo más claro */
}

.fi-icon { width: 42px; height: 42px; background: #2a3d2e; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 1.2rem; flex-shrink: 0; }
.feed-item.alert-danger .fi-icon { color: #fff; background: rgba(255, 255, 255, 0.2); }

.fi-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
.fi-meta { font-size: 0.6rem; font-weight: 800; color: #8fba8f; letter-spacing: 0.05em; }
.feed-item.alert-danger .fi-meta { color: rgba(255, 255, 255, 0.7); } /* Texto meta más claro en rojo */

.fi-value { font-size: 1.25rem; font-weight: 900; color: #FFFFFF; }
.feed-item.alert-danger .fi-value { color: #fff; } /* Valor en blanco sobre rojo */

.fi-status { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; }
.fi-time { font-size: 0.65rem; color: #8fba8f; font-weight: 700; }
.feed-item.alert-danger .fi-time { color: rgba(255, 255, 255, 0.7); } /* Hora más clara en rojo */

/* Badge de alerta personalizado */
.custom-badge-danger {
  background: #E05252;
  color: white;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

:deep(.fi-status .p-tag) { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; padding: 0.2rem 0.5rem; }

@media (max-width: 1024px) {
  .calibration-grid { grid-template-columns: 1fr; }
  .rules-column { display: none; }
  .feed-grid { grid-template-columns: 1fr; }
  
  .analysis-column, .card {
    min-width: 0;
  }
  .chart-container {
    width: 100%;
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .page-wrapper { padding: 1rem; }
  
  /* 🟢 ARREGLO DEL PANEL DE ALERTA APLASTADO */
  .breach-alert-panel {
    flex-direction: column; /* Apila los elementos en vertical */
    align-items: flex-start;
    padding: 1rem;
    gap: 1rem;
  }
  .alert-actions {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
  .notify-btn { width: 100%; text-align: center; }
}
</style>