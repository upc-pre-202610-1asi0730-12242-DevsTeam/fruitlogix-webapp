<template>
  <div class="payments-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('pay.title', 'Pagos') }}</h1>
        <p class="page-sub">{{ t('pay.subtitle', 'Historial y pagos pendientes') }}</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filter-bar">
      <button :class="['filter-btn', { active: filter === 'todos' }]" @click="filter = 'todos'">
        Todos <span class="filter-count">{{ cartStore.orders.length }}</span>
      </button>
      <button :class="['filter-btn', { active: filter === 'pagado' }]" @click="filter = 'pagado'">
        Pagados <span class="filter-count">{{ pagados.length }}</span>
      </button>
      <button :class="['filter-btn', { active: filter === 'pendiente' }]" @click="filter = 'pendiente'">
        Pendientes <span class="filter-count pending-count">{{ pendientes.length }}</span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="filteredOrders.length === 0" class="empty-state">
      <i class="pi pi-wallet" style="font-size: 48px; color: #4a6b4a; margin-bottom: 16px;"></i>
      <h3>No hay pagos aquí</h3>
      <p>{{ filter === 'pendiente' ? 'No tienes pagos pendientes.' : 'No tienes pagos registrados aún.' }}</p>
    </div>

    <!-- Cards -->
    <div v-else class="payments-grid">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="boleta-card"
        :class="order.paymentStatus === 'PAGADO' ? 'pagado' : 'pendiente'"
      >
        <!-- Header boleta -->
        <div class="boleta-header">
          <div class="boleta-left">
            <div class="boleta-icon">
              <i :class="order.paymentStatus === 'PAGADO' ? 'pi pi-check' : 'pi pi-clock'"></i>
            </div>
            <div>
              <div class="boleta-id">{{ order.id }}</div>
              <div class="boleta-date">{{ formatDate(order.createdAt) }}</div>
            </div>
          </div>
          <span :class="['status-badge', order.paymentStatus === 'PAGADO' ? 'badge-pagado' : 'badge-pendiente']">
            {{ order.paymentStatus === 'PAGADO' ? 'Pagado' : 'Pendiente' }}
          </span>
        </div>

        <!-- Productos -->
        <div class="boleta-items">
          <div v-for="item in order.items" :key="item.product.id" class="boleta-item">
            <span class="boleta-item-name">{{ item.product.name }}</span>
            <span class="boleta-item-detail">{{ item.quantity }} {{ item.product.unit }}</span>
            <span class="boleta-item-price">S/ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Footer boleta -->
        <div class="boleta-footer">
          <div class="boleta-footer-left">
            <span class="boleta-address">
              <i class="pi pi-map-marker" style="margin-right: 4px;"></i>{{ order.address }}
            </span>
          </div>
          <div class="boleta-total-wrap">
            <span class="boleta-total-label">TOTAL</span>
            <span class="boleta-total">S/ {{ order.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Acción si pendiente -->
        <div v-if="order.paymentStatus !== 'PAGADO'" class="boleta-action">
          <button
            class="btn-pay-now"
            @click="router.push({ name: 'customer-payment', params: { orderId: order.id } })"
          >
            <i class="pi pi-credit-card" style="margin-right: 6px;"></i>
            Pagar Ahora — S/ {{ order.total.toFixed(2) }}
          </button>
        </div>

        <!-- Sello pagado -->
        <div v-else class="boleta-sello">
          <i class="pi pi-verified"></i> PAGADO
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../../../order-management/application/cart.store.js';

const router = useRouter();
const cartStore = useCartStore();
const { t } = useI18n();

const filter = ref('todos');

const pagados = computed(() => cartStore.orders.filter(o => o.paymentStatus === 'PAGADO'));
const pendientes = computed(() => cartStore.orders.filter(o => o.paymentStatus !== 'PAGADO'));

const filteredOrders = computed(() => {
  if (filter.value === 'pagado') return pagados.value;
  if (filter.value === 'pendiente') return pendientes.value;
  return cartStore.orders;
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
</script>

<style scoped>
.payments-page { padding: 32px; min-height: 100vh; background: #E1EBE1; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 2rem; font-weight: 800; color: #1a3020; margin: 0; letter-spacing: -0.02em; }
.page-sub { color: #4a6b4a; font-size: 14px; margin: 4px 0 0 0; }

.filter-bar { display: flex; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; }
.filter-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.1); background: #fff; color: #4a6b4a; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.filter-btn:hover { background: #d0dca0; }
.filter-btn.active { background: #1a3020; color: #D4E952; border-color: #1a3020; }
.filter-count { background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 800; }
.filter-btn.active .filter-count { background: rgba(212,233,82,0.2); color: #D4E952; }
.pending-count { background: rgba(255,82,82,0.15); color: #ff5252; }

.empty-state { text-align: center; padding: 80px 20px; background: #1e2d22; border-radius: 16px; display: flex; flex-direction: column; align-items: center; }
.empty-state h3 { font-size: 18px; font-weight: 800; color: #fff; margin: 0 0 8px 0; }
.empty-state p { color: #9ab39d; margin: 0; }

.payments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }

.boleta-card { background: #1e2d22; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2); position: relative; }
.boleta-card.pagado { border-top: 3px solid #4caf50; }
.boleta-card.pendiente { border-top: 3px solid #ff9800; }

.boleta-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.boleta-left { display: flex; align-items: center; gap: 14px; }
.boleta-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.boleta-card.pagado .boleta-icon { background: rgba(76,175,80,0.15); color: #4caf50; }
.boleta-card.pendiente .boleta-icon { background: rgba(255,152,0,0.15); color: #ff9800; }
.boleta-id { font-size: 14px; font-weight: 800; color: #FFFFFF; }
.boleta-date { font-size: 11px; color: #9ab39d; font-weight: 600; margin-top: 2px; }

.status-badge { font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-pagado { background: rgba(76,175,80,0.15); color: #4caf50; }
.badge-pendiente { background: rgba(255,152,0,0.15); color: #ff9800; }

.boleta-items { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.07); }
.boleta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.boleta-item-name { flex: 1; color: #FFFFFF; font-weight: 600; }
.boleta-item-detail { color: #9ab39d; font-size: 12px; min-width: 60px; text-align: right; }
.boleta-item-price { color: #FFFFFF; font-weight: 700; min-width: 80px; text-align: right; }

.boleta-footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; }
.boleta-address { font-size: 11px; color: #9ab39d; font-weight: 600; }
.boleta-total-wrap { display: flex; flex-direction: column; align-items: flex-end; }
.boleta-total-label { font-size: 10px; color: #9ab39d; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.boleta-total { font-size: 20px; font-weight: 800; color: #FFFFFF; }

.boleta-action { padding: 0 20px 20px; }
.btn-pay-now { width: 100%; background: #D4E952; color: #121212; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-pay-now:hover { background: #e2f57a; transform: translateY(-1px); }

.boleta-sello { margin: 0 20px 20px; padding: 8px; border-radius: 8px; background: rgba(76,175,80,0.08); border: 1px dashed rgba(76,175,80,0.3); color: #4caf50; font-size: 12px; font-weight: 800; text-align: center; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 6px; }

@media (max-width: 768px) {
  .payments-grid { grid-template-columns: 1fr; }
}
</style>