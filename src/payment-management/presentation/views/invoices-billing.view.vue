<template>
  <div class="page-wrapper">
    <header class="billing-header">
      <div class="header-info">
        <h1 class="page-title">Invoices & Billing</h1>
        <p class="page-subtitle">Monitor cash flows and historical transaction ledger.</p>
      </div>
      <div class="header-actions">
        <pv-button label="Filters" icon="pi pi-filter" class="p-button-secondary filter-btn" />
        <pv-button label="New Invoice" icon="pi pi-plus" class="new-invoice-btn" @click="handleNewInvoice" />
      </div>
    </header>

    <!-- KPI Section -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon-box"><i class="pi pi-wallet" /></div>
          <span class="kpi-trend positive">+5.2%</span>
        </div>
        <span class="kpi-label">Total Outstanding</span>
        <h2 class="kpi-value">${{ store.billingStats.totalOutstanding.toLocaleString() }}</h2>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon-box"><i class="pi pi-money-bill" /></div>
          <span class="kpi-trend negative">-2.1%</span>
        </div>
        <span class="kpi-label">Recent Payments</span>
        <h2 class="kpi-value">${{ store.billingStats.recentPayments.toLocaleString() }}</h2>
      </div>

      <div class="kpi-card goal-card">
        <div class="goal-header">
          <span class="goal-label">REVENUE GOAL</span>
          <span class="goal-percent">78%</span>
        </div>
        <h2 class="goal-value">$85k</h2>
        <div class="progress-container">
          <div class="progress-bar" style="width: 78%"></div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <div class="table-controls">
        <div class="search-wrap">
          <i class="pi pi-search" />
          <input type="text" placeholder="Search invoiceId, orderId or custom" />
        </div>
        <div class="date-picker-placeholder">
          <i class="pi pi-calendar" />
          <span>mm/dd/yyyy</span>
          <span class="to">to</span>
          <span>mm/dd/yyyy</span>
          <i class="pi pi-calendar" />
        </div>
        <pv-button label="Export Report" icon="pi pi-download" class="p-button-text export-btn" />
      </div>

      <pv-data-table :value="store.invoices" class="custom-table" :loading="store.isLoading">
        <pv-column field="id" header="INVOICE ID">
          <template #body="slotProps">
            <span class="invoice-id">#{{ slotProps.data.id }}</span>
          </template>
        </pv-column>
        <pv-column field="orderRef" header="ORDER REF"></pv-column>
        <pv-column field="issueDate" header="ISSUE DATE"></pv-column>
        <pv-column field="totalAmount" header="TOTAL AMOUNT">
          <template #body="slotProps">
            <span class="amount-val">${{ slotProps.data.totalAmount.toLocaleString() }}</span>
          </template>
        </pv-column>
        <pv-column field="status" header="PAYMENT STATUS">
          <template #body="slotProps">
            <pv-tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" class="status-tag" />
          </template>
        </pv-column>
        <pv-column header="ACTIONS">
          <template #body>
            <pv-button icon="pi pi-file-pdf" class="p-button-text p-button-secondary action-btn" />
          </template>
        </pv-column>
      </pv-data-table>

      <div class="table-footer">
        <span class="showing-info">Showing {{ store.invoices.length }} of 142 invoices</span>
        <div class="pagination">
          <pv-button icon="pi pi-chevron-left" class="p-button-text p-button-sm" />
          <button class="page-num active">1</button>
          <button class="page-num">2</button>
          <button class="page-num">3</button>
          <pv-button icon="pi pi-chevron-right" class="p-button-text p-button-sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentManagementStore } from '../../application/payment-management.store.js';

const store = usePaymentManagementStore();
const router = useRouter();

onMounted(() => {
  store.fetchInvoices();
});

function handleNewInvoice() {
  router.push({ name: 'payment-checkout' });
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'PAID': return 'success';
    case 'PENDING': return 'warn';
    case 'FAILED': return 'danger';
    case 'REFUNDED': return 'info';
    default: return 'secondary';
  }
};
</script>

<style scoped>
.page-wrapper {
  padding: 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

.billing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.page-title { font-size: 1.8rem; font-weight: 800; color: #1a3020; margin: 0 0 0.25rem; }
.page-subtitle { font-size: 1rem; color: #4a6b4a; margin: 0; }

.header-actions { display: flex; gap: 1rem; }
.filter-btn { background: #1e2d22 !important; border-radius: 12px !important; color: #e0ead0 !important; }
.new-invoice-btn { background: #c9e265 !important; color: #1a3020 !important; border: none !important; border-radius: 12px !important; font-weight: 800 !important; }

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }

@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .table-controls { flex-direction: column; align-items: stretch; }
  .page-wrapper { padding: 1.5rem; }
}
.kpi-card { background: #1e2d22; border-radius: 20px; padding: 1.5rem; color: #e0ead0; }
.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.kpi-icon-box { width: 44px; height: 44px; background: #2a3d2e; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #c9e265; }
.kpi-trend { font-size: 0.75rem; font-weight: 800; border-radius: 8px; padding: 0.3rem 0.6rem; }
.kpi-trend.positive { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
.kpi-trend.negative { background: rgba(248, 113, 113, 0.1); color: #f87171; }
.kpi-label { font-size: 0.85rem; color: #8fba8f; font-weight: 600; display: block; margin-bottom: 0.4rem; }
.kpi-value { font-size: 1.75rem; font-weight: 900; margin: 0; }

.goal-card { padding-top: 2rem; }
.goal-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; }
.goal-label { font-size: 0.7rem; font-weight: 900; color: #c9e265; letter-spacing: 0.1em; }
.goal-percent { font-size: 1.1rem; font-weight: 900; color: #c9e265; }
.goal-value { font-size: 1.5rem; font-weight: 900; margin: 0 0 1rem; }
.progress-container { background: #2a3d2e; height: 10px; border-radius: 5px; overflow: hidden; }
.progress-bar { background: #c9e265; height: 100%; border-radius: 5px; }

/* Table Container */
.table-container { background: #1e2d22; border-radius: 24px; padding: 1.5rem; color: #e0ead0; }
.table-controls { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
.search-wrap { background: #2a3d2e; padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.search-wrap input { background: transparent; border: none; color: white; width: 100%; outline: none; font-size: 0.85rem; }
.date-picker-placeholder { background: #2a3d2e; padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem; color: #6b8a6b; font-size: 0.8rem; }
.date-picker-placeholder .to { font-weight: 900; color: #4a6b4a; }
.export-btn { color: #8fba8f !important; font-weight: 800 !important; font-size: 0.75rem !important; }

/* Custom DataTable Styles */
:deep(.custom-table) { background: transparent !important; }
:deep(.p-datatable-thead > tr > th) { background: transparent !important; color: #6b8a6b !important; border-bottom: 1px solid #2a3d2e !important; font-size: 0.65rem !important; font-weight: 900 !important; letter-spacing: 0.1em !important; padding: 1rem !important; }
:deep(.p-datatable-tbody > tr) { background: transparent !important; color: #e0ead0 !important; }
:deep(.p-datatable-tbody > tr > td) { border-bottom: 1px solid #2a3d2e !important; padding: 1.25rem 1rem !important; font-size: 0.85rem !important; }

.invoice-id { color: #c9e265; font-weight: 800; }
.amount-val { font-weight: 800; }
.status-tag { font-size: 0.6rem !important; font-weight: 900 !important; padding: 0.2rem 0.6rem !important; border-radius: 8px !important; }

.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #2a3d2e; }
.showing-info { font-size: 0.75rem; color: #6b8a6b; }
.pagination { display: flex; align-items: center; gap: 0.5rem; }
.page-num { background: transparent; border: none; color: #6b8a6b; width: 32px; height: 32px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; }
.page-num.active { background: #c9e265; color: #1a3020; }
</style>
