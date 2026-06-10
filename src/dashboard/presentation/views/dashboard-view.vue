<template>
  <div class="dashboard-wrapper">
    <!-- Welcome Greeting -->
    <h1 class="welcome-title">{{ t('dashboard.welcome') }} Carlos</h1>

    <!-- Stat Cards Row -->
    <div class="top-row">
      <div class="stat-card">
        <div class="card-head">
          <div class="icon-box"><i class="pi pi-box" /></div>
          <span class="trend-badge positive">+12.5%</span>
        </div>
        <div class="card-body">
          <span class="stat-label">{{ t('dashboard.active_orders') }}</span>
          <h2 class="stat-value">{{ stats?.activeOrders?.toLocaleString() || '0' }}</h2>
          <div class="progress-bar"><div class="progress-fill" :style="{ width: '65%' }"></div></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-head">
          <div class="icon-box"><i class="pi pi-verified" /></div>
          <span class="status-pill green">{{ t('dashboard.optimal') }}</span>
        </div>
        <div class="card-body">
          <span class="stat-label">{{ t('dashboard.product_quality') }}</span>
          <h2 class="stat-value">{{ stats?.productQuality || '0' }}%</h2>
          <div class="avatar-group">
            <div class="avatar-circle">JM</div>
            <div class="avatar-circle secondary">RL</div>
            <span class="group-note">{{ t('dashboard.quality_note') }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-head">
          <div class="icon-box"><i class="pi pi-truck" /></div>
          <div class="eta-box">
            <span class="eta-label">{{ t('dashboard.eta_average') }}</span>
            <span class="eta-value">{{ stats?.etaAverage || '0' }} min</span>
          </div>
        </div>
        <div class="card-body">
          <span class="stat-label">{{ t('dashboard.daily_deliveries') }}</span>
          <h2 class="stat-value">84<span class="stat-total">/92</span></h2>
          <div class="multi-progress">
            <div class="p-segment active"></div>
            <div class="p-segment active"></div>
            <div class="p-segment active"></div>
            <div class="p-segment"></div>
          </div>
        </div>
      </div>

      <div class="stat-card iot-card alert-danger">
        <div class="card-head">
          <div class="icon-box iot-icon"><i class="pi pi-wifi" /></div>
        </div>
        <div class="card-body">
          <span class="stat-label">{{ t('dashboard.iot_alerts') }}</span>
          <h2 class="stat-value">1</h2>
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

    <!-- Charts + Action Center Row -->
    <div class="charts-row">
      <div class="chart-card volume-chart">
        <div class="card-header">
          <div class="title-wrap">
            <h3>{{ t('dashboard.weekly_volume') }}</h3>
            <p>{{ t('dashboard.weekly_volume_note') }}</p>
          </div>
          <div class="time-filters">
            <button
              class="filter-btn"
              :class="{ active: activeTimeFilter === '7d' }"
              @click="activeTimeFilter = '7d'"
            >7 Días</button>
            <button
              class="filter-btn"
              :class="{ active: activeTimeFilter === '30d' }"
              @click="activeTimeFilter = '30d'"
            >30 Días</button>
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
          <div class="legend-item"><span class="dot entregados"></span> {{ t('dashboard.delivered') }} <span class="val">{{ stats?.orderStatusStats?.delivered || 0 }}</span></div>
          <div class="legend-item"><span class="dot camino"></span> {{ t('dashboard.in_transit') }} <span class="val">{{ stats?.orderStatusStats?.inTransit || 0 }}</span></div>
          <div class="legend-item"><span class="dot pendientes"></span> {{ t('dashboard.pending') }} <span class="val">{{ stats?.orderStatusStats?.pending || 0 }}</span></div>
        </div>
      </div>

      <div class="chart-card action-center">
        <div class="action-header">
          <i class="pi pi-exclamation-triangle action-icon" />
          <h3>{{ t('dashboard.action_center') }}</h3>
        </div>
        <div class="action-list">
          <div v-for="action in actionItems" :key="action.id" class="action-item" :class="action.type">
            <div class="action-item-icon">
              <i :class="action.icon" />
            </div>
            <div class="action-item-content">
              <div class="action-item-header">
                <span class="action-item-title">{{ action.title }}</span>
                <span class="action-item-time">{{ action.time }}</span>
              </div>
              <p class="action-item-desc">{{ action.description }}</p>
              <button v-if="action.actionLabel" class="action-item-btn" :class="action.btnClass">
                {{ action.actionLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Urgent Orders + Ongoing Deliveries -->
    <div class="bottom-row">
      <div class="table-card">
        <div class="card-header">
          <h3>{{ t('dashboard.urgent_orders') }}</h3>
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
              <tr v-for="order in urgentOrders" :key="order.id" class="clickable-row" @click="goToOrder(order.id)">
                <td class="id-col">{{ order.id }}</td>
                <td class="client-col">{{ order.clientName }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(order.status)]">{{ order.status }}</span>
                </td>
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

      <div class="deliveries-card">
        <div class="card-header">
          <h3>{{ t('dashboard.ongoing_deliveries') }}</h3>
        </div>
        <div class="delivery-list">
          <div v-for="delivery in ongoingDeliveries" :key="delivery.id" class="delivery-item">
            <div class="delivery-icon-box">
              <i class="pi pi-truck" />
            </div>
            <div class="delivery-info">
              <span class="delivery-order">{{ delivery.orderId }}</span>
              <span class="delivery-driver">{{ t('dashboard.driver') }}: {{ delivery.assignedDriver }}</span>
            </div>
            <span class="delivery-eta">{{ t('dashboard.arrives_in', { n: delivery.etaMinutes }) }}</span>
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
import { useOrderManagementStore } from '../../../order-management/application/order-management.store.js';
import { useDashboardStore } from '../../application/dashboard.store.js';

const orderStore = useOrderManagementStore();
const dashboardStore = useDashboardStore();
const router = useRouter();
const { t } = useI18n();

const stats = computed(() => dashboardStore.stats);
const activeTimeFilter = ref('7d');

onMounted(() => {
  if (orderStore.orders.length === 0) orderStore.fetchOrders();
  dashboardStore.fetchStats();
});

/* ── Urgent Orders (Problemas) ── */
const urgentOrders = computed(() => {
  const problemStatuses = ['Retrasado', 'Alerta IoT', 'Cancelado', 'Rechazado'];
  let problems = orderStore.orders.filter(o => problemStatuses.includes(o.status));
  if (problems.length === 0) {
    // Datos simulados para demostrar pedidos urgentes
    return [
      { id: '#ORD-092', clientName: 'Supermercados Vida', status: 'Alerta IoT' },
      { id: '#ORD-093', clientName: 'Mercado Central', status: 'Retrasado' }
    ];
  }
  return problems.slice(-3);
});

/* ── Ongoing Deliveries (Sin problemas) ── */
const ongoingDeliveries = computed(() => {
  const inTransit = orderStore.activeOrders.filter(
    o => o.status === 'En Ruta' || o.status === 'Asignado'
  );
  return inTransit.slice(0, 2).map(o => ({
    id: o.id,
    orderId: o.id,
    assignedDriver: o.producer || 'Carlos M.',
    etaMinutes: stats.value?.etaAverage || 45
  }));
});

/* ── Status Colors ── */
const getStatusClass = (status) => {
  if (!status) return 'badge-gray';
  const s = status.toLowerCase();
  if (s === 'entregado') return 'badge-green';
  if (s === 'en ruta' || s === 'asignado') return 'badge-yellow';
  if (s === 'retrasado' || s === 'alerta iot' || s === 'cancelado' || s === 'rechazado') return 'badge-red';
  return 'badge-gray';
};

/* ── Action Center Items ── */
const actionItems = ref([
  {
    id: 1,
    type: 'alert',
    icon: 'pi pi-flag-fill',
    title: 'Order #102',
    description: 'Temperature alert in reefer unit 4.',
    time: t('dashboard.just_now'),
    actionLabel: t('dashboard.resolve_issue'),
    btnClass: 'btn-warning'
  },
  {
    id: 2,
    type: 'info',
    icon: 'pi pi-directions',
    title: 'Route Update',
    description: 'TRK-492 rerouted due to traffic.',
    time: t('dashboard.minutes_ago', { n: 12 }),
    actionLabel: null,
    btnClass: ''
  },
  {
    id: 3,
    type: 'success',
    icon: 'pi pi-check-circle',
    title: 'Delivery Confirmed',
    description: 'Order #098 arrived at destination.',
    time: t('dashboard.minutes_ago', { n: 45 }),
    actionLabel: null,
    btnClass: ''
  }
]);

/* ── Navigation ── */
function goToOrders() {
  router.push('/order-management/orders');
}

function goToOrder(id) {
  router.push('/order-management/orders');
}

/* ── Bar Chart Data ── */
const barData = computed(() => ({
  labels: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
  datasets: [
    {
      label: 'Volumen',
      backgroundColor: '#c9e265',
      data: stats.value?.weeklyVolume || [0, 0, 0, 0, 0, 0, 0],
      borderRadius: 6
    }
  ]
}));

const barOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#6b8a6b', font: { weight: '700', size: 11 } } },
    y: { grid: { color: '#2a3d2e' }, border: { display: false }, ticks: { display: false } }
  },
  maintainAspectRatio: false
};

/* ── Donut Chart Data ── */
const donutData = computed(() => ({
  labels: ['Entregados', 'En Camino', 'Pendientes'],
  datasets: [
    {
      data: stats.value ? [
        stats.value.orderStatusStats.delivered,
        stats.value.orderStatusStats.inTransit,
        stats.value.orderStatusStats.pending
      ] : [0, 0, 0],
      backgroundColor: ['#c9e265', '#8fba8f', '#3d5c42'],
      hoverBackgroundColor: ['#d6ec6e', '#9eb5a1', '#4a6b4a'],
      borderWidth: 0,
      cutout: '75%'
    }
  ]
}));

const donutOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false
};

const compliancePct = computed(() => {
  if (!stats.value || !stats.value.orderStatusStats) return 0;
  const { delivered, inTransit, pending } = stats.value.orderStatusStats;
  const total = delivered + inTransit + pending;
  return total > 0 ? Math.round((delivered / total) * 100) : 0;
});
</script>

<style scoped>
.dashboard-wrapper {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #E1EBE1;
  min-height: 100%;
}

/* ── Welcome ── */
.welcome-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;
}

h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
p { margin: 4px 0 0; font-size: 0.8rem; color: #8fba8f; }

/* ── Stat Cards ── */
.top-row {
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

/* ── Charts Row ── */
.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr;
  gap: 1.25rem;
}

.chart-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
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

/* ── Action Center ── */
.action-center {
  display: flex;
  flex-direction: column;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.action-icon {
  color: #c9e265;
  font-size: 1.1rem;
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

/* ── Bottom Row ── */
.bottom-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 1.25rem;
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

/* ── Responsive ── */
@media (max-width: 1400px) {
  .top-row { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 1200px) {
  .charts-row { grid-template-columns: 1fr; }
  .bottom-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .top-row { grid-template-columns: 1fr; }
  .dashboard-wrapper { padding: 1rem; }
  .welcome-title { font-size: 1.5rem; }
}
</style>
