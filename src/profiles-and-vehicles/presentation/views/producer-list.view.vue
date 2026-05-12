<template>
  <div class="page-wrapper">

    <!-- Header -->
    <div class="header-section">
      <div class="title-area">
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span class="sep">></span>
          <span class="active">Productores</span>
        </nav>
        <h1 class="page-title">Gestión de Productores</h1>
        <p class="page-subtitle">
          Productor: <strong>Finca El Paraíso</strong> · Origen: <strong>Mercado Santa Anita</strong>
        </p>
      </div>

      <div class="actions-area">
        <pv-icon-field iconPosition="left" class="search-container">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text v-model="searchQuery" placeholder="Buscar por nombre o especialidad..." class="custom-search-input" />
        </pv-icon-field>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-title">TOTAL PRODUCTORES</span>
        <span class="stat-value">{{ totalProducers.toLocaleString('es-PE') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-title">CALIDAD PROMEDIO</span>
        <span class="stat-value">{{ avgRating }} <i class="pi pi-star-fill star-mini" /></span>
      </div>
      <div class="stat-card">
        <span class="stat-title">PRODUCCIÓN SEMANAL</span>
        <span class="stat-value">{{ weeklyProduction }} <small class="stat-unit">Tn</small></span>
      </div>
      <div class="stat-card">
        <span class="stat-title">INCIDENCIAS (30D)</span>
        <span class="stat-value">{{ incidents30d }}</span>
      </div>
    </div>

    <!-- Producers list -->
    <div class="producer-grid">
      <article v-for="p in filteredProducers" :key="p.id" class="producer-card">

        <div class="producer-main">
          <img
              :src="avatarFor(p)"
              :alt="p.fullName"
              class="producer-photo"
              @error="onPhotoError($event, p)"
          />

          <div class="producer-info">
            <div class="name-row">
              <h3 class="producer-name">{{ p.fullName }}</h3>
              <span class="performance-badge" :class="badgeClass(p)">
                <i class="pi pi-verified" /> {{ badgeLabel(p) }}
              </span>
            </div>
            <span class="producer-location">
              <i class="pi pi-map-marker" /> {{ locationFor(p) }}
            </span>

            <div class="meta-grid">
              <div class="meta-cell">
                <span class="meta-label">Especialidad</span>
                <span class="meta-value">{{ p.crop || '—' }}</span>
              </div>
              <div class="meta-cell">
                <span class="meta-label">Calificación</span>
                <span class="stars">
                  <i v-for="i in 5" :key="i" class="pi"
                     :class="i <= Math.round(p.rating) ? 'pi-star-fill' : 'pi-star'" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="producer-actions">
          <button class="assign-btn" @click="assignToOrder(p)">
            Asignar a Pedido <i class="pi pi-arrow-right" />
          </button>
          <div class="sub-actions">
            <button class="ghost-btn" title="Editar" @click="editProducer(p)">
              <i class="pi pi-pencil" />
            </button>
            <button class="ghost-btn danger" title="Eliminar" @click="confirmDelete(p)">
              <i class="pi pi-trash" />
            </button>
          </div>
        </div>
      </article>

      <!-- Empty state -->
      <div v-if="!filteredProducers.length" class="empty-state">
        <i class="pi pi-users empty-icon" />
        <p>{{ searchQuery ? 'No se encontraron productores que coincidan con tu búsqueda.' : 'Aún no hay productores registrados.' }}</p>
        <button v-if="!searchQuery" class="primary-btn" @click="goToNew">
          <i class="pi pi-plus" /> Registrar el primero
        </button>
      </div>
    </div>

    <!-- FAB Agregar -->
    <button class="add-producer-fab" @click="goToNew">
      <i class="pi pi-plus" /> AGREGAR PRODUCTOR
    </button>

    <!-- Confirmación de eliminación -->
    <pv-dialog v-model:visible="isDeleteVisible" modal :style="{ width: '420px' }" class="delete-confirm-dialog">
      <template #header>
        <div class="delete-header">
          <div class="delete-icon-wrap"><i class="pi pi-exclamation-triangle" /></div>
          <span>Eliminar Productor</span>
        </div>
      </template>
      <div class="delete-body" v-if="producerToDelete">
        <p class="delete-message">
          ¿Estás seguro de eliminar a
          <strong class="delete-id">{{ producerToDelete.fullName }}</strong>?
        </p>
        <p class="delete-warning">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <div class="delete-footer">
          <button class="cancel-del-btn" @click="isDeleteVisible = false">
            <i class="pi pi-times" /> Cancelar
          </button>
          <button class="confirm-del-btn" @click="doDelete">
            <i class="pi pi-trash" /> Sí, eliminar
          </button>
        </div>
      </template>
    </pv-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProfilesAndVehiclesStore } from '../../application/profiles-and-vehicles.store.js';

const router = useRouter();
const store  = useProfilesAndVehiclesStore();

const searchQuery      = ref('');
const isDeleteVisible  = ref(false);
const producerToDelete = ref(null);

onMounted(() => store.fetchProducers());

const filteredProducers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  const list = store.producers;
  if (!q) return list;
  return list.filter(p =>
      (p.fullName ?? '').toLowerCase().includes(q) ||
      (p.crop ?? '').toLowerCase().includes(q) ||
      (p.city ?? '').toLowerCase().includes(q) ||
      (p.legalName ?? '').toLowerCase().includes(q)
  );
});

const totalProducers = computed(() => store.producers.length);

const avgRating = computed(() => {
  const list = store.producers;
  if (!list.length) return '—';
  const sum = list.reduce((s, p) => s + Number(p.rating ?? 0), 0);
  return (sum / list.length).toFixed(1);
});

const weeklyProduction = computed(() => {
  const list = store.producers;
  if (!list.length) return '0';
  // monthlyProduction puede venir como "12,000" → kg/mes. Semanal = mes/4. Tn = kg/1000.
  const totalMonthKg = list.reduce((s, p) => s + parseAmount(p.monthlyProduction), 0);
  return (totalMonthKg / 4 / 1000).toFixed(1);
});

const incidents30d = ref(0); // mocked hasta conectar con quality-control

function parseAmount(text) {
  if (typeof text === 'number') return text;
  if (!text) return 0;
  const n = parseFloat(String(text).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function locationFor(p) {
  return [p.city, p.region || p.country].filter(Boolean).join(', ') || '—';
}

function avatarFor(p) {
  if (p.photo) return p.photo;
  const name = encodeURIComponent(p.fullName ?? 'Productor');
  return `https://ui-avatars.com/api/?name=${name}&background=c9e265&color=1a3020&size=120&bold=true`;
}

function onPhotoError(e, p) {
  // Si la URL del productor falla, caemos al avatar de iniciales.
  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName ?? 'Productor')}&background=c9e265&color=1a3020&size=120&bold=true`;
}

function badgeLabel(p) {
  const r = Number(p.rating ?? 0);
  if (r >= 4.9) return 'TOP PERFORMER';
  if (r >= 4.5) return 'PERFORMANCE BADGE';
  if (r >= 4.0) return 'VERIFICADO';
  return 'NUEVO';
}
function badgeClass(p) {
  const r = Number(p.rating ?? 0);
  if (r >= 4.9) return 'badge-top';
  if (r >= 4.5) return 'badge-performance';
  if (r >= 4.0) return 'badge-verified';
  return 'badge-new';
}

function goToNew()            { router.push({ name: 'profiles-and-vehicles-new' }); }
function editProducer(p)      { router.push({ name: 'profiles-and-vehicles-edit', params: { id: p.id } }); }
function assignToOrder(p) {
  router.push({ name: 'order-list', query: { producer: String(p.id) } });
}

function confirmDelete(p) { producerToDelete.value = p; isDeleteVisible.value = true; }
async function doDelete() {
  if (!producerToDelete.value) return;
  await store.deleteProducer(producerToDelete.value.id);
  isDeleteVisible.value = false;
  producerToDelete.value = null;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem 5rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  position: relative;
}

/* ── Header ─────────────────────────────────── */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.title-area { flex: 1; }

.breadcrumb {
  font-size: 0.72rem;
  color: #6b7a6b;
  margin-bottom: 0.6rem;
  display: flex; gap: 0.3rem; align-items: center;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.breadcrumb .sep    { color: #a3b8a0; }
.breadcrumb .active { color: #1a3020; font-weight: 700; }

.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.35rem;
  letter-spacing: -0.02em;
}
.page-subtitle {
  font-size: 0.82rem;
  color: #4a6b4a;
  margin: 0;
}
.page-subtitle strong { color: #1a3020; font-weight: 700; }

.actions-area { display: flex; align-items: flex-start; }

.search-container { width: 380px; }
.custom-search-input {
  background: #1e2d22 !important;
  border: 1.5px solid #1e2d22 !important;
  color: #e0ead0 !important;
  border-radius: 999px !important;
  font-size: 0.88rem !important;
  padding: 0.8rem 1rem 0.8rem 2.5rem !important;
  width: 100%;
}
.custom-search-input::placeholder { color: #7d8f7d !important; }
:deep(.p-iconfield > .p-inputicon) { color: #7d8f7d; margin-left: 0.6rem; }

/* ── Stats ──────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #1e2d22;
  color: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex; flex-direction: column;
  gap: 0.3rem;
  border: 1px solid #2a3d2e;
}
.stat-title {
  font-size: 0.62rem;
  font-weight: 800;
  color: #c9e265;
  letter-spacing: 0.12em;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 900;
  color: #e5ecd8;
  letter-spacing: -0.01em;
}
.stat-unit { font-size: 0.9rem; font-weight: 700; color: #8fba8f; }
.star-mini { color: #facc15; font-size: 1rem; }

/* ── Producer cards ─────────────────────────── */
.producer-grid {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.producer-card {
  background: #1e2d22;
  border: 1px solid #2a3d2e;
  border-radius: 14px;
  padding: 1.1rem 1.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  transition: border-color 0.15s, transform 0.15s;
}
.producer-card:hover {
  border-color: #3d5c42;
  transform: translateY(-1px);
}

.producer-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.producer-photo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #2a3d2e;
}

.producer-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.producer-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.01em;
}

.performance-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  border: 1px solid transparent;
}
.badge-top         { background: rgba(201, 226, 101, 0.18); color: #c9e265; border-color: rgba(201, 226, 101, 0.4); }
.badge-performance { background: rgba(96, 165, 250, 0.15); color: #93c5fd; border-color: rgba(96, 165, 250, 0.35); }
.badge-verified    { background: rgba(34, 197, 94, 0.15); color: #86efac; border-color: rgba(34, 197, 94, 0.35); }
.badge-new         { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border-color: rgba(148, 163, 184, 0.35); }

.producer-location {
  font-size: 0.74rem;
  color: #8fba8f;
  display: inline-flex; align-items: center; gap: 0.35rem;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem 2.5rem;
  margin-top: 0.4rem;
}
.meta-cell { display: flex; flex-direction: column; gap: 0.1rem; min-width: 100px; }
.meta-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #6b8a6b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.meta-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e0ead0;
}
.stars { display: inline-flex; gap: 2px; color: #facc15; font-size: 0.85rem; }

/* ── Actions ────────────────────────────────── */
.producer-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.55rem;
  flex-shrink: 0;
}

.assign-btn {
  background: #0a1810;
  color: #c9e265;
  border: 1px solid #2a3d2e;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
}
.assign-btn:hover {
  background: #c9e265;
  color: #122216;
  border-color: #c9e265;
}

.sub-actions { display: flex; gap: 0.3rem; }

.ghost-btn {
  background: transparent;
  border: 1px solid #3d5c42;
  color: #8fba8f;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.15s;
}
.ghost-btn:hover { background: #2a3d2e; color: #c9e265; }
.ghost-btn.danger:hover {
  background: rgba(242, 95, 92, 0.18);
  color: #f87171;
  border-color: rgba(242, 95, 92, 0.45);
}

/* ── Empty state ────────────────────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  padding: 4rem 1rem; color: #8fba8f;
  background: #1e2d22;
  border: 1px dashed #3d5c42;
  border-radius: 14px;
}
.empty-icon { font-size: 2.5rem; color: #3d5c42; }
.primary-btn {
  background: #c9e265; color: #1a3020; border: none;
  padding: 0.7rem 1.3rem; border-radius: 10px;
  font-size: 0.85rem; font-weight: 800; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.45rem;
}
.primary-btn:hover { background: #d6ec6e; }

/* ── FAB ────────────────────────────────────── */
.add-producer-fab {
  position: fixed;
  bottom: 1.75rem;
  right: 2rem;
  background: #c9e265;
  color: #1a3020;
  border: none;
  padding: 0.85rem 1.3rem;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  box-shadow: 0 10px 28px rgba(201, 226, 101, 0.5);
  transition: transform 0.15s, background 0.15s;
  z-index: 50;
  font-family: 'DM Sans', sans-serif;
}
.add-producer-fab:hover { transform: translateY(-2px); background: #d6ec6e; }

/* ── Delete Dialog ──────────────────────────── */
:global(.delete-confirm-dialog) {
  font-family: 'DM Sans', sans-serif !important;
  background: #1a2a1e !important;
  border-radius: 16px !important;
  border: 1px solid #3d5c42 !important;
}
:global(.delete-confirm-dialog .p-dialog-header),
:global(.delete-confirm-dialog .p-dialog-content),
:global(.delete-confirm-dialog .p-dialog-footer) {
  background: #1a2a1e !important; color: #e0ead0 !important; border: none !important;
}
.delete-header { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
.delete-icon-wrap {
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(251, 191, 36, 0.15);
  border: 1.5px solid rgba(251, 191, 36, 0.35);
  display: flex; align-items: center; justify-content: center;
  color: #fbbf24; font-size: 1.1rem;
}
.delete-message { font-size: 0.9rem; color: #c8dcc8; margin: 0.5rem 0 1rem; }
.delete-id      { color: #c8e645; font-weight: 800; }
.delete-warning { font-size: 0.75rem; color: #f87171; margin: 0; }
.delete-footer  { display: flex; gap: 0.75rem; }
.cancel-del-btn, .confirm-del-btn {
  flex: 1; padding: 0.75rem; border-radius: 10px;
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.45rem;
  font-family: 'DM Sans', sans-serif;
}
.cancel-del-btn  { background: transparent; color: #8fba8f; border: 1.5px solid #3d5c42; }
.cancel-del-btn:hover { background: #2a3d2e; color: #e0ead0; }
.confirm-del-btn { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1.5px solid rgba(248, 113, 113, 0.35); }
.confirm-del-btn:hover { background: rgba(248, 113, 113, 0.28); border-color: #f87171; }

/* ── Responsive ─────────────────────────────── */
@media (max-width: 1100px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 820px) {
  .header-section  { flex-direction: column; }
  .actions-area    { width: 100%; }
  .search-container{ width: 100%; }
  .producer-card   { flex-direction: column; align-items: stretch; }
  .producer-actions{ flex-direction: row; justify-content: space-between; align-items: center; }
  .meta-grid       { grid-template-columns: 1fr; gap: 0.45rem; }
}
@media (max-width: 500px) {
  .stats-row     { grid-template-columns: 1fr; }
  .page-wrapper  { padding: 1rem 1rem 6rem; }
}
</style>
