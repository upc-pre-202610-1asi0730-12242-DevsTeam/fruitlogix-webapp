<template>
  <div class="dashboard-wrapper">
    <div class="welcome-row">
      <div>
        <h1 class="welcome-title">{{ t('dashboard.welcome') }} Carlos</h1>
        <p class="welcome-sub">{{ t('dashboard.command_center') }}</p>
      </div>
      <div class="header-date">
        <i class="pi pi-calendar" />
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div class="top-section">
      <div class="qa-buttons">
        <button class="qa-btn qa-btn-lime" @click="router.push('/order-management/orders')">
          <div class="qa-btn-icon"><i class="pi pi-users" /></div>
          <span class="qa-btn-label">{{ t('dashboard.qa_assign') }}</span>
          <span class="qa-btn-desc">{{ t('dashboard.qa_assign_desc') }}</span>
        </button>
        <button class="qa-btn qa-btn-lime" @click="router.push('/logistics-monitoring')">
          <div class="qa-btn-icon"><i class="pi pi-truck" /></div>
          <span class="qa-btn-label">{{ t('dashboard.qa_dispatch') }}</span>
          <span class="qa-btn-desc">{{ t('dashboard.qa_dispatch_desc') }}</span>
        </button>
        <button class="qa-btn qa-btn-danger" @click="router.push('/iot-infrastructure')">
          <div class="qa-btn-icon"><i class="pi pi-wifi" /></div>
          <span class="qa-btn-label">{{ t('dashboard.qa_alerts') }}</span>
          <span class="qa-btn-desc">{{ t('dashboard.qa_alerts_desc') }}</span>
        </button>
      </div>

      <div class="metric-cards">
        <div class="stat-card">
          <div class="card-head">
            <div class="icon-box"><i class="pi pi-box" /></div>
            <span class="trend-badge positive">+12.5%</span>
          </div>
          <div class="card-body">
            <span class="stat-label">{{ t('dashboard.active_orders') }}</span>
            <h2 class="stat-value" v-if="!isLoading">{{ activeOrdersCount }}</h2>
            <i v-else class="pi pi-spin pi-spinner stat-value" style="font-size: 1.5rem;"></i>
            <div class="progress-bar"><div class="progress-fill" :style="{ width: '65%' }"></div></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="card-head">
            <div class="icon-box"><i class="pi pi-truck" /></div>
            <div class="eta-box">
              <span class="eta-label">{{ t('dashboard.eta_average') }}</span>
              <span class="eta-value">42 min</span>
            </div>
          </div>
          <div class="card-body">
            <span class="stat-label">{{ t('dashboard.daily_deliveries') }}</span>
            <h2 class="stat-value" v-if="!isLoading">{{ activeDeliveriesCount }}<span class="stat-total">/92</span></h2>
            <i v-else class="pi pi-spin pi-spinner stat-value" style="font-size: 1.5rem;"></i>
            <div class="multi-progress">
              <div class="p-segment active"></div>
              <div class="p-segment active"></div>
              <div class="p-segment active"></div>
              <div class="p-segment"></div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="card-head">
            <div class="icon-box"><i class="pi pi-verified" /></div>
            <span class="status-pill green">{{ t('dashboard.optimal') }}</span>
          </div>
          <div class="card-body">
            <span class="stat-label">{{ t('dashboard.product_quality') }}</span>
            <h2 class="stat-value">98.4%</h2>
            <div class="avatar-group">
              <div class="avatar-circle">JM</div>
              <div class="avatar-circle secondary">RL</div>
              <span class="group-note">{{ t('dashboard.quality_note') }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card iot-card" :class="activeIncidents.length > 0 ? 'alert-danger' : ''">
          <div class="card-head">
            <div class="icon-box iot-icon"><i class="pi pi-wifi" /></div>
          </div>
          <div class="card-body">
            <span class="stat-label">{{ t('dashboard.iot_alerts') }}</span>
            <h2 class="stat-value" v-if="!isLoading">{{ activeIncidents.length }}</h2>
            <i v-else class="pi pi-spin pi-spinner stat-value" style="font-size: 1.5rem;"></i>
            <div class="iot-progress">
              <div class="iot-bar warning"></div>
              <div class="iot-bar"></div>
              <div class="iot-bar"></div>
              <div class="iot-bar"></div>
              <div class="iot-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle-section">
      <div class="chart-card action-center">
        <div class="action-header">
          <div class="action-header-left">
            <div class="action-icon-wrap"><i class="pi pi-exclamation-triangle" /></div>
            <div>
              <h3>{{ t('dashboard.action_center') }}</h3>
              <p class="action-sub">Live system incidents & alerts</p>
            </div>
          </div>
          <span v-if="activeIncidents.length > 0" class="live-badge"><span class="live-dot"></span> LIVE</span>
        </div>
        <div class="action-list">
          <div v-if="isLoading" style="text-align: center; color: #8fba8f; padding: 1rem;">
            <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem;"></i>
          </div>
          <div v-else-if="activeIncidents.length === 0" style="text-align: center; color: #8fba8f; padding: 1rem;">
            <i class="pi pi-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            {{ t('dashboard.no_alerts') }}
          </div>
          <div v-else v-for="action in mappedIncidents" :key="action.id" class="action-item alert">
            <div class="action-item-icon">
              <i class="pi pi-flag-fill" />
            </div>
            <div class="action-item-content">
              <div class="action-item-header">
                <span class="action-item-title">{{ action.title }}</span>
                <span class="action-item-time">{{ t('dashboard.requires_attention') }}</span>
              </div>
              <p class="action-item-desc">{{ action.description }}</p>
              <button class="action-item-btn btn-warning" @click="router.push('/logistics-monitoring')">
                {{ t('dashboard.resolve_logistics') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="card-header">
          <div class="table-title-row">
            <div class="table-icon-wrap"><i class="pi pi-exclamation-circle" /></div>
            <h3>{{ t('dashboard.urgent_orders') }}</h3>
          </div>
          <span class="urgent-count">{{ urgentOrdersList.length }} {{ t('dashboard.issues') }}</span>
        </div>
        <div class="custom-table-wrap">
          <table class="recent-table">
            <thead>
            <tr>
              <th>{{ t('dashboard.table.order_id') }}</th>
              <th>{{ t('dashboard.table.client') }}</th>
              <th>{{ t('dashboard.table.status') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="isLoading">
              <td colspan="3" style="text-align: center;"><i class="pi pi-spin pi-spinner"></i></td>
            </tr>
            <tr v-else v-for="order in urgentOrdersList" :key="order.id" class="clickable-row" @click="goToOrder(order.id)">
              <td class="id-col">#ORD-{{ order.id }}</td>
              <td class="client-col">Cliente #{{ order.commercialClientId }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(order.status)]">{{ order.status }}</span>
              </td>
            </tr>
            <tr v-if="!isLoading && urgentOrdersList.length === 0">
              <td colspan="3" style="text-align: center; color: #8fba8f;">No hay pedidos urgentes</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="view-all-wrap">
          <button class="view-all" @click="goToOrders">
            {{ t('dashboard.view_all_orders') }} <i class="pi pi-arrow-right" />
          </button>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="chart-card volume-chart">
        <div class="card-header">
          <div class="title-wrap">
            <h3>{{ t('dashboard.weekly_volume') }}</h3>
            <p>{{ t('dashboard.weekly_volume_note') }}</p>
          </div>
          <div class="time-filters">
            <button class="filter-btn" :class="{ active: activeTimeFilter === '7d' }" @click="activeTimeFilter = '7d'">7 Días</button>
            <button class="filter-btn" :class="{ active: activeTimeFilter === '30d' }" @click="activeTimeFilter = '30d'">30 Días</button>
          </div>
        </div>
        <div class="chart-container">
          <pv-chart type="bar" :data="barData" :options="barOptions" class="h-15rem" />
        </div>
      </div>

      <div class="chart-card status-chart">
        <h3>{{ t('dashboard.status_title') }}</h3>
        <p>{{ t('dashboard.status_note') }}</p>
        <div class="donut-container">
          <pv-chart type="doughnut" :data="donutData" :options="donutOptions" class="h-10rem" />
          <div class="donut-center">
            <span class="pct">{{ compliancePct }}%</span>
            <span class="lbl">{{ t('dashboard.complied') }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><span class="dot entregados"></span> {{ t('dashboard.delivered') }} <span class="val" v-if="!isLoading">{{ orderStatusStats.delivered }}</span></div>
          <div class="legend-item"><span class="dot camino"></span> {{ t('dashboard.in_transit') }} <span class="val" v-if="!isLoading">{{ orderStatusStats.inTransit }}</span></div>
          <div class="legend-item"><span class="dot pendientes"></span> {{ t('dashboard.pending') }} <span class="val" v-if="!isLoading">{{ orderStatusStats.pending }}</span></div>
        </div>
      </div>

      <div class="deliveries-card">
        <div class="card-header">
          <h3>{{ t('dashboard.ongoing_deliveries') }}</h3>
        </div>
        <div class="delivery-list">
          <div v-if="isLoading" style="text-align: center; color: #8fba8f; padding: 1rem;"><i class="pi pi-spin pi-spinner"></i></div>
          <div v-else-if="ongoingDeliveriesList.length === 0" style="color: #8fba8f; text-align: center; padding: 1rem;">No hay despachos activos.</div>
          <div v-else v-for="delivery in ongoingDeliveriesList" :key="delivery.id" class="delivery-item">
            <div class="delivery-icon-box">
              <i class="pi pi-truck" />
            </div>
            <div class="delivery-info">
              <span class="delivery-order">#ORD-{{ delivery.orderId }}</span>
              <span class="delivery-driver">{{ t('dashboard.driver') }}: {{ delivery.driverName || 'Conductor' }}</span>
            </div>
            <span class="delivery-eta">{{ t('dashboard.arrives_in', { n: 45 }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { BaseApi } from '../../../shared/infrastructure/base-api.js';

const router = useRouter();
const { t } = useI18n();
const api = new BaseApi();

const activeTimeFilter = ref('7d');
const isLoading = ref(true);

const realOrders = ref([]);
const realDeliveries = ref([]);
const realIncidents = ref([]);

const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

onMounted(async () => {
  await fetchDashboardData();
});

async function fetchDashboardData() {
  isLoading.value = true;
  try {
    // URLs relativas y limpias
    const [ordersRes, deliveriesRes, incidentsRes] = await Promise.all([
      api.http.get('/orders'),
      api.http.get('/deliveries'),
      api.http.get('/incidents')
    ]);

    realOrders.value = ordersRes.data || [];
    realDeliveries.value = deliveriesRes.data || [];
    realIncidents.value = incidentsRes.data || [];
  } catch (error) {
    console.error("Error cargando APIs de Render:", error);
  } finally {
    isLoading.value = false;
  }
}

const activeOrdersCount = computed(() => {
  return realOrders.value.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
});

const activeDeliveriesCount = computed(() => {
  return realDeliveries.value.filter(d => d.currentStatus === 'IN_TRANSIT' || d.currentStatus === 'DELAYED').length;
});

const activeIncidents = computed(() => {
  return realIncidents.value.filter(i => i.status !== 'Resolved' && i.status !== 'Resuelto');
});

const mappedIncidents = computed(() => {
  return activeIncidents.value.map(inc => ({
    id: inc.id,
    title: `Alerta en Lote/Pedido #${inc.batchId || 'N/A'}`,
    description: inc.description || 'Se detectó una desviación operativa. Se requiere inspección inmediata.',
  }));
});

const urgentOrdersList = computed(() => {
  const problems = realOrders.value.filter(o => o.status === 'Pending' || o.status === 'InPreparation');
  return problems.slice(-3).reverse();
});

const ongoingDeliveriesList = computed(() => {
  return realDeliveries.value.filter(d => d.currentStatus === 'IN_TRANSIT').slice(0, 3);
});

const orderStatusStats = computed(() => {
  return {
    delivered: realOrders.value.filter(o => o.status === 'Delivered').length || 0,
    inTransit: realOrders.value.filter(o => o.status === 'InTransit').length || 0,
    pending: realOrders.value.filter(o => o.status === 'Pending' || o.status === 'InPreparation').length || 0
  };
});

const getStatusClass = (status) => {
  if (!status) return 'badge-gray';
  const s = status.toLowerCase();
  if (s === 'delivered') return 'badge-green';
  if (s === 'intransit') return 'badge-yellow';
  if (s === 'pending' || s === 'inpreparation') return 'badge-red';
  return 'badge-gray';
};

function goToOrders() { router.push('/order-management/orders'); }
function goToOrder(id) { router.push('/order-management/orders'); }

const barData = computed(() => ({
  labels: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
  datasets: [{ label: 'Volumen', backgroundColor: '#c9e265', data: [120, 190, 150, 250, 220, 100, 50], borderRadius: 6 }]
}));
const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#6b8a6b', font: { weight: '700', size: 11 } } }, y: { grid: { color: '#2a3d2e' }, border: { display: false }, ticks: { display: false } } }, maintainAspectRatio: false };

const donutData = computed(() => ({
  labels: ['Entregados', 'En Camino', 'Pendientes'],
  datasets: [{ data: [orderStatusStats.value.delivered, orderStatusStats.value.inTransit, orderStatusStats.value.pending], backgroundColor: ['#c9e265', '#8fba8f', '#3d5c42'], borderWidth: 0, cutout: '75%' }]
}));
const donutOptions = { plugins: { legend: { display: false } }, maintainAspectRatio: false };

const compliancePct = computed(() => {
  const { delivered, inTransit, pending } = orderStatusStats.value;
  const total = delivered + inTransit + pending;
  return total > 0 ? Math.round((delivered / total) * 100) : 0;
});
</script>

<style scoped>
/* REEMPLAZA ESTE BLOQUE CON TU CSS COMPLETO ORIGINAL (Pega todo el CSS que me enviaste en tu mensaje aquí, sin modificar). */
.dashboard-wrapper {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #E1EBE1;
  min-height: 100%;
}

/* ── Welcome Row ── */
.welcome-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;
}

.welcome-sub {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #3d5c42;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #3d5c42;
  background: rgba(30, 45, 34, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.header-date i {
  color: #1a3020;
}

h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
p { margin: 4px 0 0; font-size: 0.8rem; color: #8fba8f; }

/* ═══════════════════════════════════════════ */
/* TOP SECTION: Quick Actions + Metrics      */
/* ═══════════════════════════════════════════ */
.top-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Quick Actions Buttons (standalone cards, no wrapper) ── */
.qa-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.qa-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  border: none;
  border-radius: 14px;
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.qa-btn:hover {
  transform: translateY(-3px);
}

.qa-btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  transition: transform 0.2s ease;
}

.qa-btn:hover .qa-btn-icon {
  transform: scale(1.05);
}

.qa-btn-label {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.qa-btn-desc {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.3;
}

/* Variant: Assign Producer / Dispatch Fleet — lima */
.qa-btn-lime {
  background: #c9e265;
  box-shadow: 0 4px 14px rgba(201, 226, 101, 0.25);
}

.qa-btn-lime:hover {
  filter: brightness(0.96);
  box-shadow: 0 8px 22px rgba(201, 226, 101, 0.35);
}

.qa-btn-lime .qa-btn-icon {
  background: rgba(26, 48, 32, 0.12);
  color: #1a3020;
}

.qa-btn-lime .qa-btn-label {
  color: #1a3020;
}

.qa-btn-lime .qa-btn-desc {
  color: rgba(26, 48, 32, 0.65);
}

/* Variant: Resolve IoT Alerts — rojo oscuro */
.qa-btn-danger {
  background: #8c2b29;
  box-shadow: 0 4px 14px rgba(140, 43, 41, 0.3);
}

.qa-btn-danger:hover {
  filter: brightness(1.08);
  box-shadow: 0 8px 22px rgba(140, 43, 41, 0.4);
}

.qa-btn-danger .qa-btn-icon {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.qa-btn-danger .qa-btn-label {
  color: #fff;
}

.qa-btn-danger .qa-btn-desc {
  color: rgba(255, 255, 255, 0.75);
}

/* ── Metric Cards Row ── */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.stat-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.icon-box {
  width: 40px;
  height: 40px;
  background: #2a3d2e;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9e265;
  font-size: 1.2rem;
}

.iot-icon {
  background: rgba(201, 226, 101, 0.15);
}

/* Red Alert state for IoT card */
.stat-card.alert-danger {
  background: #8c2b29;
  border-color: #c53030;
}
.stat-card.alert-danger .stat-label,
.stat-card.alert-danger .stat-value {
  color: #fff;
}
.stat-card.alert-danger .iot-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.stat-card.alert-danger .iot-bar {
  background: rgba(255, 255, 255, 0.3);
}
.stat-card.alert-danger .iot-bar.warning {
  background: #fff;
}

.trend-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(201, 226, 101, 0.1);
  color: #c9e265;
  border: 1px solid rgba(201, 226, 101, 0.2);
}

.status-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  color: #8fba8f;
  border: 1px solid #3d5c42;
}

.eta-box {
  text-align: right;
}

.eta-label { font-size: 0.6rem; font-weight: 800; color: #8fba8f; display: block; letter-spacing: 0.05em; }
.eta-value { font-size: 0.85rem; font-weight: 800; color: #c9e265; }

.stat-label { font-size: 0.75rem; font-weight: 700; color: #8fba8f; letter-spacing: 0.05em; }
.stat-value { font-size: 2rem; font-weight: 800; color: #e0ead0; margin: 0.25rem 0 1rem; letter-spacing: -0.02em; }
.stat-total { font-size: 1rem; color: #6b8a6b; font-weight: 600; }

.progress-bar { height: 4px; background: #2a3d2e; border-radius: 2px; }
.progress-fill { height: 100%; background: #c9e265; border-radius: 2px; transition: width 0.6s ease; }

.avatar-group { display: flex; align-items: center; gap: 0.5rem; }
.avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #3d5c42;
  color: #c9e265;
  font-size: 0.55rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1e2d22;
}
.avatar-circle.secondary { background: #2a3d2e; color: #8fba8f; margin-left: -10px; }
.group-note { font-size: 0.65rem; color: #6b8a6b; }

.multi-progress { display: flex; gap: 4px; }
.p-segment { flex: 1; height: 4px; background: #2a3d2e; border-radius: 2px; }
.p-segment.active { background: #c9e265; }

/* ── IoT card progress ── */
.iot-progress {
  display: flex;
  gap: 3px;
}

.iot-bar {
  flex: 1;
  height: 4px;
  background: #2a3d2e;
  border-radius: 2px;
}

.iot-bar.warning {
  background: #c9e265;
}

/* ═══════════════════════════════════════════ */
/* MIDDLE SECTION: Action Center + Table     */
/* ═══════════════════════════════════════════ */
.middle-section {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.25rem;
}

/* ── Action Center ── */
.chart-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}

.action-center {
  display: flex;
  flex-direction: column;
}

.action-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.action-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(242, 95, 92, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f25f5c;
  font-size: 1.1rem;
}

.action-sub {
  margin: 2px 0 0;
  font-size: 0.72rem;
  color: #6b8a6b;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6rem;
  font-weight: 800;
  color: #f25f5c;
  background: rgba(242, 95, 92, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(242, 95, 92, 0.2);
  letter-spacing: 0.08em;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f25f5c;
  animation: livePulse 1.5s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.action-item {
  display: flex;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 12px;
  background: #243a28;
  border: 1px solid #2a3d2e;
  transition: background 0.2s ease;
}

.action-item:hover {
  background: #2a4430;
}

.action-item.alert {
  border-left: 3px solid #f25f5c;
}

.action-item.info {
  border-left: 3px solid #8fba8f;
}

.action-item.success {
  border-left: 3px solid #1bb37e;
}

.action-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.action-item.alert .action-item-icon {
  background: rgba(242, 95, 92, 0.15);
  color: #f25f5c;
}

.action-item.info .action-item-icon {
  background: rgba(143, 186, 143, 0.15);
  color: #8fba8f;
}

.action-item.success .action-item-icon {
  background: rgba(27, 179, 126, 0.15);
  color: #1bb37e;
}

.action-item-content {
  flex: 1;
  min-width: 0;
}

.action-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.action-item-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: #e0ead0;
}

.action-item-time {
  font-size: 0.65rem;
  font-weight: 600;
  color: #6b8a6b;
  flex-shrink: 0;
}

.action-item-desc {
  margin: 0;
  font-size: 0.75rem;
  color: #8fba8f;
  line-height: 1.4;
}

.action-item-btn {
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-warning {
  background: rgba(242, 95, 92, 0.2);
  color: #f25f5c;
  border: 1px solid rgba(242, 95, 92, 0.3);
}

.btn-warning:hover {
  background: rgba(242, 95, 92, 0.35);
}

/* ── Table Card ── */
.table-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}

.table-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-title-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.table-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(242, 95, 92, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f25f5c;
  font-size: 1rem;
}

.urgent-count {
  font-size: 0.7rem;
  font-weight: 800;
  color: #f25f5c;
  background: rgba(242, 95, 92, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(242, 95, 92, 0.2);
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th {
  text-align: left;
  font-size: 0.65rem;
  font-weight: 800;
  color: #6b8a6b;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #2a3d2e;
  letter-spacing: 0.05em;
}

.recent-table td {
  padding: 1.25rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #e0ead0;
}

/* ── Clickable Rows ── */
.clickable-row {
  cursor: pointer;
  transition: background 0.2s ease;
}

.clickable-row:hover {
  background: #243528;
}

.clickable-row td {
  border-bottom: 1px solid #2a3d2e;
}

.id-col { color: #e0ead0; font-weight: 800 !important; }
.client-col { color: #8fba8f; }

.status-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
}

.badge-green { background: rgba(27, 179, 126, 0.1); color: #1bb37e; }
.badge-yellow { background: rgba(201, 226, 101, 0.1); color: #c9e265; }
.badge-red { background: rgba(242, 95, 92, 0.1); color: #f25f5c; }
.badge-gray { background: rgba(255, 255, 255, 0.1); color: #8fba8f; }

.view-all-wrap {
  display: flex;
  justify-content: center;
  padding-top: 1.25rem;
  border-top: 1px solid #2a3d2e;
  margin-top: 0.5rem;
}

.view-all {
  background: transparent;
  border: none;
  color: #c9e265;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.view-all:hover {
  color: #d6ec6e;
  gap: 0.75rem;
}

/* ═══════════════════════════════════════════ */
/* BOTTOM SECTION: Charts + Deliveries       */
/* ═══════════════════════════════════════════ */
.bottom-section {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr;
  gap: 1.25rem;
}

.chart-card.volume-chart {
  display: flex;
  flex-direction: column;
}

.chart-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.time-filters {
  display: flex;
  background: #121b14;
  padding: 3px;
  border-radius: 8px;
}

.filter-btn {
  border: none;
  background: transparent;
  padding: 4px 12px;
  color: #6b8a6b;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #2a3d2e;
  color: #e0ead0;
}

.chart-container {
  height: 200px;
  position: relative;
  flex: 1;
}

/* ── Donut Chart ── */
.status-chart {
  display: flex;
  flex-direction: column;
}

.donut-container {
  position: relative;
  height: 140px;
  margin: 1.5rem auto;
}

.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.donut-center .pct { font-size: 1.2rem; font-weight: 800; color: #e0ead0; }
.donut-center .lbl { font-size: 0.5rem; font-weight: 800; color: #8fba8f; letter-spacing: 0.05em; }

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #8fba8f;
  font-weight: 600;
}

.dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 10px; }
.entregados { background: #c9e265; }
.camino { background: #8fba8f; }
.pendientes { background: #3d5c42; }

.legend-item .val { margin-left: auto; color: #e0ead0; }

/* ── Deliveries Card ── */
.deliveries-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
}

.deliveries-card .card-header {
  margin-bottom: 1.25rem;
}

.delivery-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 12px;
  background: #243a28;
  border: 1px solid #2a3d2e;
  transition: background 0.2s ease;
}

.delivery-item:hover {
  background: #2a4430;
}

.delivery-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(143, 186, 143, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8fba8f;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.delivery-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.delivery-order {
  font-size: 0.82rem;
  font-weight: 800;
  color: #e0ead0;
}

.delivery-driver {
  font-size: 0.7rem;
  color: #6b8a6b;
  font-weight: 600;
}

.delivery-eta {
  font-size: 0.65rem;
  font-weight: 700;
  color: #8fba8f;
  background: rgba(143, 186, 143, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(143, 186, 143, 0.15);
  flex-shrink: 0;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════ */
/* RESPONSIVE                                */
/* ═══════════════════════════════════════════ */
@media (max-width: 1400px) {
  .metric-cards { grid-template-columns: repeat(2, 1fr); }
  .middle-section { grid-template-columns: 1fr 1fr; }
  .bottom-section { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 1200px) {
  .middle-section { grid-template-columns: 1fr; }
  .bottom-section { grid-template-columns: 1fr; }
  .qa-buttons { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .metric-cards { grid-template-columns: 1fr; }
  .qa-buttons { grid-template-columns: 1fr; }
  .dashboard-wrapper { padding: 1rem; }
  .welcome-title { font-size: 1.5rem; }
  .welcome-row { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
}
</style>