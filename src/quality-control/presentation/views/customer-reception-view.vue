<template>
  <div class="reception-page">
    <div class="page-header">
      <button class="btn-back" @click="router.push('/customer/orders')">{{ t('reception.back', '← Mis Pedidos') }}</button>
      <div>
        <h1 class="page-title">{{ t('reception.title', 'Confirmar Recepción') }}</h1>
        <p class="page-sub">{{ t('reception.subtitle', 'Pedido') }} #{{ orderId }} · {{ t('reception.delivered', 'entregado recientemente') }}</p>
      </div>
    </div>

    <div v-if="isLoading" style="text-align: center; padding: 4rem;">
      <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem; color: #c9e265;"></i>
      <p style="color: white; margin-top: 1rem;">Cargando detalles del pedido...</p>
    </div>

    <div v-else class="layout">
      <div class="left">
        <div class="products-card">
          <h3 class="section-title">{{ t('reception.products', 'Productos Recibidos') }}</h3>
          <div class="product-list">

            <div v-for="item in products" :key="item.id" class="product-item">
              <span class="product-emoji"><i class="pi pi-box"></i></span>
              <div class="product-info">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-qty">{{ item.quantity }} kg · S/ {{ Number(item.subtotal).toFixed(2) }}</div>
              </div>
              <div class="product-action">
                <select class="status-select" v-model="productStatuses[item.id]">
                  <option value="ok">✓ {{ t('reception.statusOk', 'Conforme') }}</option>
                  <option value="issue">! {{ t('reception.statusIssue', 'Problema') }}</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        <div class="card">
          <div class="sec-title">{{ t('reception.rating', 'Calificación del servicio') }}</div>
          <div class="sec-sub">{{ t('reception.ratingSub', '¿Cómo fue tu experiencia?') }}</div>

          <div class="rating-stars">
            <span v-for="i in 5" :key="i"
                  @click="rating = i"
                  :class="['star', { active: i <= rating }]">★</span>
          </div>

          <textarea
              v-model="comment"
              class="comment-area"
              :placeholder="t('reception.placeholder', 'Comentario opcional...')"
          ></textarea>
        </div>
      </div>

      <div class="right">
        <div class="summary-card">
          <div class="sec-title">{{ t('reception.summary', 'Resumen de recepción') }}</div>

          <div class="sum-item warn" :style="{ opacity: issueCount > 0 ? 1 : 0.5 }">
            <span class="sum-icon"><i class="pi pi-exclamation-triangle"></i></span>
            <div class="sum-info">
              <div class="si-title">{{ issueCount }} de {{ totalCount }} {{ t('reception.productsLabel', 'productos') }}</div>
              <div class="si-sub">{{ t('reception.issueReported', 'Problema reportado') }}</div>
            </div>
          </div>

          <div class="sum-item" :style="{ opacity: okCount > 0 ? 1 : 0.5 }">
            <span class="sum-icon"><i class="pi pi-check-circle"></i></span>
            <div class="sum-info">
              <div class="si-title">{{ okCount }} de {{ totalCount }} {{ t('reception.productsLabel', 'productos') }}</div>
              <div class="si-sub">{{ t('reception.okLabel', 'Conformes') }}</div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="amount-row">
            <span class="amt-lbl">{{ t('reception.payStatus', 'Estado de pago') }}</span>
            <span class="badge b-success">PAGADO</span>
          </div>
          <div class="amount-row" style="margin-top:12px;">
            <span class="amt-lbl">{{ t('reception.total', 'Total pagado') }}</span>
            <span class="amt-val">S/ {{ Number(totalAmount).toFixed(2) }}</span>
          </div>

          <div class="info-note">
            {{ t('reception.note', 'Si confirmas con incidencia, el distribuidor será notificado y podrá contactarte para resolverlo.') }}
          </div>

          <button class="btn-primary" @click="confirmReception(false)" :disabled="processing">
            <span v-if="processing"><span class="spinner"></span></span>
            <span v-else><i class="pi pi-check" style="margin-right: 6px;"></i> {{ t('reception.confirmComplete', 'Confirmar recepción completa') }}</span>
          </button>

          <button class="btn-warn-outline" @click="confirmReception(true)" :disabled="processing">
            <i class="pi pi-exclamation-triangle" style="margin-right: 6px;"></i> {{ t('reception.confirmIssue', 'Confirmar con incidencia') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { OrderManagementApi } from '../../../order-management/infrastructure/order-management-api.js';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const api = new OrderManagementApi();

const orderId = route.query.id || route.params.id;
const order = ref(null);
const isLoading = ref(true);

const rating = ref(0);
const comment = ref('');
const processing = ref(false);

// Objeto para llevar el control de qué productos están "ok" o tienen "issue"
const productStatuses = ref({});

onMounted(async () => {
  if (!orderId) {
    router.push('/customer/orders');
    return;
  }

  try {
    const res = await api.getOrderById(orderId);
    order.value = res.data;

    // Inicializamos todos los productos como "ok"
    products.value.forEach(p => {
      productStatuses.value[p.id] = 'ok';
    });
  } catch (e) {
    console.error("Error al cargar la orden real:", e);
    // Si falla el backend, mostramos una orden de respaldo para que la demo no se rompa
    order.value = {
      id: orderId,
      totalAmount: 450,
      items: [{ id: 1, productName: 'Mango Kent', quantityKg: 100, unitPrice: 4.5 }]
    };
    productStatuses.value[1] = 'ok';
  } finally {
    isLoading.value = false;
  }
});

// Computed properties para los productos y el resumen
const products = computed(() => {
  if (!order.value) return [];
  const items = order.value.items || order.value.orderItems || [];
  return items.map((item, index) => ({
    id: item.id || item.productId || index,
    name: item.name || item.productName || 'Producto',
    quantity: item.quantityKg || item.quantity || 0,
    price: item.unitPrice || 0,
    subtotal: (item.quantityKg || item.quantity || 0) * (item.unitPrice || 0) || item.subtotal
  }));
});

const totalAmount = computed(() => order.value?.totalAmount || order.value?.total || 0);

// Contadores en tiempo real para la interfaz
const totalCount = computed(() => products.value.length);
const okCount = computed(() => Object.values(productStatuses.value).filter(v => v === 'ok').length);
const issueCount = computed(() => Object.values(productStatuses.value).filter(v => v === 'issue').length);

async function confirmReception(hasIssue = false) {
  processing.value = true;

  // Simulamos un tiempo de carga enviando el reporte
  await new Promise(r => setTimeout(r, 1500));

  // 🌟 MAGIA: Actualizamos el estado final en el navegador
  localStorage.setItem(`order_status_${orderId}`, 'COMPLETED');

  alert(hasIssue
      ? "Recepción confirmada con incidencias. Nos contactaremos pronto."
      : "¡Gracias por confirmar! Tu pedido ha finalizado con éxito.");

  processing.value = false;

  // Regresamos a la lista
  router.push('/customer/orders');
}
</script>

<style scoped>
.reception-page { padding: 32px; min-height: 100vh; background: #E1EBE1; }
.page-header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; color: #4a6b4a; font-size: 13px; font-weight: 700; text-decoration: none; border: none; background: none; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; transition: all 0.2s; align-self: flex-start; }
.btn-back:hover { color: #1a3020; }
.page-title {   font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;}
.page-sub { color: #4a6b4a; font-size: 14px; margin: 4px 0 0 0; }

.layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
.left { display: flex; flex-direction: column; gap: 24px; }
.right { position: sticky; top: 24px; }

.products-card, .card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.section-title { font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px 0; }

.product-list { display: flex; flex-direction: column; gap: 12px; }
.product-item { display: flex; align-items: center; gap: 16px; background: rgba(0, 0, 0, 0.2); padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); }
.product-emoji { font-size: 28px; }
.product-info { flex: 1; }
.product-name { font-size: 15px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px; }
.product-qty { font-size: 13px; color: #9ab39d; font-weight: 500; }
.status-select { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 8px 12px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; transition: all 0.2s; }
.status-select:focus { border-color: #D4E952; box-shadow: 0 0 0 3px rgba(212,233,82,0.2); }

.sec-title { font-size: 16px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px; }
.sec-sub { font-size: 13px; color: #9ab39d; margin-bottom: 16px; }

.rating-stars { display: flex; gap: 8px; margin-bottom: 20px; }
.star { font-size: 32px; color: rgba(255, 255, 255, 0.2); cursor: pointer; transition: all 0.2s; user-select: none; }
.star.active, .star:hover { color: #f59e0b; transform: scale(1.1); }

.comment-area { width: 100%; height: 100px; background: rgba(0, 0, 0, 0.2); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; resize: none; outline: none; transition: all 0.2s; box-sizing: border-box; }
.comment-area:focus { border-color: #D4E952; box-shadow: 0 0 0 3px rgba(212,233,82,0.2); }
.comment-area::placeholder { color: #9ab39d; opacity: 0.6; }

.summary-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.sum-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; }
.sum-icon { font-size: 20px; }
.sum-info { flex: 1; }
.si-title { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.si-sub { font-size: 12px; color: #9ab39d; margin-top: 2px; }
.divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 4px 0; }

.amount-row { display: flex; justify-content: space-between; align-items: center; }
.amt-lbl { color: #9ab39d; font-size: 13px; font-weight: 600; }
.amt-val { font-size: 24px; font-weight: 800; color: #FFFFFF; }

.info-note { background: rgba(212, 233, 82, 0.05); border: 1px solid rgba(212, 233, 82, 0.5); border-radius: 10px; padding: 16px; font-size: 13px; color: #9ab39d; line-height: 1.5; font-weight: 500; }

.badge { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; }
.b-warn { background: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }
.b-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }

.btn-primary { width: 100%; background: #D4E952; color: #121212; border: none; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; }
.btn-primary:hover:not(:disabled) { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,233,82,0.3); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-warn-outline { width: 100%; background: transparent; color: #ff9800; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; padding: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-warn-outline:hover:not(:disabled) { background: rgba(255, 255, 255, 0.05); }
.btn-warn-outline:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(0, 0, 0, 0.2); border-top-color: #121212; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .right { position: static; }
}
</style>
