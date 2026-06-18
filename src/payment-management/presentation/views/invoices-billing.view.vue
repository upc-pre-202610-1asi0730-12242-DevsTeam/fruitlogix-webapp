<template>
  <div class="page-wrapper">
    <header class="billing-header">
      <div class="header-info">
        <h1 class="page-title">Invoices & Billing</h1>
        <p class="page-subtitle">Monitor cash flows and historical transaction ledger.</p>
      </div>
      <div class="header-actions">
        <pv-button label="Filters" icon="pi pi-filter" class="p-button-secondary filter-btn" />
        <!-- Convertido a acción secundaria para casos excepcionales -->
        <pv-button 
  label="Manual Invoice" 
  icon="pi pi-file-edit" 
  class="p-button-text secondary-invoice-btn" 
  @click="handleNewInvoice" 
/>
      </div>
    </header>

    <!-- Operational KPI Section -->
    <div class="kpi-grid">
      <!-- KPI 1: Por Cobrar (Receivables) -->
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon-box"><i class="pi pi-arrow-down-left" /></div>
          <span class="kpi-trend positive">+5.2%</span>
        </div>
        <span class="kpi-label">Receivables (This Month)</span>
        <h2 class="kpi-value">${{ (42500).toLocaleString() }}</h2>
      </div>

      <!-- KPI 2: Por Pagar/Pagado a Productores -->
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon-box"><i class="pi pi-arrow-up-right" /></div>
          <span class="kpi-trend neutral">On Track</span>
        </div>
        <span class="kpi-label">Paid to Producers (This Month)</span>
        <h2 class="kpi-value">${{ (28300).toLocaleString() }}</h2>
      </div>

      <!-- KPI 3: Alertas Operativas (Facturas Vencidas) -->
      <div class="kpi-card alert-card">
        <div class="kpi-header">
          <div class="kpi-icon-box alert-icon"><i class="pi pi-exclamation-triangle" /></div>
          <span class="kpi-trend negative">Action Req.</span>
        </div>
        <span class="kpi-label">Overdue Invoices</span>
        <h2 class="kpi-value text-danger">3</h2>
      </div>
    </div>

    <!-- Table Section with Flow Tabs -->
    <div class="table-container">
      
      <!-- Flow Toggle Tabs -->
      <div class="tabs-header">
        <button class="tab-btn" :class="{ active: activeTab === 'receivables' }" @click="activeTab = 'receivables'">
          <i class="pi pi-download" /> Receivables (Clients)
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'payables' }" @click="activeTab = 'payables'">
          <i class="pi pi-upload" /> Payables (Producers)
        </button>
      </div>

      <div class="table-controls">
        <div class="search-wrap">
          <i class="pi pi-search" />
          <input type="text" placeholder="Search invoiceId, orderId or name..." />
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

      <pv-data-table :value="activeTab === 'receivables' ? store.receivables : store.payables"
                     class="custom-table" :loading="store.isLoading">
        <pv-column field="id" header="INVOICE ID">
          <template #body="slotProps">
            <span class="invoice-id">#{{ slotProps.data.id }}</span>
          </template>
        </pv-column>

        <!-- Columna dinámica: RECEIVABLE = clientId, PAYABLE = clientId (producer) -->
        <pv-column :header="activeTab === 'receivables' ? 'CLIENT ID' : 'PRODUCER ID'">
          <template #body="slotProps">
            <span class="party-name">{{ slotProps.data.clientId }}</span>
          </template>
        </pv-column>

        <pv-column field="orderId" header="ORDER REF">
          <template #body="slotProps">
            <span>{{ slotProps.data.orderId ? `ORD-${slotProps.data.orderId}` : '—' }}</span>
          </template>
        </pv-column>

        <pv-column field="issuedAt" header="ISSUE DATE">
          <template #body="slotProps">
            <span>{{ slotProps.data.issuedAt ? formatDate(slotProps.data.issuedAt) : '—' }}</span>
          </template>
        </pv-column>

        <pv-column field="totalAmount" header="TOTAL AMOUNT">
          <template #body="slotProps">
    <span class="amount-val">
      {{ slotProps.data.currency }} {{ slotProps.data.totalAmount.toLocaleString() }}
    </span>
          </template>
        </pv-column>

        <pv-column field="status" header="PAYMENT STATUS">
          <template #body="slotProps">
            <pv-tag
                :value="slotProps.data.status"
                :severity="getStatusSeverity(slotProps.data.status)"
                class="status-tag"
            />
          </template>
        </pv-column>

        <pv-column header="ACTIONS">
          <template #body>
            <pv-button icon="pi pi-file-pdf" class="p-button-text p-button-secondary action-btn" />
          </template>
        </pv-column>
      </pv-data-table>

      <div class="table-footer">
        <span class="showing-info">Showing {{ store.invoices?.length || 0 }} of 142 invoices</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentManagementStore } from '../../application/payment-management.store.js';

const store = usePaymentManagementStore();
const router = useRouter();

// Tab state para controlar la perspectiva de facturación
const activeTab = ref('receivables'); // 'receivables' (Cobrar a clientes) | 'payables' (Pagar a productores)

onMounted(() => {
  store.fetchInvoices();
});

function handleNewInvoice() {
  router.push({ name: 'payment-checkout' });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  });
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'PAID': return 'success';
    case 'PENDING': return 'warn';
    case 'OVERDUE': 
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

.header-actions { display: flex; gap: 1rem; align-items: center; }
.filter-btn { background: #1e2d22 !important; border-radius: 12px !important; color: #e0ead0 !important; }
.secondary-invoice-btn { color: #4a6b4a !important; font-weight: 700 !important; border: 1px solid rgba(74, 107, 74, 0.3) !important; border-radius: 12px !important; }
.secondary-invoice-btn:hover { background: rgba(74, 107, 74, 0.1) !important; }

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
.kpi-card { background: #1e2d22; border-radius: 20px; padding: 1.5rem; color: #e0ead0; border: 1px solid rgba(255,255,255,0.05); }
.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.kpi-icon-box { width: 44px; height: 44px; background: #2a3d2e; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 1.2rem; }
.kpi-trend { font-size: 0.75rem; font-weight: 800; border-radius: 8px; padding: 0.3rem 0.6rem; }
.kpi-trend.positive { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
.kpi-trend.negative { background: rgba(248, 113, 113, 0.1); color: #f87171; }
.kpi-trend.neutral { background: rgba(255, 255, 255, 0.05); color: #8fba8f; }
.kpi-label { font-size: 0.85rem; color: #8fba8f; font-weight: 600; display: block; margin-bottom: 0.4rem; }
.kpi-value { font-size: 1.75rem; font-weight: 900; margin: 0; }

/* Alert KPI Styles */
.alert-card { border-color: rgba(248, 113, 113, 0.3); background: linear-gradient(145deg, #1e2d22, #261f20); }
.alert-icon { color: #f87171; background: rgba(248, 113, 113, 0.1); }
.text-danger { color: #f87171 !important; }

/* Table Container & Tabs */
.table-container { background: #1e2d22; border-radius: 24px; padding: 1.5rem; color: #e0ead0; }

.tabs-header { display: flex; gap: 1rem; border-bottom: 2px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
.tab-btn { background: transparent; border: none; font-size: 0.95rem; font-weight: 800; color: #6b8a6b; padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
.tab-btn:hover { color: #c9e265; }
.tab-btn.active { color: #c9e265; border-bottom-color: #c9e265; }

.table-controls { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
.search-wrap { background: #2a3d2e; padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.search-wrap input { background: transparent; border: none; color: white; width: 100%; outline: none; font-size: 0.85rem; font-family: inherit; }
.date-picker-placeholder { background: #2a3d2e; padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem; color: #6b8a6b; font-size: 0.8rem; font-weight: 600; }
.date-picker-placeholder .to { font-weight: 900; color: #8fba8f; }
.export-btn { color: #8fba8f !important; font-weight: 800 !important; font-size: 0.75rem !important; }

/* Custom DataTable Styles */
:deep(.custom-table) { background: transparent !important; }
:deep(.p-datatable-thead > tr > th) { background: transparent !important; color: #6b8a6b !important; border-bottom: 1px solid #2a3d2e !important; font-size: 0.65rem !important; font-weight: 900 !important; letter-spacing: 0.1em !important; padding: 1rem !important; }
:deep(.p-datatable-tbody > tr) { background: transparent !important; color: #e0ead0 !important; }
:deep(.p-datatable-tbody > tr > td) { border-bottom: 1px solid #2a3d2e !important; padding: 1.25rem 1rem !important; font-size: 0.85rem !important; }

.invoice-id { color: #c9e265; font-weight: 800; }
.party-name { font-weight: 700; color: #FFFFFF; }
.amount-val { font-weight: 800; }
.status-tag { font-size: 0.6rem !important; font-weight: 900 !important; padding: 0.2rem 0.6rem !important; border-radius: 8px !important; letter-spacing: 0.05em; }

.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #2a3d2e; }
.showing-info { font-size: 0.75rem; color: #6b8a6b; font-weight: 600; }
.pagination { display: flex; align-items: center; gap: 0.5rem; }
.page-num { background: transparent; border: none; color: #6b8a6b; width: 32px; height: 32px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.page-num:hover { color: #e0ead0; }
.page-num.active { background: #c9e265; color: #1a3020; }
</style>