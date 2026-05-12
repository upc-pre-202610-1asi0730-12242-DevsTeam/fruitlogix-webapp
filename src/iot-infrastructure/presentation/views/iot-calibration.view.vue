<template>
  <div class="page-wrapper" v-if="device">
    <!-- Top Alert Breach -->
    <div v-if="hasActiveBreach" class="breach-alert-panel">
      <div class="alert-icon-wrap"><i class="pi pi-exclamation-triangle" /></div>
      <div class="alert-content">
        <h3 class="alert-title">Critical {{ device.deviceType.split('_')[0] }} Breach Detected</h3>
        <p class="alert-desc">
          Reading: <strong>{{ latestReading?.value }}{{ latestReading?.unit }}</strong>.
          Maximum allowed is 6.0°C. Cold chain integrity at risk.
        </p>
      </div>
      <div class="alert-actions">
        <pv-button label="Notify Distributor" class="notify-btn" />
        <pv-button icon="pi pi-times" class="p-button-text p-button-secondary" />
      </div>
    </div>

    <header class="calibration-header">
      <pv-button icon="pi pi-arrow-left" class="p-button-rounded p-button-text back-btn" @click="router.back()" />
      <div class="header-titles">
        <span class="context-label">IOT INFRASTRUCTURE / CALIBRATION</span>
        <h1 class="main-title">{{ device.deviceType }} - {{ device.deviceId }}</h1>
      </div>
    </header>

    <div class="calibration-grid">
      <!-- Left: Rules Configuration -->
      <aside class="rules-column">
        <div class="card rules-card">
          <div class="card-header-mini">
            <h2 class="card-title">Rule Configuration</h2>
            <i class="pi pi-sliders-h" />
          </div>

          <div class="rule-group active">
            <div class="rule-header">
              <div class="rule-label">
                <i class="pi pi-thermometer" />
                <span>TEMPERATURE</span>
              </div>
              <pv-input-switch v-model="tempRuleActive" />
            </div>
            <div class="threshold-inputs">
              <div class="input-field">
                <label>MIN THRESHOLD</label>
                <div class="input-wrap">
                  <pv-input-number v-model="minTemp" mode="decimal" :minFractionDigits="1" />
                  <span class="unit">°C</span>
                </div>
              </div>
              <div class="input-field">
                <label>MAX THRESHOLD</label>
                <div class="input-wrap">
                  <pv-input-number v-model="maxTemp" mode="decimal" :minFractionDigits="1" />
                  <span class="unit">°C</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rule-group disabled">
            <div class="rule-header">
              <div class="rule-label">
                <i class="pi pi-cloud" />
                <span>HUMIDITY</span>
              </div>
              <pv-input-switch :modelValue="false" />
            </div>
          </div>

          <pv-button label="ADD NEW RULE" icon="pi pi-plus-circle" class="add-rule-btn" />
        </div>
      </aside>

      <!-- Center: Main Analysis -->
      <main class="analysis-column">
        <div class="card chart-card">
          <div class="chart-header">
            <div class="chart-titles">
              <h2 class="card-title">Live Telemetry Analysis</h2>
              <p class="card-subtitle">Visualizing {{ device.deviceId }} Thermal Fluctuations</p>
            </div>
            <div class="chart-tabs">
              <button class="tab active">Real-time</button>
              <button class="tab">24h History</button>
            </div>
          </div>

          <div class="chart-container">
            <pv-chart type="line" :data="chartData" :options="chartOptions" class="telemetry-chart" />
          </div>

          <div class="chart-footer-stats">
            <div class="mini-stat">
              <span class="ms-label">AVG TEMP</span>
              <span class="ms-value">4.2 <small>°C</small></span>
            </div>
            <div class="mini-stat">
              <span class="ms-label">PEAK VARIANCE</span>
              <span class="ms-value highlight">+2.4 <small>°C</small></span>
            </div>
            <div class="mini-stat">
              <span class="ms-label">STATUS</span>
              <span class="ms-value status-alert"><span class="dot"></span> ACTIVE BREACH</span>
            </div>
          </div>
        </div>

        <div class="feed-section">
          <div class="feed-header">
            <h3 class="feed-title">Real-time Telemetry Feed</h3>
            <span class="pause-link">PAUSE STREAM <i class="pi pi-pause" /></span>
          </div>

          <div class="feed-grid">
            <div class="feed-item active">
              <div class="fi-icon"><i class="pi pi-thermometer" /></div>
              <div class="fi-info">
                <span class="fi-meta">TEMP • HUB #29</span>
                <span class="fi-value">8.4°C</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:45</span>
                <pv-tag value="BREACH" severity="danger" />
              </div>
            </div>
            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-cloud" /></div>
              <div class="fi-info">
                <span class="fi-meta">HUMIDITY • HUB #12</span>
                <span class="fi-value">88%</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:41</span>
                <pv-tag value="OPTIMAL" severity="success" />
              </div>
            </div>
            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-share-alt" /></div>
              <div class="fi-info">
                <span class="fi-meta">ETHYLENE • HUB #04</span>
                <span class="fi-value">12 ppm</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:38</span>
                <pv-tag value="OPTIMAL" severity="success" />
              </div>
            </div>
            <div class="feed-item">
              <div class="fi-icon"><i class="pi pi-thermometer" /></div>
              <div class="fi-info">
                <span class="fi-meta">TEMP • HUB #11</span>
                <span class="fi-value">3.8°C</span>
              </div>
              <div class="fi-status">
                <span class="fi-time">15:22:35</span>
                <pv-tag value="OPTIMAL" severity="success" />
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

const device = computed(() => store.devices.find(d => d.deviceId === route.params.id));
const latestReading = computed(() => {
  return store.readings.filter(r => r.deviceId === route.params.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
});

const hasActiveBreach = ref(true);
const tempRuleActive = ref(true);
const minTemp = ref(2.0);
const maxTemp = ref(6.0);

const chartData = ref({
  labels: ['14:00', '14:15', '14:30', '14:45', '15:00', '15:15', 'LIVE'],
  datasets: [
    {
      label: 'Temperature',
      data: [3.2, 4.5, 3.8, 4.9, 6.2, 7.5, 8.4],
      fill: true,
      borderColor: '#c9e265',
      backgroundColor: 'rgba(201, 226, 101, 0.1)',
      tension: 0.4,
      pointRadius: 4,
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
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#6b8a6b', font: { size: 10, weight: 'bold' } }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#6b8a6b', font: { size: 10, weight: 'bold' } }
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
  background: #e8f5e4;
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
}

.alert-title { font-size: 1.1rem; font-weight: 800; color: #fca5a5; margin: 0 0 0.25rem; }
.alert-desc { font-size: 0.85rem; color: #8fba8f; margin: 0; }
.alert-desc strong { color: #e0ead0; }

.alert-actions { margin-left: auto; display: flex; gap: 1rem; }
.notify-btn {
  background: #fca5a5 !important; color: #1a3020 !important;
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

.back-btn { background: white !important; color: #1a3020 !important; border-radius: 12px !important; }
.context-label { font-size: 0.7rem; font-weight: 800; color: #6b8a6b; letter-spacing: 0.1em; display: block; }
.main-title { font-size: 1.75rem; font-weight: 900; margin: 0; color: #1a3020; }

/* ── Grid ───────────────────────────────────── */
.calibration-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
}

.card {
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 20px;
  padding: 1.5rem;
  color: #e0ead0;
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
.rule-group.active { border-color: #c9e265; }
.rule-group.disabled { opacity: 0.5; }

.rule-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.25rem;
}
.rule-label { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 800; }
.rule-label i { color: #c9e265; }

.threshold-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.input-field label { font-size: 0.55rem; font-weight: 900; color: #6b8a6b; display: block; margin-bottom: 0.5rem; }
.input-wrap {
  background: #1e2d22; padding: 0.5rem 0.75rem; border-radius: 10px;
  display: flex; justify-content: space-between; align-items: center;
}
.input-wrap .unit { font-size: 0.75rem; color: #6b8a6b; font-weight: 700; }

.add-rule-btn {
  width: 100%; background: transparent !important; border: 1.5px dashed #3d5c42 !important;
  color: #8fba8f !important; font-weight: 800 !important; font-size: 0.8rem !important;
  border-radius: 12px !important; margin-top: 1rem;
}

/* ── Analysis Column ── */
.chart-card { margin-bottom: 2rem; }
.chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.card-subtitle { font-size: 0.85rem; color: #8fba8f; margin: 0.25rem 0 0; }

.chart-tabs { display: flex; background: #2a3d2e; padding: 4px; border-radius: 10px; }
.tab {
  border: none; background: transparent; color: #6b8a6b; font-size: 0.75rem; font-weight: 800;
  padding: 0.5rem 1rem; cursor: pointer; border-radius: 8px;
}
.tab.active { background: #c9e265; color: #1a3020; }

.chart-container { height: 350px; position: relative; }

.chart-footer-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem; margin-top: 2rem; border-top: 1px solid #2a3d2e; padding-top: 1.5rem;
}
.mini-stat { display: flex; flex-direction: column; gap: 0.4rem; }
.ms-label { font-size: 0.65rem; font-weight: 800; color: #6b8a6b; letter-spacing: 0.05em; }
.ms-value { font-size: 1.5rem; font-weight: 900; }
.ms-value.highlight { color: #fca5a5; }
.ms-value.status-alert { font-size: 0.85rem; color: #f87171; display: flex; align-items: center; gap: 0.5rem; }
.ms-value .dot { width: 8px; height: 8px; background: #f87171; border-radius: 50%; }

/* ── Feed Section ── */
.feed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.feed-title { font-size: 1rem; font-weight: 800; color: #1a3020; margin: 0; }
.pause-link { font-size: 0.7rem; font-weight: 800; color: #4a6b4a; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

.feed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.feed-item {
  background: #1e2d22; border-radius: 16px; padding: 1.25rem;
  display: flex; align-items: center; gap: 1.25rem; border: 1px solid #2a3d2e;
}
.feed-item.active { border-color: #c9e265; box-shadow: 0 0 15px rgba(201, 226, 101, 0.1); }

.fi-icon { width: 42px; height: 42px; background: #2a3d2e; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 1.2rem; }
.fi-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
.fi-meta { font-size: 0.6rem; font-weight: 800; color: #6b8a6b; }
.fi-value { font-size: 1.25rem; font-weight: 900; }
.fi-status { text-align: right; display: flex; flex-direction: column; gap: 0.4rem; }
.fi-time { font-size: 0.65rem; color: #4a6b4a; font-weight: 700; }
</style>
