<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="page-title">Analytics & Incidencias</h1>
        <div class="search-bar">
          <i class="pi pi-search" />
          <input type="text" placeholder="Buscar registros o conductores..." />
        </div>
      </div>
      <div class="header-right">
        <pv-button label="Exportar PDF" icon="pi pi-file-pdf" class="export-btn" />
        <div class="header-icons">
          <i class="pi pi-bell notification-dot" />
          <i class="pi pi-th-large" />
        </div>
      </div>
    </header>

    <!-- Top Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-info">
            <span class="stat-label">Total Active Incidents</span>
            <span class="stat-value">24</span>
            <span class="stat-trend up"><i class="pi pi-arrow-up-right" /> +12% desde la última hora</span>
          </div>
          <i class="pi pi-exclamation-triangle stat-icon warn" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-info">
            <span class="stat-label">Average Delay Time</span>
            <span class="stat-value">42 <small>MIN</small></span>
            <span class="stat-trend down"><i class="pi pi-arrow-down-right" /> -5min respecto al promedio</span>
          </div>
          <i class="pi pi-clock stat-icon" />
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-info">
            <span class="stat-label">Resolved Today</span>
            <span class="stat-value">156</span>
            <span class="stat-trend up"><i class="pi pi-check-circle" /> Eficiencia: 94.2%</span>
          </div>
          <i class="pi pi-check-circle stat-icon success" />
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="dashboard-layout">
      <!-- Left Section: Incident Log -->
      <section class="incident-section">
        <div class="section-header">
          <div class="header-title-wrap">
            <h2 class="section-title">Incident Log Feed</h2>
            <span class="live-badge">LIVE</span>
          </div>
          <div class="filter-pills">
            <button class="pill active">Todos</button>
            <button class="pill">Críticos</button>
          </div>
        </div>

        <div class="incident-list">
          <!-- Incident 1 -->
          <div class="incident-card critical">
            <div class="incident-header">
              <div class="incident-type-wrap">
                <div class="type-icon temp"><i class="pi pi-thermometer" /></div>
                <div class="type-info">
                  <span class="type-tag temp">TEMPERATURE BREACH</span>
                  <h3 class="incident-id">Ref-4029: Carga de Arándanos</h3>
                </div>
              </div>
              <span class="incident-time">14:22:10 UTC</span>
            </div>
            <p class="incident-desc">
              Sensor crítico detectó desviación térmica de <span class="highlight">+4.5°C</span> sobre el umbral de seguridad en el contenedor 4029. La integridad de los frutos rojos está en riesgo moderado. Ruta: Santiago → Valparaíso.
            </p>
            <div class="incident-actions">
              <pv-button label="Resolve Incident" class="resolve-btn" />
              <pv-button label="View on Map" icon="pi pi-map" class="map-btn" />
            </div>
          </div>

          <!-- Incident 2 -->
          <div class="incident-card warning">
            <div class="incident-header">
              <div class="incident-type-wrap">
                <div class="type-icon delay"><i class="pi pi-truck" /></div>
                <div class="type-info">
                  <span class="type-tag delay">DELIVERY DELAY</span>
                  <h3 class="incident-id">Envío #TRK-8821: Manzanas Premium</h3>
                </div>
              </div>
              <span class="incident-time">13:45:02 UTC</span>
            </div>
            <p class="incident-desc">
              Retraso reportado por congestión masiva en el Puerto de San Antonio. El tiempo estimado de llegada (ETA) se ha desplazado <span class="highlight">120 minutos</span>. Conductor en espera.
            </p>
            <div class="incident-actions">
              <pv-button label="Resolve Incident" class="resolve-btn" />
              <pv-button label="View on Map" icon="pi pi-map" class="map-btn" />
            </div>
          </div>

          <!-- Incident 3 -->
          <div class="incident-card info">
            <div class="incident-header">
              <div class="incident-type-wrap">
                <div class="type-icon status"><i class="pi pi-refresh" /></div>
                <div class="type-info">
                  <span class="type-tag status">STATUS CHANGE</span>
                  <h3 class="incident-id">Lote #992-B: Inspección Fitosanitaria</h3>
                </div>
              </div>
              <span class="incident-time">12:15:30 UTC</span>
            </div>
            <p class="incident-desc">
              El estado del lote ha cambiado de <span class="highlight">"En Tránsito"</span> a <span class="highlight">"Retenido por Inspección"</span>. Se requiere validación de documentos fitosanitarios para exportación a la UE.
            </p>
            <div class="incident-actions">
              <pv-button label="Resolve Incident" class="resolve-btn" />
              <pv-button label="View on Map" icon="pi pi-map" class="map-btn" />
            </div>
          </div>
        </div>
      </section>

      <!-- Right Section: Sidebar -->
      <aside class="dashboard-sidebar">
        <!-- Mini Map Card -->
        <div class="sidebar-card map-card">
          <div class="sidebar-header">
            <div class="header-left-icon">
              <i class="pi pi-compass" />
              <span>Real-time Tracking</span>
            </div>
            <span class="map-region">Zona Central, CL</span>
          </div>
          <div class="mini-map">
            <img src="https://media.bikemap.net/routes/14746781/staticmaps/in_1cd954e7-41bf-4700-bc04-397435420426_694x400_bikemap-2021-3D-static.png" alt="Map" />
            <div class="map-point pulse"></div>
          </div>
        </div>

        <!-- Notifications Card -->
        <div class="sidebar-card notifications-card">
          <div class="sidebar-header">
            <span>QUICK NOTIFICATIONS</span>
          </div>
          <div class="notif-list">
            <div class="notif-item">
              <div class="notif-icon"><i class="pi pi-info-circle" /></div>
              <div class="notif-body">
                <span class="notif-title">Cierre de muelle programado</span>
                <span class="notif-desc">Muelle 4 estará inactivo por mantenimiento desde las 18:00.</span>
                <span class="notif-time">HACE 5 MIN</span>
              </div>
            </div>
            <div class="notif-item">
              <div class="notif-icon"><i class="pi pi-user" /></div>
              <div class="notif-body">
                <span class="notif-title">Asignación de Conductor</span>
                <span class="notif-desc">Roberto Gómez asignado a la ruta #VAL-202.</span>
                <span class="notif-time">HACE 12 MIN</span>
              </div>
            </div>
            <div class="notif-item">
              <div class="notif-icon danger"><i class="pi pi-exclamation-circle" /></div>
              <div class="notif-body">
                <span class="notif-title">Alerta Meteorológica</span>
                <span class="notif-desc">Vientos fuertes detectados en el paso fronterizo Los Libertadores.</span>
                <span class="notif-time">HACE 28 MIN</span>
              </div>
            </div>
          </div>
          <a href="#" class="view-history">Ver todo el historial</a>
        </div>

        <!-- Network Health Card -->
        <div class="sidebar-card health-card">
          <div class="sidebar-header">
            <span>NETWORK HEALTH</span>
          </div>
          <div class="health-grid">
            <div class="health-row">
              <span class="health-label">IoT Gateway</span>
              <div class="health-bars">
                <div class="bar active"></div>
                <div class="bar active"></div>
                <div class="bar active"></div>
              </div>
            </div>
            <div class="health-row">
              <span class="health-label">Database Latency</span>
              <span class="health-val">12ms</span>
            </div>
            <div class="health-row">
              <span class="health-label">Cloud Sync</span>
              <span class="health-status active"><span class="dot"></span> Active</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
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

/* ── Header ─────────────────────────────────── */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
}

.search-bar {
  background: white;
  border: 1px solid #d0e0d0;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 380px;
}
.search-bar i { color: #8fba8f; }
.search-bar input {
  background: transparent;
  border: none;
  color: #1a3020;
  font-size: 0.85rem;
  width: 100%;
}
.search-bar input:focus { outline: none; }

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.export-btn {
  background: #c9e265 !important;
  color: #1a3020 !important;
  border: none !important;
  font-weight: 800 !important;
  font-size: 0.75rem !important;
  border-radius: 10px !important;
}

.header-icons {
  display: flex;
  gap: 1.25rem;
  color: #4a6b4a;
  font-size: 1.1rem;
}

.notification-dot { position: relative; }
.notification-dot::after {
  content: '';
  position: absolute;
  top: -2px; right: -2px;
  width: 6px; height: 6px;
  background: #f87171;
  border-radius: 50%;
  border: 1.5px solid #0d160d;
}

/* ── Stats Row ──────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: #142116;
  border: 1px solid #1a2a1e;
  border-radius: 16px;
  padding: 1.5rem;
}

.stat-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info { display: flex; flex-direction: column; gap: 0.25rem; }
.stat-label { font-size: 0.7rem; font-weight: 700; color: #6b8a6b; letter-spacing: 0.05em; }
.stat-value { font-size: 2rem; font-weight: 900; color: #e0ead0; }
.stat-value small { font-size: 0.8rem; color: #4a6b4a; }

.stat-trend {
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.stat-trend.up { color: #f87171; }
.stat-trend.down { color: #c9e265; }

.stat-icon { font-size: 2rem; color: #1a2a1e; }
.stat-icon.warn { color: #1e2d22; filter: drop-shadow(0 0 10px rgba(248, 113, 113, 0.1)); }
.stat-icon.success { color: #1e2d22; }

/* ── Dashboard Layout ───────────────────────── */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
}

/* ── Incidents Section ── */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title-wrap { display: flex; align-items: center; gap: 0.75rem; }
.section-title { font-size: 1.5rem; font-weight: 800; margin: 0; color: #1a3020; }
.live-badge {
  background: #1a2a1e;
  color: #c9e265;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.filter-pills { display: flex; background: #e0ead0; padding: 4px; border-radius: 8px; gap: 4px; border: 1px solid #d0e0d0; }
.pill {
  border: none; background: transparent; color: #6b8a6b;
  font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1rem;
  cursor: pointer; border-radius: 6px;
}
.pill.active { background: #1a2a1e; color: #c9e265; }

.incident-list { display: flex; flex-direction: column; gap: 1.5rem; }

.incident-card {
  background: #142116;
  border: 1px solid #1a2a1e;
  border-radius: 20px;
  padding: 1.5rem;
  transition: transform 0.2s;
}
.incident-card:hover { transform: translateX(5px); border-color: #2a3d2e; }

.incident-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.incident-type-wrap { display: flex; gap: 1rem; }

.type-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
}
.type-icon.temp { background: rgba(248, 113, 113, 0.1); color: #f87171; }
.type-icon.delay { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }
.type-icon.status { background: rgba(34, 197, 94, 0.1); color: #4ade80; }

.type-tag { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 0.25rem; display: block; }
.type-tag.temp { color: #f87171; }
.type-tag.delay { color: #fbbf24; }
.type-tag.status { color: #4ade80; }

.incident-id { font-size: 1.1rem; font-weight: 800; margin: 0; color: #e0ead0; }
.incident-time { font-size: 0.7rem; color: #4a6b4a; font-weight: 700; }

.incident-desc { font-size: 0.9rem; color: #8fba8f; line-height: 1.6; margin-bottom: 1.5rem; }
.highlight { color: #e0ead0; font-weight: 800; }

.incident-actions { display: flex; gap: 1rem; }
.resolve-btn {
  background: #c9e265 !important; color: #1a3020 !important;
  border: none !important; font-weight: 800 !important;
  font-size: 0.75rem !important; border-radius: 8px !important;
  padding: 0.5rem 1.25rem !important;
}
.map-btn {
  background: transparent !important; color: #8fba8f !important;
  border: 1px solid #1a2a1e !important; font-weight: 700 !important;
  font-size: 0.75rem !important; border-radius: 8px !important;
}

/* ── Sidebar ── */
.dashboard-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }

.sidebar-card { background: #142116; border: 1px solid #1a2a1e; border-radius: 20px; padding: 1.25rem; }

.sidebar-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.65rem; font-weight: 900; color: #6b8a6b;
  letter-spacing: 0.1em; margin-bottom: 1rem;
}
.header-left-icon { display: flex; align-items: center; gap: 0.5rem; }
.map-region { color: #4a6b4a; font-weight: 700; }

.mini-map {
  height: 180px; border-radius: 12px; overflow: hidden; position: relative;
}
.mini-map img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
.map-point {
  position: absolute; top: 45%; left: 55%;
  width: 10px; height: 10px; background: #c9e265;
  border-radius: 50%; box-shadow: 0 0 10px #c9e265;
}

.notif-list { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1rem; }
.notif-item { display: flex; gap: 1rem; }
.notif-icon { font-size: 1rem; color: #4a6b4a; }
.notif-icon.danger { color: #f87171; }
.notif-body { display: flex; flex-direction: column; gap: 0.2rem; }
.notif-title { font-size: 0.8rem; font-weight: 800; color: #e0ead0; }
.notif-desc { font-size: 0.7rem; color: #8fba8f; line-height: 1.4; }
.notif-time { font-size: 0.6rem; color: #4a6b4a; font-weight: 800; margin-top: 0.25rem; }

.view-history {
  display: block; text-align: center; font-size: 0.75rem;
  font-weight: 800; color: #c9e265; text-decoration: none;
  padding-top: 0.5rem; border-top: 1px solid #1a2a1e;
}

.health-grid { display: flex; flex-direction: column; gap: 1rem; }
.health-row { display: flex; justify-content: space-between; align-items: center; }
.health-label { font-size: 0.75rem; color: #8fba8f; font-weight: 600; }
.health-bars { display: flex; gap: 3px; }
.bar { width: 4px; height: 12px; background: #1a2a1e; border-radius: 1px; }
.bar.active { background: #c9e265; }
.health-val { font-size: 0.8rem; font-weight: 800; color: #c9e265; }
.health-status { font-size: 0.75rem; font-weight: 800; color: #4ade80; display: flex; align-items: center; gap: 0.4rem; }
.health-status .dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 5px #4ade80; }

@media (max-width: 1024px) {
  .dashboard-layout { grid-template-columns: 1fr; }
}
</style>
