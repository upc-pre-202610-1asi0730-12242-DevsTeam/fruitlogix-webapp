<template>
  <div class="assign-wrapper">
    <!-- Breadcrumb with Back Button -->
    <div class="breadcrumb-bar">
      <button class="back-btn" @click="goBack" title="Volver al Detalle del Pedido"><i class="pi pi-arrow-left"></i></button>
      <div class="breadcrumb">
        <span class="crumb-link" @click="goHome">Pedidos</span>
        <i class="pi pi-angle-right"></i>
        <span class="crumb-link" @click="goToDetail">{{ order?.id || 'PED-000' }}</span>
        <i class="pi pi-angle-right"></i>
        <span class="crumb-current">Seleccionar Productor</span>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper-container">
      <div class="step active">
        <div class="step-circle">1</div>
        <span class="step-label">Seleccionar Productor</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-circle">2</div>
        <span class="step-label">Asignar Flota</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <div class="step-circle">3</div>
        <span class="step-label">Confirmar</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content-full">
      <!-- Slim Summary Box -->
      <div class="slim-summary-bar">
        <div class="slim-title">
          <i class="pi pi-receipt"></i> Resumen del pedido
        </div>
        <div class="slim-details">
          <span class="slim-detail-item"><strong>Total Requerido:</strong> {{ totalKg }} kg</span>
          <span class="slim-separator">|</span>
          <span class="slim-detail-item"><strong>Fecha:</strong> {{ deliveryDate }}</span>
        </div>
      </div>

      <!-- Producers Section -->
      <div class="producers-section">
        <div class="section-header">
          <h1 class="page-title">Productores disponibles ({{ producers.length }})</h1>
          <div class="search-wrap">
            <i class="pi pi-search search-icon"></i>
            <input type="text" class="search-input" placeholder="Buscar productor..." v-model="searchQuery" />
          </div>
        </div>

        <div class="filters-row">
          <div class="filters">
            <button class="filter-btn active">Todos</button>
            <button class="filter-btn">Cercanos</button>
            <button class="filter-btn">Mejor calificados</button>
          </div>
          
          <div class="info-text-inline">
            <i class="pi pi-info-circle"></i>
            <span>Solo se muestran productores con stock suficiente para todos los productos requeridos en este pedido.</span>
          </div>
        </div>

        <div class="producers-grid">
          <!-- Producer Card -->
          <div class="info-card producer-card" v-for="producer in filteredProducers" :key="producer.id" :class="{ 'partial-match': !producer.fullCoverage }">
            <div class="producer-header">
              <div class="producer-title-col">
                <h3 class="producer-name">{{ producer.name }}</h3>
                <div class="producer-location">
                  <i class="pi pi-map-marker"></i> {{ producer.location }}
                </div>
              </div>
              <div class="producer-rating">
                <i class="pi pi-star-fill"></i> {{ producer.rating }}
              </div>
            </div>

            <div class="producer-stats">
              <div class="stat"><i class="pi pi-truck"></i> {{ producer.completedOrders }} pedidos completados</div>
              <div class="stat"><i class="pi pi-directions"></i> {{ producer.distance }} km</div>
            </div>

            <div class="producer-stock-list">
              <div class="stock-item" v-for="stock in producer.stock" :key="stock.name">
                <div class="stock-labels">
                  <span class="stock-name">{{ stock.name }}</span>
                  <span class="stock-disp" :class="{ 'text-danger': stock.available < stock.required }">{{ stock.available }} kg disp.</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :class="{ 'fill-danger': stock.available < stock.required }" :style="{ width: Math.min((stock.available / stock.required) * 100, 100) + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="coverage-alert" :class="producer.fullCoverage ? 'alert-success' : 'alert-warning'">
              <i :class="producer.fullCoverage ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
              <span>{{ producer.fullCoverage ? 'Cubre el pedido completo' : 'Cubre parcialmente — necesitarás un segundo productor' }}</span>
            </div>

            <button class="select-btn" :class="{ 'partial-btn': !producer.fullCoverage }" @click="selectProducer(producer)">
              {{ producer.fullCoverage ? 'Seleccionar' : 'Seleccionar Parcial' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderManagementStore } from '../../application/order-management.store.js';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderManagementStore();

const searchQuery = ref('');

const order = computed(() => {
  const id = route.params.id;
  return orderStore.orders.find(o => o.id === id || String(o.id) === String(id)) || null;
});

onMounted(async () => {
  if (!orderStore.ordersLoaded) {
    await orderStore.fetchOrders();
  }
});

function goHome() {
  router.push({ name: 'order-list' });
}

function goToDetail() {
  if (order.value?.id) {
    router.push({ name: 'order-detail', params: { id: order.value.id } });
  } else {
    goHome();
  }
}

function goBack() {
  goToDetail();
}

// Order Data Mocks / Computeds
const orderProducts = computed(() => {
  const fruits = order.value?.selectedFruits;
  if (Array.isArray(fruits) && fruits.length > 0) {
    return fruits.map(f => ({
      name: f.name || 'Producto',
      qty: Number(f.quantity || 0)
    }));
  }
  return [
    { name: 'Mango Extra', qty: 200 },
    { name: 'Plátano Verde', qty: 150 },
    { name: 'Naranja Valencia', qty: 130 }
  ];
});

const totalKg = computed(() => {
  return orderProducts.value.reduce((sum, item) => sum + item.qty, 0);
});

const deliveryDate = computed(() => {
  return 'Mar 15, 8:00 AM'; // Mock from design
});

// Producers Mock Data
const producers = ref([
  {
    id: 'p1',
    name: 'Finca Los Andes',
    location: 'Huaral, Lima',
    rating: 4.8,
    completedOrders: 23,
    distance: 42,
    fullCoverage: true,
    stock: [
      { name: 'Mango Extra', required: 200, available: 380 },
      { name: 'Plátano Verde', required: 150, available: 210 },
      { name: 'Naranja Valencia', required: 130, available: 150 }
    ]
  },
  {
    id: 'p2',
    name: 'Hacienda El Sol',
    location: 'Chancay, Lima',
    rating: 4.5,
    completedOrders: 12,
    distance: 38,
    fullCoverage: false,
    stock: [
      { name: 'Mango Extra', required: 200, available: 250 },
      { name: 'Plátano Verde', required: 150, available: 180 },
      { name: 'Naranja Valencia', required: 130, available: 0 }
    ]
  }
]);

const filteredProducers = computed(() => {
  if (!searchQuery.value) return producers.value;
  const q = searchQuery.value.toLowerCase();
  return producers.value.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
});

async function selectProducer(producer) {
  if (order.value?.id) {
    // Store the selected producer in the wizard state so Step 2/3 can read it
    orderStore.wizardProducer = {
      id: producer.id,
      name: producer.name,
      location: producer.location,
      rating: producer.rating,
      stock: producer.stock
    };
    router.push({ name: 'assign-fleet', params: { id: order.value.id } });
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.assign-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ── Breadcrumb & Back ── */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.back-btn {
  background: transparent;
  border: none;
  color: #1a3020;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;
  padding: 0.5rem;
}
.back-btn:hover {
  color: #4a6b4a;
  transform: scale(1.05);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b8a6b;
}
.crumb-link {
  cursor: pointer;
  transition: color 0.15s;
}
.crumb-link:hover {
  color: #1a3020;
}
.breadcrumb i {
  font-size: 0.7rem;
}
.crumb-current {
  color: #1a3020;
  font-weight: 800;
}

/* ── Stepper ── */
.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  padding: 1.5rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2a3d2e;
  color: #8fba8f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.step.active .step-circle {
  background: #c9e265;
  color: #122216;
}
.step-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #8fba8f;
}
.step.active .step-label {
  color: #e0ead0;
}
.step-line {
  flex: 1;
  height: 2px;
  background: #2a3d2e;
  margin: 0 1rem;
  transform: translateY(-10px);
}
.step.active + .step-line {
  background: #2a3d2e;
}

.page-title {
  font-size: 2rem;
  font-weight: 900;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.03em;
}

/* ── Main Layout ── */
.main-content-full {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 0;
  color: #e0ead0;
}

/* ── Slim Summary Bar ── */
.slim-summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  color: #e0ead0;
}
.slim-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #e0ead0;
}
.slim-title i {
  color: #c9e265;
}
.slim-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}
.slim-detail-item strong {
  color: #8fba8f;
  margin-right: 0.25rem;
}
.slim-separator {
  color: #3d5c42;
}

/* ── Producers Section ── */
.producers-section {
  display: flex;
  flex-direction: column;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
}
.search-wrap {
  position: relative;
  width: 320px;
}
.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b8a6b;
  font-size: 0.9rem;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 999px;
  border: 1.5px solid #1e2d22;
  background: #1e2d22;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  color: #e0ead0;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.search-input::placeholder {
  color: #7d8f7d;
}
.search-input:focus {
  border-color: #c9e265;
}

/* Filters and Inline Alert */
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.filters {
  display: flex;
  gap: 0.75rem;
}
.filter-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn.active {
  background: #c9e265;
  border-color: #c9e265;
  color: #122216;
}

.info-text-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c9e265; /* Bright neon green as requested */
  background: rgba(201, 226, 101, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

/* Producers Grid */
.producers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* Producer Card */
.producer-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin-bottom: 0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.producer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
.producer-card.partial-match {
  border: 1px solid rgba(212, 163, 75, 0.4);
}

.producer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.producer-title-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.producer-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #e0ead0;
}
.producer-location {
  font-size: 0.75rem;
  color: #8fba8f;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.producer-rating {
  background: rgba(212, 163, 75, 0.15);
  color: #e5b95e;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid rgba(212, 163, 75, 0.3);
}

.producer-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat {
  font-size: 0.75rem;
  color: #6b8a6b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* Stock List */
.producer-stock-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex: 1;
}
.stock-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.stock-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}
.stock-name {
  color: #8fba8f;
  font-weight: 500;
}
.stock-disp {
  font-weight: 800;
  color: #e0ead0;
}
.stock-disp.text-danger {
  color: #f87171;
}
.progress-bar-bg {
  height: 6px;
  background: rgba(42, 61, 46, 0.6);
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #c9e265;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.progress-bar-fill.fill-danger {
  background: #f87171;
}

/* Coverage Alert */
.coverage-alert {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.alert-success {
  background: rgba(201, 226, 101, 0.1);
  color: #c9e265;
  border: 1px solid rgba(201, 226, 101, 0.2);
}
.alert-warning {
  background: rgba(212, 163, 75, 0.1);
  color: #e5b95e;
  border: 1px solid rgba(212, 163, 75, 0.25);
}

/* Select Button */
.select-btn {
  width: 100%;
  padding: 0.85rem;
  border-radius: 10px;
  border: none;
  background: #c9e265;
  color: #122216;
  font-family: 'DM Sans', sans-serif;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}
.select-btn:hover {
  background: #d6ec6e;
  transform: translateY(-1px);
}
.select-btn.partial-btn {
  background: transparent;
  border: 1.5px solid #3d5c42;
  color: #e0ead0;
}
.select-btn.partial-btn:hover {
  background: #2a3d2e;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .summary-card-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .filters-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .search-wrap {
    width: 100%;
  }
  .stepper-container {
    padding: 1rem;
  }
}
</style>
