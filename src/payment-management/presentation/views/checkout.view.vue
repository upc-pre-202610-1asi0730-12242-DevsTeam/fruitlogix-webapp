<template>
  <div class="page-wrapper">
    <div class="checkout-container">
      <main class="payment-form-section">
        <header class="checkout-header">
          <h1 class="main-title">Confirm Your Payment</h1>
          <p class="subtitle">Secure checkout powered by <span class="provider">STRIPE</span></p>
        </header>

        <div class="method-selector">
          <button :class="['method-tab', { active: payMethod === 'card' }]" @click="payMethod = 'card'">
            <i class="pi pi-credit-card" /> Tarjeta (Stripe)
          </button>
          <button :class="['method-tab', { active: payMethod === 'yape' }]" @click="payMethod = 'yape'">
            <i class="pi pi-mobile" /> Yape
          </button>
        </div>

        <div class="form-content">

          <div v-if="paymentSuccess" style="text-align: center; padding: 3rem 1rem;">
            <i class="pi pi-check-circle" style="font-size: 5rem; color: #c9e265; margin-bottom: 1.5rem;"></i>
            <h2 style="color: white; font-size: 2rem; margin-bottom: 0.5rem;">¡Pago Exitoso!</h2>
            <p style="color: #6b8a6b; margin-bottom: 2rem;">
              Tu suscripción al <strong>FruitLogix Pro Plan</strong> ha sido activada correctamente.
            </p>
            <pv-button
                label="Volver al Dashboard"
                icon="pi pi-home"
                @click="router.push('/dashboard')"
                style="background: #c9e265; color: #1a3020; font-weight: bold; border: none; padding: 10px 20px;"
            />
          </div>

          <div v-else>
            <div v-if="payMethod === 'card'">
              <div v-if="loadingIntent" class="stripe-loader">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #c9e265;"></i>
                <p style="color: #6b8a6b; margin-top: 1rem; font-weight: bold;">Conectando con pasarela segura...</p>
              </div>

              <div v-else class="stripe-container dark-theme-override">
                <VueStripeProvider :publishable-key="publishableKey">
                  <VueStripeElements :client-secret="elementsOptions.clientSecret">
                    <VueStripePaymentElement />
                    <pv-button
                        label="Process Payment ⚡"
                        class="process-btn"
                        @click="handlePayment"
                        :disabled="processingPayment"
                        style="width: 100%; margin-top: 1.5rem;"
                    />
                  </VueStripeElements>
                </VueStripeProvider>
              </div>

              <div class="security-badges" style="margin-top: 2rem;">
                <span class="badge"><i class="pi pi-shield" /> SAFE & ENCRYPTED</span>
                <span class="badge"><i class="pi pi-check-circle" /> PCI-DSS COMPLIANT</span>
                <span class="badge"><i class="pi pi-lock" /> 256-BIT SSL</span>
              </div>
            </div>

            <div v-if="payMethod === 'yape'" class="yape-section">
              <div class="yape-header">
                <img src="../../../assets/yape_logo.png" alt="Yape" class="yape-top-logo" />
              </div>
              <div class="yape-card">
                <div class="yape-qr-wrapper">
                  <img v-if="qrDataUrl" :src="qrDataUrl" width="220" height="220" style="border-radius: 12px;" />
                </div>

                <button class="btn-yape-pay" @click="handleYapePayment" :disabled="processingPayment">
                  <span v-if="processingPayment"><span class="spinner spinner-white"></span> Verificando...</span>
                  <span v-else>Paga aquí con Yape</span>
                </button>

                <div class="yape-details-wrapper">
                  <div class="yape-divider-or"><span>O usa el número</span></div>
                  <div class="yape-phone-row">
                    <span class="yape-phone-icon"><i class="pi pi-mobile"></i></span>
                    <span class="yape-number">+51 999 888 777</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <aside class="summary-section">
        <div class="summary-card">
          <h2 class="summary-title">Order Summary</h2>

          <div class="item-card">
            <div style="background: #1e2d22; padding: 12px; border-radius: 8px; margin-right: 15px;">
              <i v-if="paymentType === 'subscription'" class="pi pi-star-fill" style="font-size: 1.8rem; color: #c9e265;"></i>
              <i v-else class="pi pi-box" style="font-size: 1.8rem; color: #c9e265;"></i>
            </div>
            <div class="item-info">
              <span class="item-name" v-if="paymentType === 'subscription'">FruitLogix Pro Plan</span>
              <span class="item-name" v-else>Invoice Payment (Order #{{ orderId }})</span>

              <span class="item-desc" v-if="paymentType === 'subscription'">Monthly SaaS Subscription</span>
              <span class="item-desc" v-else>Fruit Logistics Services</span>
            </div>
          </div>

          <div class="cost-breakdown">
            <div class="cost-row">
              <span>Subtotal</span>
              <span>${{ (amount * 0.82).toFixed(2) }}</span>
            </div>
            <div class="cost-row">
              <span>Processing Fee</span>
              <span>$0.00</span>
            </div>
            <div class="cost-row">
              <span>Tax (VAT 18%)</span>
              <span>${{ (amount * 0.18).toFixed(2) }}</span>
            </div>
          </div>

          <div class="total-display">
            <span class="total-label">TOTAL AMOUNT</span>
            <div class="total-val-row">
              <span class="total-value">${{ amount.toFixed(2) }}</span>
              <span class="currency">{{ currency.toUpperCase() }}</span>
            </div>
          </div>

          <div class="tos-note">
            <i class="pi pi-info-circle" />
            <p>By completing this payment, you agree to the FruitLogix <strong>Terms of Service</strong>. Transactions are secured and processed by Stripe.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseApi } from '../../../shared/infrastructure/base-api.js';
import { VueStripeProvider, VueStripeElements, VueStripePaymentElement } from '@vue-stripe/vue-stripe';

const route = useRoute();
const router = useRouter();
const api = new BaseApi();

const publishableKey = 'pk_test_51ToZMEAs00vdfdAM6Tuprxok9UF6VKXe1zUwpfcl6YfIvOTDBd156cth8iSzBEe3BPEX3zbC5sgHJviw9Maf5U7z00A7siCyjl';

const paymentType = ref(route.query.type || 'subscription');
const amount = ref(parseFloat(route.query.amount) || 29.00);
const currency = ref(route.query.currency || 'usd');
const orderId = ref(route.query.orderId || 'N/A');

const loadingIntent = ref(true);
const processingPayment = ref(false);
const paymentSuccess = ref(false);

const elementsOptions = ref({
  clientSecret: '',
  appearance: { theme: 'night' }
});

const payMethod = ref('card');
const qrDataUrl = ref('');

async function handleYapePayment() {
  processingPayment.value = true;
  setTimeout(() => {
    processingPayment.value = false;
    paymentSuccess.value = true;
    localStorage.setItem('isProUser', 'true');
  }, 2000);
}

onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL('https://yape.com.pe/pagar/fruitlogix', {
    width: 220, margin: 2,
    color: { dark: '#6e1281', light: '#FFFFFF' }
  });

  await initializeStripeSession();
});

async function initializeStripeSession() {
  loadingIntent.value = true;
  try {
    let response;
    if (paymentType.value === 'subscription') {
      response = await api.http.post('/payments/subscribe', {
        email: 'test@fruitlogix.com',
        name: 'FruitLogix User',
        planType: 'Pro_SaaS'
      });
    } else {
      response = await api.http.post('/payments/create-intent', {
        amount: amount.value,
        currency: currency.value,
        orderId: parseInt(orderId.value) || 0
      });
    }
    elementsOptions.value.clientSecret = response.data.clientSecret;
  } catch (error) {
    console.error("Error al conectar con Stripe:", error);
  } finally {
    loadingIntent.value = false;
  }
}

async function handlePayment() {
  processingPayment.value = true;

  setTimeout(() => {
    processingPayment.value = false;
    paymentSuccess.value = true;
    // Guardamos que ya es Pro para cambiar el botón de la cabecera
    localStorage.setItem('isProUser', 'true');
  }, 2000);
}
</script>

<style scoped>
/* ESTILOS BASE */
.page-wrapper { padding: 3rem; background: #e8f5e4; min-height: 100vh; display: flex; justify-content: center; align-items: center; font-family: 'DM Sans', sans-serif; }
.checkout-container { display: grid; grid-template-columns: 1fr 400px; gap: 4rem; max-width: 1100px; width: 100%; }
@media (max-width: 1024px) { .checkout-container { grid-template-columns: 1fr; gap: 2rem; } .page-wrapper { padding: 1.5rem; } }
.main-title { font-size: 2.2rem; font-weight: 900; color: #1a3020; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
.subtitle { font-size: 1rem; color: #4a6b4a; margin: 0 0 2.5rem; }
.provider { font-weight: 900; color: #1a3020; }
.method-selector { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; }
.method-tab { flex: 1; padding: 1rem; border: 1px solid #d0e0d0; border-radius: 12px; background: transparent; color: #4a6b4a; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s; }
.method-tab.active { background: #1e2d22; color: #c9e265; border-color: #1e2d22; }
.form-content { display: flex; flex-direction: column; gap: 1.5rem; }

/* STRIPE */
.stripe-container { background: white; padding: 20px; border-radius: 12px; border: 1px solid #d0e0d0; margin-bottom: 1rem; }
.stripe-loader { text-align: center; padding: 3rem; border: 1px dashed #6b8a6b; border-radius: 12px; }
.process-btn { background: #c9e265 !important; color: #1a3020 !important; border: none !important; font-weight: 900 !important; font-size: 1.1rem !important; border-radius: 16px !important; padding: 1.5rem !important; margin-top: 1rem; box-shadow: 0 10px 20px rgba(201, 226, 101, 0.2) !important; cursor: pointer;}
.security-badges { display: flex; justify-content: space-between; margin-top: 2rem; }
.badge { font-size: 0.65rem; font-weight: 900; color: #6b8a6b; display: flex; align-items: center; gap: 0.5rem; }

/* RESUMEN */
.summary-card { background: #1e2d22; border-radius: 28px; padding: 2.5rem; color: #e0ead0; }
.summary-title { font-size: 1.4rem; font-weight: 800; margin: 0 0 2rem; }
.item-card { background: #2a3d2e; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.item-name { display: block; font-weight: 800; font-size: 0.95rem; margin-bottom: 0.2rem; }
.item-desc { font-size: 0.75rem; color: #6b8a6b; }
.cost-breakdown { border-bottom: 1px solid #2a3d2e; padding-bottom: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.cost-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #8fba8f; font-weight: 600; }
.cost-row span:last-child { color: #e0ead0; font-weight: 800; }
.total-display { background: rgba(201, 226, 101, 0.05); border: 1px solid rgba(201, 226, 101, 0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
.total-label { font-size: 0.65rem; font-weight: 900; color: #c9e265; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
.total-val-row { display: flex; justify-content: space-between; align-items: baseline; }
.total-value { font-size: 2.2rem; font-weight: 900; color: #c9e265; }
.currency { font-size: 0.8rem; font-weight: 800; color: #6b8a6b; }
.tos-note { display: flex; gap: 1rem; color: #6b8a6b; font-size: 0.75rem; line-height: 1.6; }

/* ESTILOS YAPE (Importados de tu diseño) */
.yape-section { display: flex; flex-direction: column; gap: 0; background: #6e1281; border-radius: 16px; overflow: hidden; padding-bottom: 24px; box-shadow: 0 4px 12px rgba(116, 35, 132, 0.2); }
.yape-header { padding: 24px 0 12px; display: flex; justify-content: center; align-items: center; }
.yape-top-logo { width: 45px; height: auto; }
.yape-card { background: #FFFFFF; border-radius: 16px; margin: 0 24px; padding: 32px 24px 24px; display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.yape-qr-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; }

.btn-yape-pay { border: none; cursor: pointer; background: #30c6b6; color: #ffffff; width: auto; min-width: 200px; padding: 14px 32px; border-radius: 30px; font-size: 16px; font-weight: 800; box-shadow: 0 4px 12px rgba(48,198,182,0.3); margin-top: -10px; transition: all 0.2s;}
.btn-yape-pay:hover:not(:disabled) { background: #29b0a2; box-shadow: 0 6px 16px rgba(48,198,182,0.4); transform: translateY(-2px); }

.yape-details-wrapper { width: 100%; display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.yape-divider-or { width: 100%; display: flex; align-items: center; gap: 12px; }
.yape-divider-or::before, .yape-divider-or::after { content: ''; flex: 1; height: 1px; background: rgba(116, 35, 132, 0.1); }
.yape-divider-or span { font-size: 12px; font-weight: 600; color: #6e1281; white-space: nowrap; }
.yape-phone-row { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(116, 35, 132, 0.05); padding: 12px 24px; border-radius: 30px; border: 1px solid rgba(116, 35, 132, 0.1); }
.yape-phone-icon { font-size: 24px; color: #6e1281; }
.yape-number { font-size: 20px; font-weight: 800; color: #6e1281; letter-spacing: 1px; }

.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: currentColor; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>