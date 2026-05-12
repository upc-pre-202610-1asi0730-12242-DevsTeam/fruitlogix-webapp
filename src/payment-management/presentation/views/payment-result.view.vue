<template>
  <div class="page-wrapper">
    <div class="top-nav">
      <pv-button label="BACK TO PAYMENTS" icon="pi pi-arrow-left" class="p-button-text back-btn" @click="router.push({ name: 'invoices-billing' })" />
    </div>
    <div class="result-layout">
      <!-- Success Box -->
      <main class="success-main">
        <div class="success-card">
          <div class="status-icon-box">
            <div class="check-circle"><i class="pi pi-check" /></div>
          </div>
          <h1 class="success-title">Success!</h1>
          <p class="success-subtitle">PAYMENT PROCESSED SUCCESSFULLY</p>

          <div class="tx-details">
            <div class="detail-row">
              <span class="d-label">Transaction ID</span>
              <span class="d-value">#FLX-882910</span>
            </div>
            <div class="detail-row">
              <span class="d-label">Amount</span>
              <span class="d-value amount">$128.50</span>
            </div>
            <div class="detail-row">
              <span class="d-label">Timestamp</span>
              <span class="d-value">Oct 24, 2023, 14:20:04</span>
            </div>
            <div class="detail-row">
              <span class="d-label">Gateway Reference</span>
              <span class="d-value">EXT-REF-9900-LIME</span>
            </div>
            <div class="detail-row">
              <span class="d-label">Payment Method</span>
              <span class="d-value method">
                <i class="pi pi-credit-card" /> Visa ending in 4429
              </span>
            </div>
          </div>

          <div class="actions">
            <pv-button label="Download PDF Receipt" icon="pi pi-download" class="download-btn" />
            <pv-button label="Print Record" icon="pi pi-print" class="p-button-text print-btn" />
          </div>

          <div class="email-notice">
            <i class="pi pi-envelope" />
            <span>A confirmation email with your invoice PDF has been sent to your inbox.</span>
          </div>
        </div>
      </main>

      <!-- Sidebar Info -->
      <aside class="result-sidebar">
        <!-- Error Preview Only (Visible if failed) -->
        <div class="error-card">
          <div class="error-header">
            <div class="error-icon"><i class="pi pi-times" /></div>
            <span>Payment Rejected</span>
            <span class="preview-tag">PREVIEW ONLY</span>
          </div>
          <p class="error-desc">The transaction was declined by your bank. Please check your card details or try an alternative payment method.</p>
          <pv-button label="Try Another Method" class="p-button-text retry-btn" />
        </div>

        <div class="logistics-card">
          <h3 class="side-title">Logistics Summary</h3>
          <div class="status-indicator">
            <span class="dot"></span>
            <span class="si-label">SHIPMENT STATUS</span>
            <span class="si-value">Pending Dispatch</span>
          </div>
          <div class="tracking-info">
            <span class="ti-label">TRACKING NUMBER</span>
            <span class="ti-value">TRK-990-22-ALPHA</span>
          </div>
        </div>

        <div class="health-card">
          <img src="https://v0.dev/placeholder.svg?height=200&width=300" alt="Supply Chain Health" class="health-img" />
          <div class="health-info">
            <span class="h-label">SUPPLY CHAIN HEALTH</span>
            <span class="h-value">Optimal Conditions</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.page-wrapper {
  padding: 3rem;
  background: #e8f5e4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'DM Sans', sans-serif;
}

.result-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 3rem;
  max-width: 1000px;
  width: 100%;
}

/* Top Nav */
.top-nav { display: flex; align-items: center; width: 100%; max-width: 1000px; margin-bottom: 2rem; }
.back-btn { color: #1a3020 !important; font-weight: 800 !important; font-size: 0.75rem !important; padding: 0 !important; }

/* Success Card */
.success-card { background: #1e2d22; border-radius: 32px; padding: 3rem; color: #e0ead0; text-align: center; }

.status-icon-box { display: flex; justify-content: center; margin-bottom: 1.5rem; }
.check-circle {
  width: 72px; height: 72px; background: #c9e265; border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem; color: #1a3020; transform: rotate(-5deg);
}

.success-title { font-size: 3.5rem; font-weight: 900; margin: 0 0 0.5rem; letter-spacing: -0.04em; }
.success-subtitle { font-size: 0.75rem; font-weight: 900; color: #8fba8f; letter-spacing: 0.15em; margin-bottom: 3rem; }

.tx-details { border-top: 1px solid #2a3d2e; padding-top: 2rem; margin-bottom: 3rem; display: flex; flex-direction: column; gap: 1.25rem; }
.detail-row { display: flex; justify-content: space-between; align-items: center; }
.d-label { font-size: 0.85rem; color: #6b8a6b; font-weight: 600; }
.d-value { font-size: 0.95rem; font-weight: 800; }
.d-value.amount { font-size: 1.5rem; color: #c9e265; }
.d-value.method { display: flex; align-items: center; gap: 0.75rem; color: #8fba8f; }

.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
.download-btn { background: #c9e265 !important; color: #1a3020 !important; border: none !important; font-weight: 900 !important; border-radius: 14px !important; padding: 1rem !important; }
.print-btn { background: #2a3d2e !important; color: #e0ead0 !important; font-weight: 800 !important; border-radius: 14px !important; }

.email-notice { background: rgba(201, 226, 101, 0.05); padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; text-align: left; font-size: 0.8rem; color: #8fba8f; line-height: 1.4; }
.email-notice i { font-size: 1.25rem; color: #c9e265; }

/* Sidebar */
.result-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }

.error-card { background: #1e2d22; border: 1.5px solid rgba(248, 113, 113, 0.3); border-radius: 20px; padding: 1.5rem; color: #e0ead0; }
.error-header { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; color: #fca5a5; margin-bottom: 1rem; font-size: 0.9rem; }
.error-icon { width: 32px; height: 32px; background: rgba(248, 113, 113, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.preview-tag { font-size: 0.55rem; background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; margin-left: auto; }
.error-desc { font-size: 0.75rem; color: #8fba8f; margin: 0 0 1.25rem; line-height: 1.5; }
.retry-btn { width: 100%; border: 1px solid #2a3d2e !important; color: #e0ead0 !important; font-size: 0.75rem !important; font-weight: 800 !important; border-radius: 10px !important; }

.logistics-card { background: #1e2d22; border-radius: 20px; padding: 1.5rem; color: #e0ead0; }
.side-title { font-size: 1rem; font-weight: 800; margin: 0 0 1.25rem; }
.status-indicator { margin-bottom: 1.25rem; }
.si-label { font-size: 0.6rem; font-weight: 900; color: #6b8a6b; display: block; margin-bottom: 0.4rem; }
.si-value { font-size: 0.9rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
.si-value::before { content: ''; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }
.tracking-info { padding-top: 1.25rem; border-top: 1px solid #2a3d2e; }
.ti-label { font-size: 0.6rem; font-weight: 900; color: #6b8a6b; display: block; margin-bottom: 0.4rem; }
.ti-value { font-size: 0.85rem; font-weight: 800; color: #c9e265; }

.health-card { background: #1e2d22; border-radius: 20px; overflow: hidden; position: relative; height: 240px; }
.health-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.3; }
.health-info { position: absolute; bottom: 1.5rem; left: 1.5rem; }
.h-label { font-size: 0.6rem; font-weight: 900; color: #6b8a6b; display: block; margin-bottom: 0.25rem; }
.h-value { font-size: 1rem; font-weight: 800; color: #e0ead0; }
</style>
