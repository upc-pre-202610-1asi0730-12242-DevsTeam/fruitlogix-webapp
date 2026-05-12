<template>
  <div class="page-wrapper">
    <div class="checkout-container">
      <!-- Left: Form -->
      <main class="payment-form-section">
        <header class="checkout-header">
          <h1 class="main-title">Confirm Your Payment</h1>
          <p class="subtitle">Secure checkout powered by <span class="provider">CULQI</span> | <span class="provider">IZIPAY</span></p>
        </header>

        <div class="method-selector">
          <button class="method-tab active"><i class="pi pi-credit-card" /> Credit Card</button>
          <button class="method-tab"><i class="pi pi-building" /> Bank Transfer</button>
          <button class="method-tab"><i class="pi pi-wallet" /> Digital Wallet</button>
        </div>

        <div class="form-content">
          <div class="input-group">
            <label>SAVED CARD INFORMATION</label>
            <div class="input-wrap dark">
              <input type="text" value="••••  ••••  ••••  8842" disabled />
              <i class="pi pi-lock" />
            </div>
          </div>

          <div class="row-inputs">
            <div class="input-group">
              <label>EXPIRY DATE</label>
              <div class="input-wrap dark" :class="{ 'invalid': errors.expiryDate }">
                <input type="text" v-model="expiryDate" placeholder="MM / YY" @input="errors.expiryDate = false" />
              </div>
              <span v-if="errors.expiryDate" class="error-msg"><i class="pi pi-exclamation-circle" /> Campo obligatorio.</span>
            </div>
            <div class="input-group">
              <label>CVC CODE</label>
              <div class="input-wrap dark" :class="{ 'invalid': errors.cvcCode }">
                <input type="text" v-model="cvcCode" placeholder="•••" @input="errors.cvcCode = false" />
                <i class="pi pi-question-circle" />
              </div>
              <span v-if="errors.cvcCode" class="error-msg"><i class="pi pi-exclamation-circle" /> Campo obligatorio.</span>
            </div>
          </div>

          <div class="checkbox-wrap">
            <pv-checkbox :modelValue="true" :binary="true" inputId="saveCard" />
            <label for="saveCard">Save card details for future logistics transactions</label>
          </div>

          <pv-button label="Process Payment ⚡" class="process-btn" @click="handlePayment" :loading="store.isLoading" />

          <div class="security-badges">
            <span class="badge"><i class="pi pi-shield" /> SAFE & ENCRYPTED</span>
            <span class="badge"><i class="pi pi-check-circle" /> PCI-DSS COMPLIANT</span>
            <span class="badge"><i class="pi pi-lock" /> 256-BIT SSL</span>
          </div>
        </div>
      </main>

      <!-- Right: Summary -->
      <aside class="summary-section">
        <div class="summary-card">
          <h2 class="summary-title">Order Summary</h2>

          <div class="item-card">
            <img src="https://media.istockphoto.com/id/157428769/photo/limes.jpg?s=612x612&w=0&k=20&c=K59H9V9k1_X_K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K=" alt="Item" />
            <div class="item-info">
              <span class="item-name">Global Supply Premium</span>
              <span class="item-desc">Monthly Fleet Management Plan</span>
            </div>
          </div>

          <div class="cost-breakdown">
            <div class="cost-row">
              <span>Subscription Fee</span>
              <span>$499.00</span>
            </div>
            <div class="cost-row">
              <span>Processing Fee</span>
              <span>$12.50</span>
            </div>
            <div class="cost-row">
              <span>Tax (VAT 18%)</span>
              <span>$92.07</span>
            </div>
          </div>

          <div class="total-display">
            <span class="total-label">TOTAL AMOUNT</span>
            <div class="total-val-row">
              <span class="total-value">$603.57</span>
              <span class="currency">USD</span>
            </div>
          </div>

          <div class="tos-note">
            <i class="pi pi-info-circle" />
            <p>By completing this payment, you agree to the FruitLogix <strong>Terms of Service</strong> and <strong>SLA</strong> for perishable goods logistics. Your next billing cycle starts on Jan 1st, 2024.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentManagementStore } from '../../application/payment-management.store.js';

const router = useRouter();
const store = usePaymentManagementStore();

const expiryDate = ref('');
const cvcCode = ref('');
const errors = ref({
  expiryDate: false,
  cvcCode: false
});

async function handlePayment() {
  errors.value.expiryDate = !expiryDate.value;
  errors.value.cvcCode = !cvcCode.value;

  if (errors.value.expiryDate || errors.value.cvcCode) {
    return;
  }

  const result = await store.processPayment({
    amount: 603.57,
    timestamp: new Date().toISOString(),
    method: 'CREDIT_CARD',
    gatewayRef: 'EXT-REF-9900-LIME',
    status: 'PAID',
    details: { cardEnding: '4429' }
  });

  router.push({ name: 'payment-result', params: { id: result.id || 'new-tx-001' } });
}
</script>

<style scoped>
.page-wrapper {
  padding: 3rem;
  background: #e8f5e4;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'DM Sans', sans-serif;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  max-width: 1100px;
  width: 100%;
}

@media (max-width: 1024px) {
  .checkout-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .page-wrapper { padding: 1.5rem; }
}

/* Form Section */
.main-title { font-size: 2.2rem; font-weight: 900; color: #1a3020; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
.subtitle { font-size: 1rem; color: #4a6b4a; margin: 0 0 2.5rem; }
.provider { font-weight: 900; color: #1a3020; }

.method-selector { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; }
.method-tab {
  flex: 1; padding: 1rem; border: 1px solid #d0e0d0; border-radius: 12px;
  background: transparent; color: #4a6b4a; font-weight: 800; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer;
  transition: all 0.2s;
}
.method-tab.active { background: #1e2d22; color: #c9e265; border-color: #1e2d22; }

.form-content { display: flex; flex-direction: column; gap: 1.5rem; }
.input-group label { font-size: 0.65rem; font-weight: 900; color: #6b8a6b; letter-spacing: 0.05em; display: block; margin-bottom: 0.75rem; }
.input-wrap.dark { background: white; border: 1px solid #d0e0d0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; transition: border-color 0.2s; }
.input-wrap.dark.invalid { border-color: #ef4444 !important; }
.input-wrap.dark input { border: none; background: transparent; font-size: 1rem; font-weight: 700; color: #1a3020; outline: none; width: 100%; }
.input-wrap.dark i { color: #c9e265; font-size: 1.1rem; }

.error-msg { color: #ef4444; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; }

.row-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: flex-start; }

.checkbox-wrap { display: flex; align-items: center; gap: 0.75rem; color: #4a6b4a; font-size: 0.85rem; font-weight: 600; }

.process-btn {
  background: #c9e265 !important; color: #1a3020 !important; border: none !important;
  font-weight: 900 !important; font-size: 1.1rem !important; border-radius: 16px !important;
  padding: 1.5rem !important; margin-top: 1rem; box-shadow: 0 10px 20px rgba(201, 226, 101, 0.2) !important;
}

.security-badges { display: flex; justify-content: space-between; margin-top: 2rem; }
.badge { font-size: 0.65rem; font-weight: 900; color: #6b8a6b; display: flex; align-items: center; gap: 0.5rem; }

/* Summary Section */
.summary-card { background: #1e2d22; border-radius: 28px; padding: 2.5rem; color: #e0ead0; }
.summary-title { font-size: 1.4rem; font-weight: 800; margin: 0 0 2rem; }

.item-card {
  background: #2a3d2e; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
}
.item-card img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; }
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
.tos-note i { font-size: 1.1rem; color: #c9e265; margin-top: 0.2rem; }
.tos-note strong { color: #8fba8f; }
</style>
