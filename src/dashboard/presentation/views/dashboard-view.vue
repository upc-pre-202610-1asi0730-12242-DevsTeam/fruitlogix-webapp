<template>
  <div class="dashboard-wrapper">
    <!-- Header Summary -->
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
            <img src="https://v0.dev/placeholder.svg?height=24&width=24" alt="user" />
            <img src="https://v0.dev/placeholder.svg?height=24&width=24" alt="user" />
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
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <div class="chart-card volume-chart">
        <div class="card-header">
          <div class="title-wrap">
            <h3>{{ t('dashboard.weekly_volume') }}</h3>
            <p>{{ t('dashboard.weekly_volume_note') }}</p>
          </div>
          <div class="time-filters">
            <button class="filter-btn active">7 Días</button>
            <button class="filter-btn">30 Días</button>
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
          <pv-chart type="doughnut" :data="donutData" :options="donutOptions" class="h-15rem" />
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
    </div>

    <!-- Recent Orders Table -->
    <div class="table-card">
      <div class="card-header">
        <h3>{{ t('dashboard.recent_orders') }}</h3>
        <button class="view-all">{{ t('common.view_all') }} <i class="pi pi-arrow-right" /></button>
      </div>
      <div class="custom-table-wrap">
        <table class="recent-table">
          <thead>
            <tr>
              <th>{{ t('dashboard.table.order_id') }}</th>
              <th>{{ t('dashboard.table.producer') }}</th>
              <th>{{ t('dashboard.table.product') }}</th>
              <th>{{ t('dashboard.table.volume') }}</th>
              <th>{{ t('dashboard.table.status') }}</th>
              <th>{{ t('dashboard.table.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="id-col">{{ order.id }}</td>
              <td class="prod-col">{{ order.producer }}</td>
              <td class="fruit-col">{{ order.product }}</td>
              <td class="vol-col">{{ order.volume }}</td>
              <td>
                <span :class="['status-badge', order.statusClass]">{{ order.status }}</span>
              </td>
              <td><button class="action-btn"><i class="pi pi-eye" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOrderManagementStore } from '../../../order-management/application/order-management.store.js';
import { useDashboardStore } from '../../application/dashboard.store.js';

const orderStore = useOrderManagementStore();
const dashboardStore = useDashboardStore();
const { t } = useI18n();

const recentOrders = computed(() => orderStore.recentOrders);
const stats = computed(() => dashboardStore.stats);

onMounted(() => {
  if (orderStore.orders.length === 0) orderStore.fetchOrders();
  dashboardStore.fetchStats();
});

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
    x: { grid: { display: false }, border: { display: false } },
    y: { grid: { color: '#2a3d2e' }, border: { display: false }, ticks: { display: false } }
  },
  maintainAspectRatio: false
};

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

h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
p { margin: 4px 0 0; font-size: 0.8rem; color: #8fba8f; }

/* ── Stat Cards ── */
.top-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.stat-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2a3d2e;
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

.eta-label { font-size: 0.6rem; font-weight: 800; color: #8fba8f; display: block; }
.eta-value { font-size: 0.85rem; font-weight: 800; color: #c9e265; }

.stat-label { font-size: 0.75rem; font-weight: 700; color: #8fba8f; letter-spacing: 0.05em; }
.stat-value { font-size: 2rem; font-weight: 800; color: #e0ead0; margin: 0.25rem 0 1rem; letter-spacing: -0.02em; }
.stat-total { font-size: 1rem; color: #6b8a6b; font-weight: 600; }

.progress-bar { height: 4px; background: #2a3d2e; border-radius: 2px; }
.progress-fill { height: 100%; background: #c9e265; border-radius: 2px; }

.avatar-group { display: flex; align-items: center; gap: 0.5rem; }
.avatar-group img { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #1e2d22; }
.group-note { font-size: 0.65rem; color: #6b8a6b; }

.multi-progress { display: flex; gap: 4px; }
.p-segment { flex: 1; height: 4px; background: #2a3d2e; border-radius: 2px; }
.p-segment.active { background: #c9e265; }

/* ── Charts Row ── */
.charts-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 1.25rem;
}

.chart-card {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.75rem;
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
  margin-bottom: 3rem;
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
}

.filter-btn.active {
  background: #2a3d2e;
  color: #e0ead0;
}

.chart-container {
  height: 250px;
  position: relative;
}

.donut-container {
  position: relative;
  height: 200px;
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

.donut-center .pct { font-size: 1.5rem; font-weight: 800; color: #e0ead0; }
.donut-center .lbl { font-size: 0.6rem; font-weight: 800; color: #8fba8f; letter-spacing: 0.05em; }

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #8fba8f;
  font-weight: 600;
}

.dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 10px; }
.entregados { background: #c9e265; }
.camino { background: #8fba8f; }
.pendientes { background: #3d5c42; }

.legend-item .val { margin-left: auto; color: #e0ead0; }

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

.view-all {
  background: transparent; border: none; color: #c9e265;
  font-size: 0.75rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 0.5rem;
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
}

.recent-table td {
  padding: 1.25rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #e0ead0;
  border-bottom: 1px solid #2a3d2e;
}

.id-col { color: #e0ead0; font-weight: 800 !important; }
.prod-col { color: #8fba8f; }

.status-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
}

.status-en-ruta   { background: rgba(201, 226, 101, 0.1); color: #c9e265; }
.status-entregado { background: rgba(27, 179, 126, 0.1); color: #1bb37e; }
.status-pendiente { background: rgba(242, 95, 92, 0.1); color: #f25f5c; }

.action-btn {
  background: #2a3d2e;
  border: none;
  color: #8fba8f;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover { background: #3d5c42; color: #e0ead0; }

@media (max-width: 1200px) {
  .top-row { grid-template-columns: 1fr 1fr; }
  .charts-row { grid-template-columns: 1fr; }
}
</style>
