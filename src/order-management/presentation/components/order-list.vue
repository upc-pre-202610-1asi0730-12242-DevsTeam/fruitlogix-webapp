<template>
  <div class="page-wrapper">
    <!-- Header Area -->
    <div class="header-section">
      <div class="title-area">
        <nav class="breadcrumb">
          <span>{{ t('orders.breadcrumb.home') }}</span>
          <span class="sep">></span>
          <span class="active">{{ t('orders.breadcrumb.orders') }}</span>
        </nav>
        <h1 class="page-title">{{ t('orders.title') }}</h1>
        <p class="page-subtitle">{{ t('orders.subtitle') }}</p>
      </div>

      <div class="actions-area" style="flex-direction: row; align-items: center; gap: 1rem;">
        <pv-icon-field iconPosition="left" class="search-container">
          <pv-input-icon class="pi pi-search"/>
          <pv-input-text
              v-model="searchQuery"
              :placeholder="t('orders.search_placeholder')"
              class="custom-search-input"
          />
        </pv-icon-field>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="quick-filters-row">
      <button 
        v-for="tab in ['Todos', 'Pendiente', 'En Preparación', 'En Ruta', 'Entregado', 'Cancelado']" 
        :key="tab"
        class="filter-pill"
        :class="{ active: activeStatusTab === tab }"
        @click="activeStatusTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Table Area -->
    <div class="table-card">
      <pv-data-table
          :value="filteredOrders"
          paginator
          :rows="5"
          :rows-per-page-options="[5, 10, 20]"
          paginator-template="CurrentPageReport PrevPageLink PageLinks NextPageLink"
          :current-page-report-template="t('orders.table.showing')"
          responsive-layout="scroll"
          class="custom-datatable"
          rowHover
          @row-click="goToOrderDetail"
      >
        <pv-column field="id" header="ID Pedido">
          <template #body="{ data }">
            <span class="id-cell">{{ data.id }}</span>
          </template>
        </pv-column>

        <pv-column field="clientName" header="Cliente">
          <template #body="{ data }">
            <div class="client-cell">
              <span class="client-badge">{{ getInitials(data.clientName || 'C ' + (data.commercialClientId || data.id)) }}</span>

              <span class="client-name">{{ data.clientName ? data.clientName : 'Cliente #' + (data.commercialClientId || data.id) }}</span>
            </div>
          </template>
        </pv-column>

        <pv-column header="Productos">
          <template #body="{ data }">
            <span class="product-grouping">{{ getFruitLabelGroup(data) }}</span>
          </template>
        </pv-column>

        <pv-column field="producerId" header="Productor">
          <template #body="{ data }">
            <span class="client-name">{{ data.producerId || 'Sin Asignar' }}</span>
          </template>
        </pv-column>

        <pv-column field="deliveryDueDate" header="Fecha Entrega" sortable>
           <template #body="{ data }">
             <span class="quantity-cell">{{ formatDate(data.deliveryDueDate) }}</span>
           </template>
        </pv-column>

        <pv-column field="status" header="Estado" sortable>
          <template #body="{ data }">
            <button
                class="status-badge"
                :class="statusClassFor(data.status)"
                @click="goToOrderDetail({ data })"
                :title="t('orders.actions.view_tracking')"
            >
              <span class="status-dot"/>
              {{ data.status }}
            </button>
          </template>
        </pv-column>

        <pv-column header="Acciones" headerStyle="text-align: right">
          <template #body="{ data }">
            <div class="row-actions-right">
              <button class="icon-btn-minimal" @click="goToOrderDetail({ data })" title="Ver detalle">
                <i class="pi pi-eye"/>
              </button>
              <button class="icon-btn-minimal" :class="{ disabled: isStatusRestricted(data.status) }" @click="!isStatusRestricted(data.status) && showOrderEdit(data)" title="Editar">
                <i class="pi pi-pencil"/>
              </button>
            </div>
          </template>
        </pv-column>

        <template #empty>
          <div class="empty-state-container">
            <i class="pi pi-inbox empty-icon"/>
            <p class="empty-message">{{ t('orders.table.empty') }}</p>
            <p class="empty-subtitle">{{ t('orders.table.empty_subtitle') }}</p>
          </div>
        </template>
      </pv-data-table>
    </div>

    <!-- Dialog for Order Editing -->
    <order-edit v-model:visible="isOrderEditVisible" :order="selectedOrder" @save="handleOrderSave"/>

    <!-- Dialog for Assigning Producer -->
    <assign-producer-dialog
        v-model:visible="isAssignDialogVisible"
        :order="selectedOrder"
        @confirm="handleAssignConfirm"
        @cancel-order="handleAssignCancelOrder"
    />

    <!-- Dialog de Detalle de Frutas -->
    <pv-dialog
        v-model:visible="isFruitsDetailVisible"
        modal
        :header="t('orders.detail.title', { id: selectedOrder?.id ?? '' })"
        :style="{ width: '400px' }"
        :breakpoints="{ '575px': '90vw' }"
        class="fruits-detail-dialog"
    >
      <div class="detail-body" v-if="selectedOrder">
        <p class="detail-subtitle">{{ t('orders.detail.subtitle') }}</p>
        <div class="fruits-list">
          <div v-for="f in selectedOrder.selectedFruits" :key="f.id" class="fruit-item">
            <div class="fruit-icon">
              <i class="pi pi-shopping-bag"/>
            </div>
            <div class="fruit-info">
              <span class="fruit-name">{{ f.name }}</span>
              <span class="fruit-qty">{{ Number(f.quantity).toLocaleString('es-PE') }} kg</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="detail-footer">
          <button class="close-detail-btn" @click="isFruitsDetailVisible = false">{{ t('common.close') }}</button>
        </div>
      </template>
    </pv-dialog>

    <!-- Dialog de Confirmación de Borrado -->
    <pv-dialog
        v-model:visible="isDeleteConfirmVisible"
        modal
        :closable="true"
        :style="{ width: '420px' }"
        :breakpoints="{ '575px': '90vw' }"
        class="delete-confirm-dialog"
    >
      <template #header>
        <div class="delete-header">
          <div class="delete-icon-wrap"><i class="pi pi-exclamation-triangle"/></div>
          <span>{{ t('orders.delete_confirm.title') }}</span>
        </div>
      </template>

      <div class="delete-body" v-if="orderToDelete">
        <p class="delete-message">
          {{ t('orders.delete_confirm.message', {id: orderToDelete.id}) }}
        </p>
        <div class="delete-detail">
          <div class="delete-detail-row">
            <span class="detail-label">Cliente</span>
            <span class="detail-value">{{ orderToDelete.clientName }}</span>
          </div>
          <div class="delete-detail-row">
            <span class="detail-label">Total Cantidad</span>
            <span class="detail-value">{{ orderToDelete.quantity }}</span>
          </div>
        </div>
        <p class="delete-warning">{{ t('orders.delete_confirm.warning') }}</p>
      </div>

      <template #footer>
        <div class="delete-footer">
          <button class="cancel-del-btn" @click="isDeleteConfirmVisible = false">
            <i class="pi pi-times"/> {{ t('common.cancel') }}
          </button>
          <button class="confirm-del-btn" @click="confirmDelete">
            <i class="pi pi-trash"/> {{ t('orders.delete_confirm.confirm') }}
          </button>
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import OrderEdit from './order-edit.vue';
import {useOrderManagementStore} from '../../application/order-management.store.js';

const router = useRouter();

const orderStore = useOrderManagementStore();
const {t} = useI18n();

const searchQuery = ref('');
const activeStatusTab = ref('Todos');

const isOrderEditVisible = ref(false);
const isDeleteConfirmVisible = ref(false);
const isFruitsDetailVisible = ref(false);
const isAssignDialogVisible = ref(false);

const selectedOrder = ref(null);
const orderToDelete = ref(null);

// `activeOrders` filtra cancelados → la eliminación lógica los oculta de la tabla
// del distribuidor pero quedan en `orderStore.orders` para reportes/auditoría.
const orders = computed(() => orderStore.activeOrders);

const filteredOrders = computed(() => {
  let result = orders.value;

  if (activeStatusTab.value !== 'Todos') {
    result = result.filter(o => {
        const s = (o.status || '').toLowerCase();
        const tab = activeStatusTab.value.toLowerCase();
        if (tab === 'en preparación' && (s.includes('prepar') || s.includes('asignado'))) return true;
        if (tab === 'en ruta' && (s.includes('ruta') || s.includes('camino') || s.includes('transit'))) return true;
        if (tab === 'pendiente' && (s.includes('pend') || s.includes('registrado'))) return true;
        return s.includes(tab);
    });
  }

  const q = searchQuery.value.toLowerCase().trim();
  if (q) {
    result = result.filter(o => {
      const fruitLabel = getFruitLabelGroup(o).toLowerCase();
      return (
          (o.id ?? '').toLowerCase().includes(q) ||
          (o.clientName ?? '').toLowerCase().includes(q) ||
          (o.status ?? '').toLowerCase().includes(q) ||
          fruitLabel.includes(q)
      );
    });
  }
  return result;
});

const totalActivos = computed(() => orders.value.length);
const transitOrdersCount = computed(() =>
    orders.value.filter(o => o.status === 'En Camino' || o.status === 'EN_TRANSITO').length
);

onMounted(() => {
  if (!orderStore.ordersLoaded) {
    orderStore.fetchOrders();
  }
});

function formatDate(dateString) {
  if (!dateString) return '24 Oct 2026'; // Default fallback since mock data is null
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns 2-letter uppercase initials from a client name. */
function getInitials(name) {
  if (!name) return '??';
  const clean = String(name).replace(/\s+/g, ' ').trim();
  const words = clean.split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

/** Resolves a printable fruit label from order shape (entity or raw JSON). */
function getFruitLabelGroup(order) {
  if (!order) return '—';

  // 1. LA MAGIA: Leemos la lista "items" que viene de tu API de C#
  if (Array.isArray(order.items) && order.items.length > 0) {
    const mainFruit = order.items[0].productName || 'Fruta';
    const othersCount = order.items.length - 1;

    // Sumamos los kilos de todos los items para tener el total exacto
    const totalKg = order.items.reduce((sum, item) => sum + (item.quantityKg || 0), 0);
    const qtyText = totalKg > 0 ? ` (${totalKg} kg)` : '';

    if (othersCount > 0) {
      return `${mainFruit} + ${othersCount} frutas${qtyText}`;
    } else {
      return `${mainFruit}${qtyText}`;
    }
  }

  // 2. Fallbacks (por si acaso usas datos antiguos en alguna parte)
  const qty = order.quantity ? ` (${order.quantity})` : '';

  const fruits = order.selectedFruits;
  if (Array.isArray(fruits) && fruits.length > 0) {
    const mainFruit = fruits[0].name || 'Fruta';
    const othersCount = fruits.length - 1;
    return othersCount > 0 ? `${mainFruit} + ${othersCount} frutas${qty}` : `${mainFruit}${qty}`;
  }

  const name = order.productName || order.product || order.fruitType;
  if (name) {
    return `${name}${qty}`;
  }

  // Si de verdad llega vacío
  return `Lote de Fruta${qty}`;
}
/** Navigates to the order detail view. */
function goToOrderDetail(event) {
  const order = event.data;
  if (order?.id) {
    router.push({ name: 'order-detail', params: { id: order.id } });
  }
}

/** Returns the CSS class for a given status string. */
function statusClassFor(status) {
  if (!status) return 'status-registered';
  const s = status.toLowerCase();
  if (s.includes('entregado')) return 'status-delivered';
  if (s.includes('retrasado')) return 'status-delayed';
  if (s.includes('cancelado')) return 'status-cancelled';
  if (s.includes('asignado')) return 'status-assigned';
  if (s.includes('registrado') || s === 'pending') return 'status-registered';
  if (s.includes('camino') || s.includes('transito')) return 'status-transit';
  return 'status-registered';
}

function showOrderEdit(order) {
  selectedOrder.value = order;
  isOrderEditVisible.value = true;
}

function showFruitsDetail(order) {
  selectedOrder.value = order;
  isFruitsDetailVisible.value = true;
}

function showAssignDialog(order) {
  selectedOrder.value = order;
  isAssignDialogVisible.value = true;
}

function showDeleteConfirm(order) {
  orderToDelete.value = order;
  isDeleteConfirmVisible.value = true;
}

async function handleAssignConfirm({orderId, producerId, totalCost}) {
  const order = orders.value.find(o => o.id === orderId);
  if (!order) return;
  await orderStore.updateOrder(orderId, {
    ...order,
    producerId,
    totalAmount: totalCost,
    status: 'Asignado',
    statusClass: 'status-assigned'
  });
}

async function handleAssignCancelOrder(order) {
  if (!order?.id) return;
  await orderStore.deleteOrder(order.id);
}

async function confirmDelete() {
  if (!orderToDelete.value) return;
  await orderStore.deleteOrder(orderToDelete.value.id);
  isDeleteConfirmVisible.value = false;
  orderToDelete.value = null;
}

async function handleOrderSave(orderData) {
  const order = orders.value.find(o => o.id === orderData.orderId);
  if (!order) return;
  await orderStore.updateOrder(orderData.orderId, {
    ...order,
    quantity: `${Number(orderData.quantity).toLocaleString('es-PE')} kg`,
    clientName: orderData.commercialClientId,
    producerId: orderData.producerId,
    totalAmount: orderData.totalAmount
  });
}

function isStatusRestricted(status) {
  if (!status) return false;
  const s = status.toLowerCase();
  return s.includes('entregado') || s.includes('cancelado');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  position: relative;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  gap: 2rem;
}

.title-area {
  flex: 1;
}

.breadcrumb {
  font-size: 0.72rem;
  color: #6b7a6b;
  margin-bottom: 0.6rem;
  display: flex;
  gap: 0.3rem;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.breadcrumb .sep {
  color: #a3b8a0;
}

.breadcrumb .active {
  color: #1a3020;
  font-weight: 700;
}

.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.35rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #4a6b4a;
  margin: 0;
  max-width: 450px;
  line-height: 1.4;
}

.actions-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.search-container {
  width: 380px;
}

.custom-search-input {
  background: #1e2d22 !important;
  border: 1.5px solid #1e2d22 !important;
  color: #e0ead0 !important;
  border-radius: 999px !important;
  font-size: 0.88rem !important;
  padding: 0.75rem 1rem 0.75rem 2.5rem !important;
  width: 100%;
}

.custom-search-input::placeholder {
  color: #7d8f7d !important;
}

:deep(.p-iconfield > .p-inputicon) {
  color: #7d8f7d;
  margin-left: 0.6rem;
}

.stats-cards {
  display: flex;
  gap: 0.75rem;
}

.stat-card {
  background: #1e2d22;
  color: white;
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 110px;
}

.stat-title {
  font-size: 0.6rem;
  font-weight: 700;
  color: #c8e645;
  margin-bottom: 0.15rem;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e5ecd8;
}

/* Table */
.table-card {
  background: #1e2d22;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 2.5rem;
}

:deep(.custom-datatable),
:deep(.p-datatable-header) {
  background: transparent;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #2a3d2e !important;
  color: #9ab39d !important;
  border-bottom: 1px solid #3d5c42 !important;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 1.1rem 1.5rem;
  font-size: 0.72rem;
  text-transform: uppercase;
}

:deep(.p-datatable-tbody > tr > td) {
  background-color: #1e2d22 !important;
  color: #e0ead0 !important;
  border-bottom: 1px solid #2a3d2e !important;
  padding: 1.1rem 1.5rem;
  vertical-align: middle;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none !important;
}

/* Paginator */
:deep(.p-paginator) {
  background-color: #1a2a1e !important;
  border-top: 1px solid #2a3d2e !important;
  padding: 1rem 2rem;
  justify-content: space-between !important;
  display: flex !important;
}

:deep(.p-paginator-current) {
  color: #6b8a6b !important;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-right: auto;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page),
:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-last) {
  color: #9ab39d !important;
  background: transparent !important;
  border: none !important;
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  margin: 0 2px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #c9e265 !important;
  color: #122216 !important;
  font-weight: 800;
}

:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-last) {
  display: none !important;
}

:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next) {
  background: #2a3d2e !important;
  color: #c9e265 !important;
}

/* Cells */
.id-cell {
  color: #d1dfd3;
  font-size: 0.82rem;
  font-weight: 600;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.client-badge {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #2a3d2e;
  border: 1px solid #3d5c42;
  color: #c9e265;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e0ead0;
  line-height: 1.25;
}

.fruit-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fruit-icon-mini {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(201, 226, 101, 0.15);
  color: #c9e265;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.fruit-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #e0ead0;
  line-height: 1.25;
}

.quantity-cell {
  font-size: 0.9rem;
  font-weight: 500;
  color: #e0ead0;
}

/* Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
  border: 1px solid transparent;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
}

.status-badge:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-delivered {
  background: #1bb37e;
  color: #ffffff;
  border-color: #1bb37e;
}

.status-transit {
  background: rgba(212, 163, 75, 0.12);
  color: #e5b95e;
  border-color: rgba(212, 163, 75, 0.45);
}

.status-delayed {
  background: rgba(242, 95, 92, 0.12);
  color: #f87171;
  border-color: rgba(242, 95, 92, 0.45);
}

.status-registered {
  background: rgba(148, 163, 184, 0.12);
  color: #cbd5e1;
  border-color: rgba(148, 163, 184, 0.45);
}

.status-assigned {
  background: rgba(96, 165, 250, 0.15);
  color: #93c5fd;
  border-color: rgba(96, 165, 250, 0.45);
}

.status-cancelled {
  background: rgba(120, 113, 108, 0.18);
  color: #a8a29e;
  border-color: rgba(120, 113, 108, 0.45);
  text-decoration: line-through;
}

/* Actions */
.row-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-btn {
  background-color: #2a3d2e;
  color: #9eb5a1;
  border: 1px solid #3d5c42;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.85rem;
}

.icon-btn:hover {
  background-color: #3a4a3c;
  color: #fff;
}

.icon-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #1a2a1e;
  color: #4a6b4a;
  border-color: #2a3d2e;
}

.icon-btn.disabled:hover {
  background-color: #1a2a1e;
  color: #4a6b4a;
}

.delete-btn:hover {
  background-color: rgba(242, 95, 92, 0.2);
  color: #f87171;
  border-color: rgba(242, 95, 92, 0.4);
}

/* ── Empty State ── */
.empty-state-container {
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #1e2d22;
  border-radius: 12px;
}

.empty-icon {
  font-size: 3rem;
  color: #3d5c42;
  margin-bottom: 1.25rem;
}

.empty-message {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e0ead0;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.85rem;
  color: #6b8a6b;
}

.assign-btn {
  background-color: #2a3d2e;
  color: #c9e265;
  border: 1px solid #3d5c42;
  padding: 0 0.9rem;
  height: 32px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'DM Sans', sans-serif;
}

.assign-btn:hover {
  background-color: #3a4a3c;
  color: #d4f06e;
  border-color: #4d6b50;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-area {
    align-items: stretch;
    width: 100%;
  }

  .search-container {
    width: 100%;
  }

  .stats-cards {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 1rem;
  }

  .table-card {
    overflow-x: auto;
  }

  :deep(.custom-datatable table) {
    min-width: 800px;
  }
}

:global(.delete-confirm-dialog) {
  font-family: 'DM Sans', sans-serif !important;
  background: #1a2a1e !important;
  border-radius: 16px !important;
  border: 1px solid #3d5c42 !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
}

:global(.delete-confirm-dialog .p-dialog-header),
:global(.delete-confirm-dialog .p-dialog-content),
:global(.delete-confirm-dialog .p-dialog-footer) {
  background: #1a2a1e !important;
  color: #e0ead0 !important;
  border: none !important;
}

:global(.delete-confirm-dialog .p-dialog-header) {
  padding: 1.25rem 1.5rem 0.5rem !important;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

:global(.delete-confirm-dialog .p-dialog-content) {
  padding: 0 1.5rem 0.5rem !important;
}

:global(.delete-confirm-dialog .p-dialog-footer) {
  padding: 0.75rem 1.5rem 1.25rem !important;
  border-bottom-left-radius: 16px !important;
  border-bottom-right-radius: 16px !important;
}

:global(.delete-confirm-dialog .p-dialog-header-icons .p-dialog-header-icon) {
  color: #6b8a6b !important;
}

:global(.delete-confirm-dialog .p-dialog-header-icons .p-dialog-header-icon:hover) {
  background: #2a3d2e !important;
  color: #e0ead0 !important;
}

.delete-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #e0ead0;
}

.delete-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.15);
  border: 1.5px solid rgba(251, 191, 36, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  font-size: 1.1rem;
}

.delete-body {
  font-family: 'DM Sans', sans-serif;
}

.delete-message {
  font-size: 0.9rem;
  color: #c8dcc8;
  margin: 0.5rem 0 1rem;
  line-height: 1.5;
}

.delete-id {
  color: #c8e645;
  font-weight: 800;
}

.delete-detail {
  background: #2a3d2e;
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.delete-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.83rem;
}

.detail-label {
  color: #6b8a6b;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.detail-value {
  color: #e0ead0;
  font-weight: 500;
  text-align: right;
}

.delete-warning {
  font-size: 0.75rem;
  color: #f87171;
  margin: 0;
}

.delete-footer {
  display: flex;
  gap: 0.75rem;
}

.cancel-del-btn, .confirm-del-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-family: 'DM Sans', sans-serif;
}

.cancel-del-btn {
  background: transparent;
  color: #8fba8f;
  border: 1.5px solid #3d5c42;
  transition: background 0.15s, color 0.15s;
}

.cancel-del-btn:hover {
  background: #2a3d2e;
  color: #e0ead0;
}

.confirm-del-btn {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1.5px solid rgba(248, 113, 113, 0.35);
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.confirm-del-btn:hover {
  background: rgba(248, 113, 113, 0.28);
  border-color: #f87171;
  color: #fca5a5;
}

:global(.fruits-detail-dialog) {
  font-family: 'DM Sans', sans-serif !important;
  background: #1a2a1e !important;
  border-radius: 16px !important;
  border: 1px solid #3d5c42 !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
}

:global(.fruits-detail-dialog .p-dialog-header),
:global(.fruits-detail-dialog .p-dialog-content),
:global(.fruits-detail-dialog .p-dialog-footer) {
  background: #1a2a1e !important;
  color: #e0ead0 !important;
  border: none !important;
}

:global(.fruits-detail-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem !important;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

:global(.fruits-detail-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.25rem !important;
}

:global(.fruits-detail-dialog .p-dialog-footer) {
  padding: 0 1.5rem 1.5rem !important;
  border-bottom-left-radius: 16px !important;
  border-bottom-right-radius: 16px !important;
}

:global(.fruits-detail-dialog .p-dialog-title) {
  font-weight: 800 !important;
  font-size: 1.15rem !important;
}

.detail-body {
  font-family: 'DM Sans', sans-serif;
}

.detail-subtitle {
  font-size: 0.82rem;
  color: #6b8a6b;
  margin-bottom: 1rem;
}

.fruits-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.fruit-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #2a3d2e;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #3d5c42;
}

.fruit-icon {
  width: 32px;
  height: 32px;
  background: rgba(201, 226, 101, 0.1);
  border: 1px solid rgba(201, 226, 101, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9e265;
  font-size: 0.9rem;
}

.fruit-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.fruit-qty {
  font-size: 0.72rem;
  color: #8fba8f;
}

.detail-footer {
  width: 100%;
}

.close-detail-btn {
  width: 100%;
  padding: 0.75rem;
  background: #c9e265;
  color: #122216;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}

.close-detail-btn:hover {
  background: #d6ec6e;
}

/* --- New elements --- */
.btn-outline-filter {
  background: transparent;
  color: #c9e265;
  border: 1.5px solid #3d5c42;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}
.btn-outline-filter:hover {
  background: #2a3d2e;
}
.btn-solid-primary {
  background: #c9e265;
  color: #122216;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-solid-primary:hover {
  background: #d6ec6e;
}
.quick-filters-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filter-pill {
  background: #1e2d22;
  color: #9ab39d;
  border: 1px solid #2a3d2e;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-pill:hover {
  background: #2a3d2e;
  color: #c9e265;
}
.filter-pill.active {
  background: #2a3d2e;
  color: #c9e265;
  border-color: #3d5c42;
}
.product-grouping {
  color: #c9e265;
  font-weight: 600;
  font-size: 0.85rem;
}
.row-actions-right {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.icon-btn-minimal {
  background: transparent;
  color: #9eb5a1;
  border: 1px solid transparent;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.95rem;
}
.icon-btn-minimal:hover {
  background: #2a3d2e;
  color: #c9e265;
  border-color: #3d5c42;
}
.icon-btn-minimal.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
  transition: background-color 0.15s;
}
:deep(.p-datatable-tbody > tr:hover > td) {
  background-color: #233527 !important;
}

/* Sorting Icons */
:deep(.p-sortable-column-icon) {
  color: #6b8a6b !important;
  width: 12px;
  height: 12px;
  margin-left: 0.4rem;
}
:deep(.p-sortable-column.p-highlight .p-sortable-column-icon) {
  color: #c9e265 !important;
}
</style>
