<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('orders.title', 'Mis Pedidos') }}</h1>
        <p class="page-sub">{{ t('orders.subtitle', 'Historial y seguimiento de pedidos') }}</p>
      </div>
      <button class="btn-primary" @click="router.push('/customer/catalog')">{{ t('orders.new', 'Nuevo Pedido') }}</button>
    </div>

    <div v-if="liveOrders.length === 0" class="empty-state">
      <div class="empty-icon"><i class="pi pi-box" style="font-size: 3rem;"></i></div>
      <h3>{{ t('orders.empty', 'No tienes pedidos') }}</h3>
      <p>{{ t('orders.emptyDesc', 'Tu historial de pedidos aparecerá aquí') }}</p>
      <button class="btn-primary" @click="router.push('/customer/catalog')">{{ t('orders.goCatalog', 'Ir al catálogo') }}</button>
    </div>

    <div v-else class="orders-layout">
      <div class="orders-list">
        <div
            v-for="order in liveOrders"
            :key="order.id"
            :class="['order-card', { selected: selectedOrderId === order.id }]"
            @click="selectOrder(order.id)"
        >
          <div class="order-card-header">
            <span class="order-id">{{ order.id }}</span>
            <span :class="['status-badge', getStatusClass(order.status)]">{{ getStatusLabel(order.status) }}</span>
          </div>
          <div class="order-card-items">
            {{ (order.selectedFruits || []).map(f => f.name).join(', ') }}
          </div>
          <div class="order-card-footer">
            <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            <div class="order-total-mini">S/ {{ Number(order.totalAmount || 0).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="order-detail" v-if="selectedOrder">
        <div class="detail-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 class="section-title" style="margin-bottom: 0;">{{ t('orders.detail', 'Detalle del Pedido') }}</h3>

            <div style="display: flex; gap: 10px;">
              <button
                  v-if="selectedOrder.status === 'InTransit'"
                  class="btn-primary"
                  @click="goToLiveTracking(selectedOrder.idRaw)"
                  style="background-color: #c9e265; color: #122216; font-weight: bold; border-radius: 8px; padding: 0.5rem 1rem;"
              >
                <i class="pi pi-map-marker" style="margin-right: 0.5rem;"></i> Rastrear Camión
              </button>
              <button
                  v-if="selectedOrder.status === 'Delivered'"
                  class="btn-primary"
                  @click="router.push('/customer/reception?id=' + selectedOrder.idRaw)"
                  style="background-color: #1bb37e; color: white; font-weight: bold; border-radius: 8px; padding: 0.5rem 1rem;"
              >
                <i class="pi pi-check-square" style="margin-right: 0.5rem;"></i> Confirmar Recepción
              </button>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-cell">
              <span class="detail-label">ID</span>
              <span class="detail-value">{{ selectedOrder.id }}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-label">Fecha</span>
              <span class="detail-value">{{ formatDate(selectedOrder.createdAt) }}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-label">Estado de Pago</span>
              <span :class="['detail-value', selectedOrder.paymentStatus === 'PAGADO' ? 'text-success' : 'text-warning']">
                {{ selectedOrder.paymentStatus === 'PAGADO' ? '✓ Pagado' : '⏳ Pendiente' }}
              </span>
            </div>
            <div class="detail-cell">
              <span class="detail-label">Total</span>
              <span class="detail-value">S/ {{ Number(selectedOrder.totalAmount || 0).toFixed(2) }}</span>
            </div>
          </div>
          <div class="detail-items">
            <div v-for="item in selectedOrder.selectedFruits" :key="item.id" class="detail-item">
              <span class="detail-item-dot"></span>
              <span class="detail-item-name">{{ item.name }}</span>
              <span class="detail-item-qty">{{ item.quantity }} kg</span>
              <span class="detail-item-price">S/ {{ Number(item.subtotal || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="tracking-section" v-if="selectedOrder.paymentStatus === 'PAGADO'">
          <h3 class="section-title">{{ t('orders.tracking', 'Seguimiento Operativo') }}</h3>

          <div class="actor-legend">
            <div class="legend-item">
              <span class="legend-dot producer"></span>
              <span>Productor</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot distributor"></span>
              <span>Distribuidor (FruitLogix)</span>
            </div>
          </div>

          <div class="tracking-timeline">
            <div
                v-for="(step, index) in selectedOrder.trackingSteps"
                :key="step.id"
                :class="['tracking-step', step.status]"
            >
              <div class="step-left">
                <div :class="['step-dot', step.status, step.actor]">
                  <span v-if="step.status === 'done'">✓</span>
                  <span v-else-if="step.status === 'active'">●</span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div v-if="index < selectedOrder.trackingSteps.length - 1" :class="['step-line', step.status === 'done' ? 'done' : '']"></div>
              </div>
              <div class="step-content">
                <div class="step-header">
                  <span class="step-label">{{ step.label }}</span>
                  <span :class="['actor-tag', step.actor]">
                    {{ step.actor === 'producer' ? '🌾 Productor' : '🚚 Distribuidor' }}
                  </span>
                  <span v-if="step.time" class="step-time">{{ step.time }}</span>
                </div>
                <div class="step-desc">{{ step.description }}</div>
                <div v-if="step.status === 'active'" class="step-active-indicator">
                  <span class="pulse-dot"></span>
                  <span>{{ t('track.active', 'En proceso') }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="order-detail empty-detail" v-else>
        <div class="empty-detail-icon"><i class="pi pi-mouse"></i></div>
        <p>{{ t('orders.selectHint', 'Selecciona un pedido para ver los detalles') }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { OrderManagementApi } from '../../infrastructure/order-management-api.js';

const router = useRouter();
const { t } = useI18n();

const liveOrders = ref([]);
const selectedOrderId = ref(null);
const orderManagementApi = new OrderManagementApi();

onMounted(() => {
  orderManagementApi.getOrders()
      .then(response => {
        const rawOrders = response.data || [];

        liveOrders.value = rawOrders.map(order => {
          const backendItems = order.items || order.orderItems || [];
          const mappedFruits = backendItems.map(item => ({
            id: item.id || item.productId || Math.random(),
            name: item.name || item.productName || 'Fruta',
            quantity: item.quantityKg || 0,
            subtotal: item.unitPrice ? (item.quantityKg * item.unitPrice) : 0
          }));

          // 🌟 MAGIA: Leemos el estado del navegador (Productor o Distribuidor)
          const localStatus = localStorage.getItem(`order_status_${order.id}`);
          let finalStatus = order.status;

          if (localStatus === 'READY') finalStatus = 'InPreparation'; // Productor inspeccionó
          if (localStatus === 'IN_TRANSIT') finalStatus = 'InTransit'; // Productor despachó
          if (localStatus === 'DELIVERED') finalStatus = 'Delivered';  // Camión llegó

          return {
            id: `#ORD-REAL-${order.id}`,
            idRaw: order.id,
            createdAt: order.createdAt || new Date().toISOString(),
            status: finalStatus, // Usamos el estado sincronizado
            paymentStatus: 'PAGADO',
            totalAmount: Number(order.totalAmount || order.total || 0),
            selectedFruits: mappedFruits,
            trackingSteps: [
              { id: 1, label: 'Pedido Recibido', status: 'done', actor: 'distributor' },
              { id: 2, label: 'Asignando Productor', status: finalStatus === 'Pending' ? 'active' : 'done', actor: 'distributor' },
              { id: 3, label: 'En Preparación', status: finalStatus === 'InPreparation' ? 'active' : (['InTransit', 'Delivered'].includes(finalStatus) ? 'done' : 'pending'), actor: 'producer' },
              { id: 4, label: 'En Ruta de Distribución', status: finalStatus === 'InTransit' ? 'active' : (finalStatus === 'Delivered' ? 'done' : 'pending'), actor: 'distributor' },
              { id: 5, label: 'Entregado', status: finalStatus === 'Delivered' ? 'active' : 'pending', actor: 'distributor' }
            ]
          };
        });

        if (liveOrders.value.length > 0) {
          selectedOrderId.value = liveOrders.value[0].id;
        }
      })
      .catch(error => console.error("Error crítico:", error));
});

const selectedOrder = computed(() => liveOrders.value.find(o => o.id === selectedOrderId.value));

function selectOrder(id) {
  selectedOrderId.value = id;
}

// 🌟 Función que redirige al Tracking con el ID real
function goToLiveTracking(idRaw) {
  router.push({ name: 'customer-tracking', params: { id: idRaw } });
}

function getStatusLabel(status) {
  const map = {
    'Pending': 'Pendiente',
    'InPreparation': 'En Preparación',
    'InTransit': 'En Ruta',
    'Delivered': 'Entregado',
    'Cancelled': 'Cancelado',
    'Rejected': 'Rechazado'
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    'Pending': 'status-warning',
    'InPreparation': 'status-info',
    'InTransit': 'status-active',
    'Delivered': 'status-success',
    'Cancelled': 'status-warning',
    'Rejected': 'status-warning'
  };
  return map[status] || '';
}

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.orders-page { padding: 32px; min-height: 100vh; background: #E1EBE1; }
.page-header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.page-title {  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;}
.page-sub { color: #4a6b4a; font-size: 14px; margin: 0; }

.empty-state { text-align: center; padding: 80px 20px; background: #1e2d22; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px 0; }
.empty-state p { color: #9ab39d; margin: 0 0 24px 0; }

.orders-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }

/* Orders list */
.orders-list { display: flex; flex-direction: column; gap: 12px; }
.order-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.order-card:hover { border-color: rgba(212, 233, 82, 0.5); transform: translateY(-1px); }

.order-card.selected { 
  border: 2px solid #D4E952; 
  background: rgba(212, 233, 82, 0.12); 
  box-shadow: 0 0 0 1px #D4E952, 0 8px 24px rgba(212, 233, 82, 0.15); 
}

.order-card.selected .order-id { 
  color: #535e0d; 
}

.order-card.selected .order-total-mini { 
  color: #535e0d; 
}

.order-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.order-id { font-size: 13px; font-weight: 800; color: #FFFFFF; }
.status-badge { font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 20px; text-transform: uppercase; }
.status-warning { background: rgba(255,152,0,0.15); color: #ff9800; }
.status-info { background: rgba(33,150,243,0.15); color: #2196f3; }
.status-active { background: #D4E952; color: #121212; }
.status-success { background: rgba(76,175,80,0.15); color: #4caf50; }
.order-card-items { font-size: 12px; color: #9ab39d; margin-bottom: 10px; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.order-card-footer { display: flex; justify-content: space-between; align-items: center; }
.order-date { font-size: 11px; color: #9ab39d; font-weight: 600; }
.order-total-mini { font-size: 14px; font-weight: 800; color: #FFFFFF; }
.order-card-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
.pending-pay-badge { font-size: 11px; font-weight: 700; color: #ff5252; }
.btn-pay-now { background: #D4E952; color: #121212; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.btn-pay-now:hover { background: #e2f57a; }

/* Order detail */
.order-detail { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.empty-detail { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; text-align: center; }
.empty-detail-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
.empty-detail p { color: #9ab39d; font-size: 14px; font-weight: 500; }

.detail-section { padding: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.section-title { font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px 0; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.detail-cell { background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 14px; border: 1px solid rgba(255, 255, 255, 0.05); }
.detail-label { display: block; font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #9ab39d; text-transform: uppercase; margin-bottom: 6px; }
.detail-value { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.text-success { color: #4caf50 !important; }
.text-warning { color: #ff9900 !important; }
.detail-items { display: flex; flex-direction: column; gap: 8px; }
.detail-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
.detail-item-emoji { font-size: 20px; }
.detail-item-name { flex: 1; font-size: 14px; font-weight: 700; color: #FFFFFF; }
.detail-item-qty { font-size: 12px; color: #ffffff; font-weight: 600; }
.detail-item-price { font-size: 14px; font-weight: 800; color: #FFFFFF; }

/* Tracking */
.tracking-section { padding: 24px; }
.actor-legend { display: flex; gap: 20px; margin-bottom: 24px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #9ab39d; }
.legend-dot { width: 12px; height: 12px; border-radius: 50%; }
.legend-dot.producer { background: #4caf50; }
.legend-dot.distributor { background: #D4E952; }

.tracking-timeline { display: flex; flex-direction: column; gap: 0; }
.tracking-step { display: flex; gap: 16px; }
.step-left { display: flex; flex-direction: column; align-items: center; }
.step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0; transition: all 0.3s; }
.step-dot.done { background: #4caf50; color: white; }
.step-dot.active.producer { background: #4caf50; color: white; box-shadow: 0 0 0 4px rgba(76,175,80,0.2); }
.step-dot.active.distributor { background: #D4E952; color: #121212; box-shadow: 0 0 0 4px rgba(212,233,82,0.2); }
.step-dot.pending { background: rgba(255, 255, 255, 0.05); color: #9ab39d; border: 2px solid rgba(255, 255, 255, 0.1); }
.step-line { width: 2px; flex: 1; min-height: 24px; background: rgba(255, 60, 60, 0.1); margin: 4px 0; }
.step-line.done { background: #4caf50; }
.step-content { padding: 4px 0 24px 0; flex: 1; }
.step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
.step-label { font-size: 15px; font-weight: 700; color: #FFFFFF; }
.tracking-step.pending .step-label { color: #9ab39d; }
.actor-tag { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; }
.actor-tag.producer { background: rgba(76,175,80,0.15); color: #4caf50; }
.actor-tag.distributor { background: #D4E952; color: #121212; }
.step-time { font-size: 11px; font-weight: 600; color: #9ab39d; margin-left: auto; }
.step-desc { font-size: 13px; color: #9ab39d; line-height: 1.5; margin: 0; }
.step-active-indicator { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; color: #D4E952; font-weight: 700; }
.pulse-dot { width: 10px; height: 10px; background: #D4E952; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; box-shadow: 0 0 0 2px rgba(212,233,82,0.5); }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }

.btn-simulate { margin-top: 16px; background: transparent; border: 1px dashed rgba(255, 255, 255, 0.2); color: #9ab39d; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: block; width: fit-content; }
.btn-simulate:hover { border-color: rgba(255, 255, 255, 0.4); color: #FFFFFF; background: rgba(255, 255, 255, 0.05); }
.tracking-complete { text-align: center; padding: 16px; background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.2); border-radius: 8px; color: #4caf50; font-weight: 700; font-size: 14px; margin-top: 16px; }

.tracking-pending { padding: 48px 32px; text-align: center; background: transparent; border-top: 1px solid rgba(255, 255, 255, 0.05); }
.pending-icon { font-size: 56px; margin-bottom: 16px; display: block; }
.tracking-pending h4 { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 12px 0; }
.tracking-pending p { font-size: 14px; color: #9ab39d; line-height: 1.6; margin: 0 auto 24px auto; max-width: 400px; }
.btn-primary { background: #D4E952; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn-primary:hover { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,233,82,0.2); }

@media (max-width: 1024px) {
  .orders-layout { grid-template-columns: 1fr; }
}

.detail-item-dot { width: 10px; height: 10px; background-color: #A3D139; border-radius: 50%; display: inline-block; margin-right: 12px; }

</style>
