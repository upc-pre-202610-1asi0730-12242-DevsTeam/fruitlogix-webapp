<template>
  <div class="page-wrapper">
    <div class="header-section">
      <div class="title-area">
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span class="sep">></span>
          <span class="active">Logística y Monitoreo</span>
        </nav>
        <h1 class="page-title">Centro de Control de Flota</h1>
        <p class="page-subtitle">Seguimiento de despachos, IoT y resolución de alertas operativas.</p>
      </div>

      <div class="header-stats">
        <div class="stat-box">
          <span class="stat-label">EN RUTA</span>
          <span class="stat-value">3</span>
        </div>
        <div class="stat-box alert">
          <span class="stat-label">INCIDENCIAS</span>
          <span class="stat-value">{{ activeIncidentsCount }}</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      
      <section class="main-panel">
        
        <div class="tabs-header">
          <button class="tab-btn" :class="{ active: activeTab === 'despachos' }" @click="activeTab = 'despachos'">
            <i class="pi pi-truck" /> Despachos Activos (3)
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'incidencias' }" @click="activeTab = 'incidencias'">
            <i class="pi pi-exclamation-triangle" /> Incidencias <span v-if="activeIncidentsCount > 0" class="badge-error">{{ activeIncidentsCount }}</span>
          </button>
        </div>

        <div v-if="activeTab === 'despachos'" class="tab-content">
          <div class="compact-list">
            <div class="list-row warning-row">
              <div class="client-badge bg-warn">DL</div>
              <div class="row-info">
                <span class="row-client">Distribuidora Lima Sur</span>
                <span class="row-id">#ORD-2024-003</span>
                <span class="row-desc">Conductor: Carlos Ávila • Vehículo: ABC-123</span>
                <div class="mini-timeline">
                  <span class="dot done"></span><span class="line done"></span>
                  <span class="dot done"></span><span class="line pending"></span>
                  <span class="dot pending"></span>
                  <span class="timeline-text">2 de 3 paradas completadas</span>
                </div>
              </div>
              <div class="row-telemetry">
                <span class="tele-item warn"><i class="pi pi-thermometer" /> 5.2°C</span>
                <span class="tele-item"><i class="pi pi-clock" /> ETA: 42 min</span>
              </div>
              <div class="row-actions">
                  <button class="action-btn-circle" title="Contactar Conductor" @click="goToChat('ORD-2024-003')"><i class="pi pi-comments" /></button>
                <button class="action-btn" @click="viewDetails('ORD-2024-003')">Detalle</button>
              </div>
            </div>

            <div class="list-row">
              <div class="client-badge bg-ok">AE</div>
              <div class="row-info">
                <span class="row-client">AgroExport S.A.</span>
                <span class="row-id">#ORD-2024-004</span>
                <span class="row-desc">Conductor: Miguel Torres • Vehículo: XYZ-987</span>
                <div class="mini-timeline">
                  <span class="dot done"></span><span class="line pending"></span>
                  <span class="dot pending"></span><span class="line pending"></span>
                  <span class="dot pending"></span>
                  <span class="timeline-text">En tránsito al destino final</span>
                </div>
              </div>
              <div class="row-telemetry">
                <span class="tele-item ok"><i class="pi pi-thermometer" /> 4.0°C</span>
                <span class="tele-item"><i class="pi pi-clock" /> ETA: 1h 15m</span>
              </div>
              <div class="row-actions">
                  <button class="action-btn-circle" title="Contactar Conductor" @click="goToChat('ORD-2024-004')"><i class="pi pi-comments" /></button>
                <button class="action-btn" @click="viewDetails('ORD-2024-004')">Detalle</button>
              </div>
            </div>
            
            <div class="list-row">
              <div class="client-badge bg-ok">EC</div>
              <div class="row-info">
                <span class="row-client">EcoFrutas</span>
                <span class="row-id">#ORD-2024-005</span>
                <span class="row-desc">Conductor: Luis Silva • Vehículo: DEF-456</span>
                <div class="mini-timeline">
                  <span class="dot done"></span><span class="line done"></span>
                  <span class="dot done"></span><span class="line done"></span>
                  <span class="dot pending"></span>
                  <span class="timeline-text">Aproximándose al muelle de descarga</span>
                </div>
              </div>
              <div class="row-telemetry">
                <span class="tele-item ok"><i class="pi pi-thermometer" /> 3.8°C</span>
                <span class="tele-item"><i class="pi pi-clock" /> ETA: 10 min</span>
              </div>
              <div class="row-actions">
                  <button class="action-btn-circle" title="Contactar Conductor" @click="goToChat('ORD-2024-005')"><i class="pi pi-comments" /></button>
                <button class="action-btn" @click="viewDetails('ORD-2024-005')">Detalle</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'incidencias'" class="tab-content">
          <div class="incident-list">
            
            <div class="incident-card" :class="inc1Resolved ? 'resolved' : 'critical'">
              <div class="incident-header">
                <div class="incident-type-wrap">
                  <div class="type-icon"><i :class="inc1Resolved ? 'pi pi-check' : 'pi pi-thermometer'" /></div>
                  <div class="type-info">
                    <span class="type-tag">{{ inc1Resolved ? 'INCIDENCIA RESUELTA' : 'DESVIACIÓN TÉRMICA' }}</span>
                    <h3 class="incident-id">Pedido #ORD-2024-003: Carga de Mango Kent</h3>
                  </div>
                </div>
                <span class="incident-time">{{ inc1Resolved ? 'Cerrado' : 'Hace 5 min' }}</span>
              </div>
              <p class="incident-desc" v-if="!inc1Resolved">
                Sensor crítico en contenedor detectó un pico térmico de <span class="highlight">5.2°C</span> (Umbral máx: 4.5°C). Origen de la lectura: Unidad de refrigeración principal.
              </p>
              <div class="incident-actions" v-if="!inc1Resolved">
                <button class="resolve-btn" @click="inc1Resolved = true"><i class="pi pi-check-circle" /> Marcar como Resuelto</button>
                <button class="map-btn"><i class="pi pi-comments" /> Hablar con Conductor</button>
              </div>
            </div>

            <div class="incident-card" :class="inc2Resolved ? 'resolved' : 'warning'">
              <div class="incident-header">
                <div class="incident-type-wrap">
                  <div class="type-icon"><i :class="inc2Resolved ? 'pi pi-check' : 'pi pi-truck'" /></div>
                  <div class="type-info">
                    <span class="type-tag">{{ inc2Resolved ? 'INCIDENCIA RESUELTA' : 'RETRASO DE RUTA' }}</span>
                    <h3 class="incident-id">Envío #ORD-2024-005: Espárragos</h3>
                  </div>
                </div>
                <span class="incident-time">{{ inc2Resolved ? 'Cerrado' : 'Hace 18 min' }}</span>
              </div>
              <p class="incident-desc" v-if="!inc2Resolved">
                Retraso reportado automáticamente por sistema GPS debido a congestión en la Panamericana Sur. ETA desplazado <span class="highlight">+25 minutos</span>.
              </p>
              <div class="incident-actions" v-if="!inc2Resolved">
                <button class="resolve-btn" @click="inc2Resolved = true"><i class="pi pi-check-circle" /> Marcar como Resuelto</button>
              </div>
            </div>
            
          </div>
        </div>

      </section>

      <aside class="monitoring-panel">
        
        <div class="map-container">
          <div class="map-overlay-header">
            <i class="pi pi-map-marker"/>
            <span>MAPA EN VIVO</span>
          </div>
          
          <div class="map-background-wrapper">
            <live-tracking-map 
              origin-label="SANTA ANITA" 
              destination-label="PUERTO CALLAO" 
              :total-km="42.5" 
            />
          </div>

          <div class="map-markers">
            <div class="map-pin truck alert-pin" style="top: 30%; left: 40%;" :class="{'resolved-pin': inc1Resolved}">#003</div>
            <div class="map-pin truck" style="top: 55%; left: 65%;">#004</div>
            <div class="map-pin truck" style="top: 75%; left: 45%;" :class="{'alert-pin': !inc2Resolved && activeTab === 'incidencias', 'resolved-pin': inc2Resolved}">#005</div>
          </div>
        </div>

        <div class="telemetry-panel">
          <h3 class="panel-subtitle"><i class="pi pi-bell" /> NOTIFICACIONES RÁPIDAS</h3>
          <div class="alerts-list">
            <div class="alert-item">
              <div class="alert-icon info-blue"><i class="pi pi-info-circle"/></div>
              <div class="alert-content">
                <span class="alert-title">Mantenimiento de Muelle</span>
                <span class="alert-desc">Muelle de descarga B inactivo hasta las 18:00 hrs.</span>
              </div>
            </div>
            <div class="alert-item">
              <div class="alert-icon info-green"><i class="pi pi-user-plus"/></div>
              <div class="alert-content">
                <span class="alert-title">Nuevo Perfil Creado</span>
                <span class="alert-desc">Productor 'Finca El Paraíso' completó su registro.</span>
              </div>
            </div>
          </div>
        </div>

      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// 🟢 Importamos el componente del mapa inteligente
import LiveTrackingMap from '../../../shared/presentation/components/live-tracking-map.vue';

const router = useRouter();

// Control del sistema de Tabs
const activeTab = ref('despachos'); 

// Control reactivo de resolución de incidencias
const inc1Resolved = ref(false);
const inc2Resolved = ref(false);

// 🟢 La función que conecta los botones con el chat
const goToChat = (orderId) => {
  router.push({ 
    name: 'distributor-chat', 
    query: { orderId: orderId } 
  });
};

const activeIncidentsCount = computed(() => {
  let count = 0;
  if (!inc1Resolved.value) count++;
  if (!inc2Resolved.value) count++;
  return count;
});

// Enrutador con el ID global idéntico
function viewDetails(orderId) {
  // Redirige a la vista delivery-details.view.vue usando su 'name'
  router.push({ 
    name: 'delivery-details', // 🟢 Asegúrate de que este nombre coincida con tu archivo routes.js
    params: { id: orderId } 
  });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem 5rem;
  background: #E1EBE1;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ── Header ─────────────────────────────────── */
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
  min-width: 110px;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.stat-box.alert { border-color: rgba(192, 57, 43, 0.3); } 
.stat-label { font-size: 0.65rem; font-weight: 800; color: #D4E952; letter-spacing: 0.1em; }
.stat-box.alert .stat-label { color: #fca5a5; }
.stat-value { font-size: 1.8rem; font-weight: 900; color: #FFFFFF; }

/* ── Dashboard Grid ─────────────────────────── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 400px;
  gap: 2rem;
  align-items: start;
}

/* ── Tab System ─────────────────────────────── */
.tabs-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(26, 48, 32, 0.1);
  padding-bottom: 0;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  color: #6b8a6b;
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px; 
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.tab-btn:hover { color: #1a3020; }
.tab-btn.active { color: #1a3020; border-bottom-color: #1a3020; }

.badge-error {
  background: #C0392B; 
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  margin-left: 4px;
}

/* ── Tab 1: Despachos Compactos ─────────────── */
.compact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-row {
  background: #1e2d22;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.15s, border-color 0.15s;
}

.list-row:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 233, 82, 0.3);
}

.warning-row {
  border-left: 3px solid #C0392B !important; 
  background: #1e2d22; 
}

.client-badge {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 800;
  flex-shrink: 0;
}
.bg-warn { background: rgba(192, 57, 43, 0.15); color: #e74c3c; }
.bg-ok   { background: rgba(212, 233, 82, 0.15); color: #D4E952; }

.row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.row-client { font-size: 0.7rem; font-weight: 800; color: #9ab39d; text-transform: uppercase; letter-spacing: 0.05em; }
.row-id { font-size: 1.1rem; font-weight: 800; color: #FFFFFF; line-height: 1.2; }
.row-desc { font-size: 0.75rem; color: #8fba8f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;}

.mini-timeline {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.5rem;
}
.mini-timeline .dot { width: 6px; height: 6px; border-radius: 50%; }
.mini-timeline .dot.done { background: #D4E952; }
.mini-timeline .dot.pending { background: rgba(255,255,255,0.15); }
.mini-timeline .line { height: 2px; width: 16px; border-radius: 2px; }
.mini-timeline .line.done { background: #D4E952; }
.mini-timeline .line.pending { background: rgba(255,255,255,0.1); }
.timeline-text { font-size: 0.7rem; color: #D4E952; font-weight: 700; margin-left: 8px; }
.warning-row .timeline-text { color: #fca5a5; }

.row-telemetry {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-end;
  min-width: 100px;
}

.tele-item {
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
}
.tele-item i { font-size: 0.8rem; }
.tele-item.ok { color: #D4E952; }
.tele-item.warn { color: #f87171; }

.row-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  border-left: 1px dashed rgba(255,255,255,0.1);
}

.action-btn-circle {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #FFFFFF;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.action-btn-circle:hover { background: #D4E952; color: #121212; border-color: #D4E952; }

.action-btn {
  background: transparent;
  color: #D4E952;
  border: 1px solid #D4E952;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.action-btn:hover { background: #D4E952; color: #121212; }

/* ── Tab 2: Incidencias ─────────────────────── */
.incident-list { display: flex; flex-direction: column; gap: 1.5rem; }

.incident-card {
  background: #1e2d22;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.incident-card.critical { border-left: 3px solid #C0392B; }
.incident-card.warning { border-left: 3px solid #fbbf24; }

.incident-card.resolved {
  border-left: 3px solid #4a6b4a;
  background: #142116;
  opacity: 0.75;
}
.incident-card.resolved .type-icon { background: rgba(255,255,255,0.05); color: #4a6b4a; }
.incident-card.resolved .type-tag { color: #4a6b4a; }
.incident-card.resolved .incident-id { color: #6b8a6b; text-decoration: line-through; }
.incident-card.resolved .incident-time { color: #4a6b4a; }

.incident-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.incident-type-wrap { display: flex; gap: 1rem; }

.type-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
}
.critical .type-icon { background: rgba(192, 57, 43, 0.15); color: #e74c3c; }
.warning .type-icon { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.type-tag { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 0.25rem; display: block; }
.critical .type-tag { color: #e74c3c; }
.warning .type-tag { color: #fbbf24; }

.incident-id { font-size: 1.1rem; font-weight: 800; margin: 0; color: #FFFFFF; }
.incident-time { font-size: 0.75rem; color: #9ab39d; font-weight: 700; }

.incident-desc { font-size: 0.9rem; color: #9ab39d; line-height: 1.6; margin-bottom: 1.5rem; }
.highlight { color: #FFFFFF; font-weight: 800; }

.incident-actions { display: flex; gap: 1rem; }
.resolve-btn {
  background: #D4E952; color: #1a3020;
  border: none; font-weight: 800;
  font-size: 0.8rem; border-radius: 8px;
  padding: 0.6rem 1.25rem; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  font-family: inherit; transition: all 0.2s;
}
.resolve-btn:hover { background: #e2f57a; }

.map-btn {
  background: transparent; color: #FFFFFF;
  border: 1px solid rgba(255,255,255,0.2); font-weight: 700;
  font-size: 0.8rem; border-radius: 8px;
  padding: 0.6rem 1.25rem; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  font-family: inherit; transition: background 0.2s;
}
.map-btn:hover { background: rgba(255,255,255,0.05); }


/* ── Right Panel: Map & Notifs ──────────────── */
.monitoring-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 1.5rem;
}

.map-container {
  height: 380px;
  background: #1e2d22;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.05);
}

.map-overlay-header {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(30, 45, 34, 0.85);
  backdrop-filter: blur(8px);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #D4E952;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  z-index: 5;
  border: 1px solid rgba(212, 233, 82, 0.2);
}

/* 🟢 ESTILOS NECESARIOS PARA EL MAPA INTERACTIVO */
.map-background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-markers {
  z-index: 6; 
  position: absolute; 
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.map-pin {
  position: absolute;
  background: #D4E952;
  color: #1a3020;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s;
}
.map-pin.alert-pin { background: #C0392B; color: white; animation: pulse 2s infinite; }
.map-pin.resolved-pin { background: #4a6b4a; color: white; opacity: 0.7; } 

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(192, 57, 43, 0); }
  100% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0); }
}

.telemetry-panel {
  background: #1e2d22;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.panel-subtitle {
  font-size: 0.75rem;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-subtitle i { color: #D4E952; }

.alerts-list { display: flex; flex-direction: column; gap: 1rem; }

.alert-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.alert-icon { 
  font-size: 1rem; 
  width: 32px; height: 32px; 
  border-radius: 8px; 
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.info-blue { background: rgba(96, 165, 250, 0.1); color: #60a5fa; }
.info-green { background: rgba(34, 197, 94, 0.1); color: #4ade80; }

.alert-content { display: flex; flex-direction: column; gap: 0.2rem; }
.alert-title { font-size: 0.8rem; font-weight: 800; color: #FFFFFF; }
.alert-desc  { font-size: 0.75rem; color: #9ab39d; line-height: 1.4; }

@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .monitoring-panel { position: static; }
}
@media (max-width: 768px) {
  .list-row { flex-direction: column; align-items: stretch; gap: 1rem; }
  .row-actions { border-left: none; padding-left: 0; padding-top: 1rem; border-top: 1px dashed rgba(255,255,255,0.1); justify-content: flex-end; }
  .row-telemetry { align-items: flex-start; flex-direction: row; gap: 1rem; }
}
</style>