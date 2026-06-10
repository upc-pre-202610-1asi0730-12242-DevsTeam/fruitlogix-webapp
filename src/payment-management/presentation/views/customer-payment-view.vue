<template>
  <div class="payment-page">
    <div class="payment-header">
      <button class="btn-back" @click="router.push('/customer/orders')">{{ t('pay.back', '← Volver a pedidos') }}</button>
      <h1 class="page-title">{{ t('pay.title', 'Confirmar Pago') }}</h1>
    </div>

    <div v-if="!order" class="not-found">
      <div class="not-found-icon">❌</div>
      <p>{{ t('pay.notFound', 'Pedido no encontrado') }}</p>
      <button class="btn-primary" @click="router.push('/customer/catalog')">{{ t('pay.goCatalog', 'Ir al catálogo') }}</button>
    </div>

<div v-else-if="order.paymentStatus === 'PAGADO'" class="success-screen">
  <div class="glow-icon">
    <i class="pi pi-check"></i>
  </div>
  <h2 class="success-title">{{ t('pay.success', '¡Pago Exitoso!') }}</h2>
  <p class="success-subtitle">
    Tu pedido <strong>{{ order.id }}</strong> {{ t('pay.confirmed', 'ha sido confirmado y está siendo procesado.') }}
  </p>
  <div class="success-details">
    <div class="success-row"><span>{{ t('pay.totalPaid', 'Total pagado') }}</span><span class="success-amount">S/ {{ order.total.toFixed(2) }}</span></div>
    <div class="success-row"><span>{{ t('pay.delivery', 'Fecha de entrega') }}</span><span>{{ formatDate(order.deliveryDate) }}</span></div>
    <div class="success-row"><span>{{ t('pay.address', 'Dirección') }}</span><span>{{ order.address }}</span></div>
  </div>
  <button class="btn-primary" @click="router.push('/customer/orders')">
    {{ t('pay.viewOrders', 'Ver mis pedidos') }} <i class="pi pi-arrow-right" style="margin-left: 6px;"></i>
  </button>
</div>

    <div v-else class="payment-layout">
      <!-- Order summary -->
      <div class="order-summary">
        <h3 class="section-title">{{ t('pay.summary', 'Resumen de Pedido') }}</h3>
        <div class="summary-id">{{ order.id }}</div>
        <div class="summary-items">
          <div v-for="item in order.items" :key="item.product.id" class="summary-item">
            <span class="item-emoji"><i class="pi pi-box"></i></span>
            <div class="item-info">
              <span class="item-name">{{ item.product.name }}</span>
              <span class="item-qty">{{ item.quantity }} {{ item.product.unit }}</span>
            </div>
            <span class="item-subtotal">S/ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-address">
          <span class="summary-label"><i class="pi pi-map-marker" style="margin-right: 4px;"></i> Entrega</span>
          <span class="summary-value">{{ order.address }}</span>
        </div>
        <div class="summary-address">
          <span class="summary-label"><i class="pi pi-calendar" style="margin-right: 4px;"></i> Fecha</span>
          <span class="summary-value">{{ formatDate(order.deliveryDate) }}</span>
        </div>
        <div class="summary-total">
          <span>{{ t('pay.totalLabel', 'TOTAL A PAGAR') }}</span>
          <span class="total-amount">S/ {{ order.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Payment form -->
      <div class="payment-form-section">
        <h3 class="section-title">{{ t('pay.method', 'Método de Pago') }}</h3>

        <!-- Payment tabs -->
        <div class="payment-tabs">
          <button :class="['tab', { active: payMethod === 'card' }]" @click="payMethod = 'card'">
            <span><i class="pi pi-credit-card"></i></span> Tarjeta
          </button>
          <button :class="['tab', { active: payMethod === 'yape' }]" @click="payMethod = 'yape'">
            <span><i class="pi pi-mobile"></i></span> Yape
          </button>
        </div>

        <!-- Card form -->
        <div v-if="payMethod === 'card'" class="card-form">
          <!-- Card preview -->
          <div class="card-preview">
            <div class="card-front">
              <div class="card-top-row">
                <div class="card-chip-svg">
                  <svg width="32" height="24" viewBox="0 0 32 24"><rect width="32" height="24" rx="4" fill="#d4a843"/><rect x="2" y="8" width="28" height="8" fill="#b8922e"/><rect x="12" y="2" width="8" height="20" fill="#b8922e"/></svg>
                </div>
                <div class="card-brand">{{ getCardBrand() }}</div>
              </div>
              <div class="card-number-preview">{{ formatCardPreview(cardNumber) }}</div>
              <div class="card-bottom">
                <div>
                  <div class="card-label">Titular</div>
                  <div class="card-value">{{ cardName || 'NOMBRE APELLIDO' }}</div>
                </div>
                <div>
                  <div class="card-label">Vence</div>
                  <div class="card-value">{{ cardExpiry || 'MM/AA' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('pay.cardNum', 'Número de Tarjeta') }}</label>
            <div class="input-wrapper">
              <input
                v-model="cardNumber"
                class="form-input"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatCardNumber"
              />
              <span class="input-icon">{{ getCardIcon() }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('pay.cardHolder', 'Nombre en la Tarjeta') }}</label>
            <input v-model="cardName" class="form-input" placeholder="Como aparece en la tarjeta" @input="cardName = cardName.toUpperCase()" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('pay.expiry', 'Vencimiento') }}</label>
              <input v-model="cardExpiry" class="form-input" placeholder="MM/AA" maxlength="5" @input="formatExpiry" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('pay.cvv', 'CVV') }}</label>
              <input v-model="cardCvv" class="form-input" placeholder="123" maxlength="3" type="password"
                @focus="isFlipped = true" @blur="isFlipped = false" />
            </div>
          </div>

          <div class="security-badges">
            <span class="security-badge"><i class="pi pi-lock" style="margin-right: 4px;"></i> SSL Seguro</span>
            <span class="security-badge"><i class="pi pi-shield" style="margin-right: 4px;"></i> Datos encriptados</span>
          </div>

          <button class="btn-pay" @click="processPayment" :disabled="processing || !isFormValid">
            <span v-if="processing"><span class="spinner"></span> {{ t('pay.processing', 'Procesando...') }}</span>
            <span v-else>{{ t('pay.payBtn', 'Pagar') }} S/ {{ order.total.toFixed(2) }}</span>
          </button>
        </div>

        <!-- Yape -->
        <div v-if="payMethod === 'yape'" class="yape-section">
          <div class="yape-header">
            <img src="../../../assets/yape_logo.png" alt="Yape" class="yape-top-logo" />
          </div>
          <div class="yape-card">
            <div class="yape-qr-wrapper">
              <img v-if="qrDataUrl" :src="qrDataUrl" width="220" height="220" style="border-radius: 12px;" />
            </div>
            
            <button class="btn-pay btn-yape-pay" @click="processPayment" :disabled="processing">
              <span v-if="processing"><span class="spinner spinner-white"></span> {{ t('pay.yapeVerify', 'Verificando...') }}</span>
              <span v-else>{{ t('pay.yapePayBtn', 'Paga aquí con Yape') }}</span>
            </button>
            
            <div class="yape-details-wrapper">
              <div class="yape-divider-or"><span>{{ t('pay.yapeOr', 'O usa el número') }}</span></div>
              <div class="yape-phone-row">
                <span class="yape-phone-icon"><i class="pi pi-mobile"></i></span>
                <span class="yape-number">+51 999 888 777</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import QRCode from 'qrcode';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../../order-management/application/cart.store.js';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const orderId = route.params.orderId;
const order = computed(() => cartStore.orders.find(o => o.id === orderId));

const payMethod = ref('card');
const cardNumber = ref('');
const cardName = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const isFlipped = ref(false);
const processing = ref(false);
const { t } = useI18n();

const qrDataUrl = ref('');

onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL('https://yape.com.pe/pagar/fruitlogix', {
    width: 220,
    margin: 2,
    color: {
      dark: '#6e1281',
      light: '#FFFFFF'
    }
  });
});

const isFormValid = computed(() => {
  if (payMethod.value === 'card') {
    return cardNumber.value.length === 19 && cardName.value.length > 3 && cardExpiry.value.length === 5 && cardCvv.value.length === 3;
  }
  return true;
});

function formatCardPreview(num) {
  const clean = num.replace(/\s/g, '');
  const parts = [];
  for (let i = 0; i < 16; i += 4) {
    const chunk = clean.slice(i, i + 4);
    parts.push(chunk.padEnd(4, '•'));
  }
  return parts.join(' ');
}

function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '');
  val = val.slice(0, 16);
  cardNumber.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(e) {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
  cardExpiry.value = val;
}

function getCardBrand() {
  const num = cardNumber.value.replace(/\s/g, '');
  if (num.startsWith('4')) return 'VISA';
  if (num.startsWith('5')) return 'MASTERCARD';
  if (num.startsWith('3')) return 'AMEX';
  return '';
}

function getCardIcon() {
  const num = cardNumber.value.replace(/\s/g, '');
  if (num.startsWith('4')) return '💙';
  if (num.startsWith('5')) return '🟠';
  if (num.startsWith('3')) return '🔵';
  return '💳';
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

async function processPayment() {
  processing.value = true;
  await new Promise(r => setTimeout(r, 2000));
  cartStore.payOrder(orderId);
  processing.value = false;
}
</script>

<style scoped>
.payment-page { padding: 32px; min-height: 100vh; background: #E1EBE1; }
.payment-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
.btn-back { background: none; border: none; color: #4a6b4a; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; padding: 0; }
.btn-back:hover { color: #1a3020; }
.page-title {   font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em; }

.not-found { text-align: center; padding: 80px 20px; background: #1e2d22; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
.not-found-icon { font-size: 48px; margin-bottom: 16px; }
.not-found p { color: #9ab39d; margin: 0 0 20px 0; font-weight: 600; }

/* Success */
.success-screen {
  max-width: 520px;
  margin: 60px auto;
  text-align: center;
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.glow-icon {
  width: 167px;
  height: 167px;
  border-radius: 50%;
  background: rgba(212, 233, 82, 0.1);
  border: 2px solid rgba(212, 233, 82, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: glow-pulse 2s ease-in-out infinite;
}

.glow-icon .pi {
  font-size: 55px;
  color: #D4E952;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,233,82,0.2); }
  50% { box-shadow: 0 0 0 12px rgba(212,233,82,0.0); }
}

.success-title {
  font-size: 26px;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.5px;
}

.success-subtitle {
  font-size: 14px;
  color: #9ab39d;
  margin: 0;
  line-height: 1.6;
  max-width: 380px;
}

.success-subtitle strong {
  color: #D4E952;
  font-weight: 700;
}

/* Layout */
.payment-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 28px; max-width: 960px; margin: 0 auto; }

.section-title { font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px 0; }

/* Order Summary */
.order-summary { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; height: fit-content; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.summary-id { font-size: 13px; color: #9ab39d; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 16px; background: rgba(255, 255, 255, 0.05); padding: 4px 10px; border-radius: 20px; display: inline-block; }
.summary-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.summary-item { display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
.item-emoji { font-size: 24px; }
.item-info { flex: 1; display: flex; flex-direction: column; }
.item-name { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.item-qty { font-size: 12px; color: #9ab39d; font-weight: 600; }
.item-subtotal { font-size: 14px; font-weight: 800; color: #FFFFFF; }
.summary-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 20px 0; }
.summary-address { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.summary-label { font-size: 11px; font-weight: 700; color: #9ab39d; text-transform: uppercase; letter-spacing: 0.5px; }
.summary-value { font-size: 14px; color: #FFFFFF; font-weight: 500; }
.summary-total { display: flex; justify-content: space-between; align-items: center; background: rgba(212, 233, 82, 0.05); border: 1px solid rgba(212, 233, 82, 0.5); border-radius: 12px; padding: 16px; margin-top: 24px; font-weight: 700; color: #FFFFFF; }
.total-amount { font-size: 22px; font-weight: 800; color: #FFFFFF; }

/* Payment section */
.payment-form-section { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

/* Tabs */
.payment-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; color: #9ab39d; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.tab:hover { border-color: rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); color: #FFFFFF; }
.tab.active { background: #D4E952; border-color: #D4E952; color: #121212; box-shadow: 0 4px 12px rgba(212,233,82,0.2); }

/* Card preview */
.card-preview { width: 100%; height: 180px; margin-bottom: 24px; perspective: 1000px; }
.card-front {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a3020 0%, #2A3D2E 50%, #4a6b4a 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(26,48,32,0.3);
}
.card-front::before {
  content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(215,236,110,0.1); border-radius: 50%;
}
.card-front::after {
  content: ''; position: absolute; bottom: -40px; left: 40px; width: 140px; height: 140px; background: rgba(255,255,255,0.05); border-radius: 50%;
}
.card-top-row { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
.card-chip-svg { position: relative; z-index: 1; }
.card-brand { font-size: 14px; font-weight: 800; letter-spacing: 2px; color: rgba(255,255,255,0.9); text-transform: uppercase; font-style: italic; }
.card-number-preview { font-size: 22px; font-weight: 600; letter-spacing: 3px; color: #fff; font-family: 'Courier New', Courier, monospace; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-top: 10px; }
.card-bottom { display: flex; gap: 40px; position: relative; z-index: 1; margin-top: 10px; }
.card-label { font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; font-weight: 600; }
.card-value { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; }

/* Card form fields */
.card-form { display: flex; flex-direction: column; }
.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; letter-spacing: 0.3px; }
.input-wrapper { position: relative; }
.input-wrapper .form-input { padding-right: 40px; }
.input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ab39d; }
.form-input { width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 12px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; transition: all 0.2s; box-sizing: border-box; }
.form-input:focus { outline: none; border-color: #D4E952; box-shadow: 0 0 0 3px rgba(212,233,82,0.2); }
.form-input::placeholder { color: #9ab39d; opacity: 0.6; }

.security-badges { display: flex; gap: 16px; margin-bottom: 24px; margin-top: 8px; justify-content: center; }
.security-badge { font-size: 12px; font-weight: 600; color: #9ab39d; display: flex; align-items: center; gap: 6px; }

/* Pay button */
.btn-pay { width: 100%; background: #D4E952; color: #121212; border: none; padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 0.5px; }
.btn-pay:hover:not(:disabled) { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(212,233,82,0.2); }
.btn-pay:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-yape { background: #6e1281; color: #fff; }
.btn-yape:hover:not(:disabled) { background: #5a22b8; box-shadow: 0 6px 16px rgba(108,43,217,0.25); }

.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: currentColor; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Yape section */
.yape-section { display: flex; flex-direction: column; gap: 0; background: #6e1281; border-radius: 16px; overflow: hidden; padding-bottom: 24px; box-shadow: 0 4px 12px rgba(116, 35, 132, 0.2); }
.yape-header { padding: 24px 0 12px; display: flex; justify-content: center; align-items: center; }
.yape-top-logo { width: 45px; height: auto; }
.yape-card { background: #FFFFFF; border-radius: 16px; margin: 0 24px; padding: 32px 24px 24px; display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.yape-qr-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qr-svg { border-radius: 12px; }

.btn-yape-pay { background: #30c6b6; color: #ffffff; width: auto; min-width: 200px; padding: 14px 32px; border-radius: 30px; font-size: 16px; font-weight: 800; box-shadow: 0 4px 12px rgba(48,198,182,0.3); margin-top: -10px; }
.btn-yape-pay:hover:not(:disabled) { background: #29b0a2; box-shadow: 0 6px 16px rgba(48,198,182,0.4); transform: translateY(-2px); }

.yape-details-wrapper { width: 100%; display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.yape-divider-or { width: 100%; display: flex; align-items: center; gap: 12px; }
.yape-divider-or::before, .yape-divider-or::after { content: ''; flex: 1; height: 1px; background: rgba(116, 35, 132, 0.1); }
.yape-divider-or span { font-size: 12px; font-weight: 600; color: #6e1281; white-space: nowrap; }
.yape-phone-row { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(116, 35, 132, 0.05); padding: 12px 24px; border-radius: 30px; border: 1px solid rgba(116, 35, 132, 0.1); }
.yape-phone-icon { font-size: 24px; color: #6e1281; }
.yape-number { font-size: 20px; font-weight: 800; color: #6e1281; letter-spacing: 1px; }

.btn-primary { background: #D4E952; color: #121212; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn-primary:hover { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,233,82,0.3); }

.yape-text-logo {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  font-family: 'Pacifico', cursive, sans-serif;
  letter-spacing: 2px;
}

@media (max-width: 900px) {
  .payment-layout { grid-template-columns: 1fr; }
}
</style>
