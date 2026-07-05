<template>
  <div class="dashboard-page">

    <div class="welcome-banner">
      <div class="banner-text">
        <h1 class="welcome-title">Bienvenido de vuelta, {{ userName }}</h1>
        <p class="welcome-sub">Aquí tienes un resumen operativo de tus fincas y pedidos pendientes para hoy.</p>
      </div>
      <button class="action-btn-main" @click="goToOrders">
        Ver Mis Pedidos <i class="pi pi-arrow-right" style="margin-left: 0.5rem;"></i>
      </button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-lima">
          <i class="pi pi-shopping-cart" style="color: #122216;"></i>
        </div>
        <div class="kpi-info">
          <span class="kpi-value">{{ pendingOrders }}</span>
          <span class="kpi-label">Pedidos Pendientes</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-green">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-info">
          <span class="kpi-value">{{ completedOrders }}</span>
          <span class="kpi-label">Lotes Despachados (Mes)</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-blue">
          <i class="pi pi-verified"></i>
        </div>
        <div class="kpi-info">
          <span class="kpi-value">{{ avgQuality }}%</span>
          <span class="kpi-label">Aprobación de Calidad</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-alert">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="kpi-info">
          <span class="kpi-value">{{ alerts }}</span>
          <span class="kpi-label">Alertas Activas</span>
        </div>
      </div>
    </div>

    <div class="content-grid">

      <div class="table-card">
        <div class="card-header">
          <h2 class="card-title"><i class="pi pi-clock"></i> Acciones Requeridas</h2>
          <button class="ghost-btn" @click="goToOrders">Ver todo</button>
        </div>

        <table class="simple-table">
          <thead>
          <tr>
            <th>ID LOTE</th>
            <th>CLIENTE DESTINO</th>
            <th>ESTADO</th>
            <th>ACCIÓN</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in urgentOrders" :key="order.id">
            <td><strong>{{ order.id }}</strong></td>
            <td>{{ order.client }}</td>
            <td><span class="status-badge" :class="order.badgeClass">{{ order.status }}</span></td>
            <td>
              <button class="table-btn outline" @click="goToOrders">Ir al pedido</button>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="urgentOrders.length === 0" class="empty-state">
          <i class="pi pi-check-square"></i>
          <p>¡Todo al día! No tienes pedidos urgentes por procesar.</p>
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h2 class="card-title"><i class="pi pi-chart-pie"></i> Distribución de Cultivos</h2>
        </div>
        <div class="chart-mock">
          <div class="donut-chart">
            <div class="donut-center">
              <span>25</span>
              <small>Hectáreas</small>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="dot c-lima"></span> Mango Kent (45%)</div>
            <div class="legend-item"><span class="dot c-green"></span> Palta Hass (30%)</div>
            <div class="legend-item"><span class="dot c-blue"></span> Arándanos (25%)</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userName = ref('Carlos Mendoza');
const pendingOrders = ref(3);
const completedOrders = ref(12);
const avgQuality = ref(98);
const alerts = ref(0);

const urgentOrders = ref([
  { id: '#1', client: 'Mercado Central S.A.', status: 'Control Pendiente', badgeClass: 'badge-warning' },
  { id: '#2', client: 'Supermercados Wong', status: 'Control Pendiente', badgeClass: 'badge-warning' }
]);

const goToOrders = () => {
  router.push('/producer/mis-pedidos');
};
</script>

<style scoped>
/* 🌟 COLORES Y VARIABLES FRUITLOGIX */
.dashboard-page { padding: 1.5rem; color: #e0ead0; font-family: 'DM Sans', sans-serif; }

/* BANNER */
.welcome-banner { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #1e2d24 0%, #152219 100%); padding: 2rem; border-radius: 16px; border: 1px solid #2a3d2e; margin-bottom: 2rem; }
.welcome-title { font-size: 1.8rem; font-weight: 700; color: #c9e265; margin: 0 0 0.5rem 0; }
.welcome-sub { margin: 0; color: #8fba8f; font-size: 1rem; }
.action-btn-main { background: #c9e265; color: #122216; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; }
.action-btn-main:hover { background: #dff285; transform: translateY(-2px); }

/* KPIs */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.kpi-card { background: #1a2a1e; border: 1px solid #2a3d2e; border-radius: 12px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: 0.2s; }
.kpi-card:hover { border-color: #3d5c42; transform: translateY(-3px); }
.kpi-icon-wrap { width: 48px; height: 48px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; }
.bg-lima { background: rgba(201, 226, 101, 0.9); }
.bg-green { background: rgba(27, 179, 126, 0.2); color: #1bb37e; border: 1px solid rgba(27, 179, 126, 0.3); }
.bg-blue { background: rgba(85, 166, 248, 0.2); color: #55a6f8; border: 1px solid rgba(85, 166, 248, 0.3); }
.bg-alert { background: rgba(248, 113, 113, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
.kpi-info { display: flex; flex-direction: column; }
.kpi-value { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.kpi-label { font-size: 0.85rem; color: #8fba8f; font-weight: 600; }

/* CONTENT GRID */
.content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
.table-card, .chart-card { background: #1a2a1e; border: 1px solid #2a3d2e; border-radius: 16px; padding: 1.5rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.card-title { font-size: 1.2rem; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
.card-title i { color: #c9e265; }
.ghost-btn { background: transparent; border: none; color: #8fba8f; font-weight: 600; cursor: pointer; transition: 0.2s; }
.ghost-btn:hover { color: #c9e265; }

/* TABLA */
.simple-table { width: 100%; border-collapse: collapse; }
.simple-table th { text-align: left; padding: 1rem 0.5rem; color: #6b8a6b; font-size: 0.8rem; border-bottom: 1px solid #2a3d2e; font-weight: 700; text-transform: uppercase; }
.simple-table td { padding: 1rem 0.5rem; border-bottom: 1px solid #243328; font-size: 0.95rem; }
.table-btn.outline { background: transparent; border: 1px solid #3d5c42; color: #e0ead0; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: 0.2s; }
.table-btn.outline:hover { border-color: #c9e265; color: #c9e265; }

/* ETIQUETAS */
.status-badge { padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }

/* CHART MOCK */
.chart-mock { display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 1rem 0; }
.donut-chart { width: 160px; height: 160px; border-radius: 50%; background: conic-gradient(#c9e265 0% 45%, #1bb37e 45% 75%, #55a6f8 75% 100%); display: flex; justify-content: center; align-items: center; }
.donut-center { width: 120px; height: 120px; background: #1a2a1e; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.donut-center span { font-size: 2rem; font-weight: 800; line-height: 1; }
.donut-center small { color: #8fba8f; font-size: 0.8rem; font-weight: 600; }
.chart-legend { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; }
.legend-item { display: flex; align-items: center; gap: 0.8rem; font-size: 0.9rem; font-weight: 600; color: #b4c9b4; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.c-lima { background: #c9e265; }
.c-green { background: #1bb37e; }
.c-blue { background: #55a6f8; }

.empty-state { text-align: center; padding: 2rem; color: #8fba8f; }
.empty-state i { font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .welcome-banner { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
}
</style>