<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :closable="false"
      :show-header="false"
      :style="{ width: '960px', maxWidth: '95vw' }"
      :pt="{ root: { class: 'assign-producer-root' }, mask: { class: 'assign-producer-mask' }, content: { class: 'assign-producer-content' } }"
  >
    <div class="assign-layout">

      <!-- ── LEFT PANEL ─────────────────────────────── -->
      <aside class="left-panel">
        <button class="back-link" @click="close">
          <i class="pi pi-arrow-left" /> Volver a Pedidos
        </button>

        <h2 class="panel-title">Asignar Productor</h2>
        <p class="panel-subtitle">
          Revisa las especificaciones del pedido y selecciona un productor cercano a Lima para el despacho.
        </p>

        <div class="order-card">
          <div class="order-card-header">
            <div>
              <span class="kicker">N° DE PEDIDO</span>
              <h3 class="order-id">{{ order?.id ?? '—' }}</h3>
            </div>
            <span class="status-pill">{{ statusLabel }}</span>
          </div>

          <div class="info-grid">
            <div class="info-cell">
              <span class="kicker">CLIENTE</span>
              <span class="value">{{ order?.clientName ?? '—' }}</span>
            </div>
            <div class="info-cell">
              <span class="kicker">PRODUCTO</span>
              <span class="value">{{ productLabel }}</span>
            </div>
            <div class="info-cell">
              <span class="kicker">CANTIDAD</span>
              <span class="value">{{ order?.quantity ?? '—' }}</span>
            </div>
            <div class="info-cell">
              <span class="kicker">FECHA DE ENTREGA</span>
              <span class="value">{{ deliveryDate }}</span>
            </div>
          </div>

          <div class="hub-row">
            <span class="hub-icon"><i class="pi pi-map-marker" /></span>
            <div>
              <span class="kicker">HUB DE DESTINO</span>
              <span class="value">Centro de Distribución, Lima</span>
            </div>
          </div>
        </div>

        <button class="cancel-order-btn" @click="cancelOrder">
          <i class="pi pi-times-circle" /> Cancelar Pedido
        </button>
      </aside>

      <!-- ── RIGHT PANEL ────────────────────────────── -->
      <section class="right-panel">
        <header class="right-header">
          <div>
            <h2 class="panel-title">Productores Disponibles</h2>
            <p class="panel-subtitle">
              Mostrando {{ producers.length }} productores cercanos para "{{ productLabel }}"
            </p>
          </div>
          <div class="header-actions">
            <button class="icon-action" title="Filtrar"><i class="pi pi-filter" /></button>
            <button class="icon-action" title="Ordenar"><i class="pi pi-sort-alt" /></button>
          </div>
        </header>

        <ul class="producer-list">
          <li
              v-for="p in producers"
              :key="p.id"
              class="producer-row"
              :class="{ selected: selectedProducerId === p.id }"
              @click="selectedProducerId = p.id"
          >
            <div class="producer-avatar">
              <img :src="p.photo" :alt="p.name" />
              <span v-if="selectedProducerId === p.id" class="check-badge">
                <i class="pi pi-check" />
              </span>
            </div>

            <div class="producer-main">
              <span class="producer-name">{{ p.name }}</span>
              <div class="producer-meta">
                <div class="stars">
                  <i v-for="i in 5" :key="i" class="pi"
                     :class="i <= Math.round(p.rating) ? 'pi-star-fill' : 'pi-star'" />
                </div>
                <span class="rating-value">{{ p.rating.toFixed(1) }}</span>
                <span class="tag" :class="p.tagClass">{{ p.tag }}</span>
              </div>
              <span class="producer-location"><i class="pi pi-map" /> {{ p.location }}</span>
            </div>

            <div class="distance">
              <span class="distance-value">{{ p.distanceKm.toFixed(1) }} km</span>
              <span class="distance-label">DISTANCIA</span>
            </div>
          </li>
        </ul>

      </section>

    </div>

    <!-- ── FOOTER ──────────────────────────────────── -->
    <template #footer>
      <div class="dialog-footer">
        <div class="cost-block">
          <span class="kicker">COSTO TOTAL DEL ENVÍO</span>
          <span class="cost-value">S/ {{ totalCost.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>
        <button class="confirm-btn" :disabled="!selectedProducerId" @click="confirm">
          Confirmar Asignación <i class="pi pi-send" />
        </button>
      </div>
    </template>
  </pv-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  order:   { type: Object,  default: null }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel-order']);

// Productores de la zona de Lima — placeholder hasta integrar la API real.
const producers = ref([
  {
    id: 'p1',
    name: 'Carlos Méndez',
    location: 'Lurín, Lima',
    rating: 5.0,
    tag: 'TOP PERFORMER',
    tagClass: 'tag-top',
    distanceKm: 12.4,
    photo: 'https://ui-avatars.com/api/?name=Carlos+Mendez&background=c9e265&color=1a3020&size=96&bold=true'
  },
  {
    id: 'p2',
    name: 'Elena García',
    location: 'Mala, Cañete',
    rating: 4.8,
    tag: 'GRAN CAPACIDAD',
    tagClass: 'tag-capacity',
    distanceKm: 28.9,
    photo: 'https://ui-avatars.com/api/?name=Elena+Garcia&background=4d6b50&color=ffffff&size=96&bold=true'
  },
  {
    id: 'p3',
    name: 'Wilber Mendoza',
    location: 'Chilca, Cañete',
    rating: 4.7,
    tag: 'VERIFICADO',
    tagClass: 'tag-verified',
    distanceKm: 35.2,
    photo: 'https://ui-avatars.com/api/?name=Wilber+Mendoza&background=2a3d2e&color=c9e265&size=96&bold=true'
  }
]);

const selectedProducerId = ref(null);

// Cuando cambia el pedido, reseteo selección y preselecciono el productor existente si lo trae.
watch(() => props.order, (o) => {
  selectedProducerId.value = o?.producerId ?? null;
}, { immediate: true });

const productLabel = computed(() => {
  if (!props.order) return '—';
  if (props.order.product)   return props.order.product;
  if (props.order.fruitType) return props.order.fruitType;
  const fruits = props.order.selectedFruits;
  if (Array.isArray(fruits) && fruits.length > 0) return fruits[0].name;
  return '—';
});

const statusLabel = computed(() => {
  const s = props.order?.status;
  if (!s) return 'PENDIENTE';
  return String(s).toUpperCase();
});

const deliveryDate = computed(() => {
  const raw = props.order?.deliveryDueDate;
  if (!raw) return '24 Oct 2026';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
});

const selectedProducer = computed(() =>
    producers.value.find(p => p.id === selectedProducerId.value)
);

const etaMinutes = computed(() => {
  const km = selectedProducer.value?.distanceKm ?? 24;
  // Estimación naive: 1.4 min por km dentro del entorno limeño.
  return Math.round(km * 1.4);
});

const totalCost = computed(() => {
  const baseAmount = Number(props.order?.totalAmount ?? 0);
  const km = selectedProducer.value?.distanceKm ?? 0;
  // Costo logístico: 5% del valor del pedido + S/ 6.5 por km.
  return baseAmount + baseAmount * 0.05 + km * 6.5;
});

const routePath = computed(() => {
  // Curva entre los dos pines: (90,160) → (510,70). Control point alto al medio.
  return 'M 90 160 Q 300 0 510 70';
});

function close()       { emit('update:visible', false); }
function cancelOrder() { emit('cancel-order', props.order); close(); }
function confirm() {
  if (!selectedProducerId.value) return;
  emit('confirm', { orderId: props.order?.id, producerId: selectedProducerId.value, totalCost: totalCost.value });
  close();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.assign-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 1.5rem;
  font-family: 'DM Sans', sans-serif;
  color: #e0ead0;
  background: #0c1f15;
  padding: 1.5rem;
}

/* ── LEFT PANEL ─────────────────────────────── */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-link {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: #c9e265;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: 'DM Sans', sans-serif;
  padding: 0;
}
.back-link:hover { color: #d6ec6e; }

.panel-title {
  font-size: 1.55rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.panel-subtitle {
  font-size: 0.82rem;
  color: #8fba8f;
  margin: 0 0 0.5rem;
  line-height: 1.45;
}

.order-card {
  background: #1a2a1e;
  border: 1px solid #2a3d2e;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-id {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0.25rem 0 0;
  letter-spacing: -0.01em;
}

.kicker {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: #c9e265;
  letter-spacing: 0.12em;
}

.status-pill {
  background: rgba(201, 226, 101, 0.15);
  color: #c9e265;
  border: 1px solid rgba(201, 226, 101, 0.35);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem 1rem;
}

.info-cell { display: flex; flex-direction: column; gap: 0.25rem; }
.info-cell .value { font-size: 0.92rem; font-weight: 600; color: #ffffff; }

.hub-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-top: 0.85rem;
  border-top: 1px solid #2a3d2e;
}
.hub-row .value { font-size: 0.88rem; font-weight: 600; color: #ffffff; }

.hub-icon {
  width: 34px; height: 34px;
  background: rgba(201, 226, 101, 0.12);
  border: 1px solid rgba(201, 226, 101, 0.25);
  border-radius: 10px;
  display: inline-flex;
  align-items: center; justify-content: center;
  color: #c9e265; font-size: 0.9rem;
  flex-shrink: 0;
}

.cancel-order-btn {
  margin-top: auto;
  background: transparent;
  border: 1.5px solid rgba(242, 95, 92, 0.45);
  color: #f87171;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s, color 0.2s;
}
.cancel-order-btn:hover { background: rgba(242, 95, 92, 0.12); color: #fca5a5; }

/* ── RIGHT PANEL ────────────────────────────── */
.right-panel { display: flex; flex-direction: column; gap: 0.9rem; min-width: 0; }

.right-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.header-actions { display: flex; gap: 0.4rem; }

.icon-action {
  background: #1a2a1e;
  border: 1px solid #2a3d2e;
  color: #9ab39d;
  width: 34px; height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center; justify-content: center;
  transition: all 0.15s;
}
.icon-action:hover { background: #2a3d2e; color: #c9e265; }

.producer-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 0.65rem;
}

.producer-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  background: #1a2a1e;
  border: 1px solid #2a3d2e;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.producer-row:hover    { border-color: #3d5c42; background: #1e3022; }
.producer-row.selected { border-color: #c9e265; background: rgba(201, 226, 101, 0.06); }

.producer-avatar {
  position: relative;
  width: 48px; height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.producer-avatar img { width: 100%; height: 100%; object-fit: cover; }

.check-badge {
  position: absolute;
  bottom: -2px; right: -2px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #1bb37e;
  color: #fff;
  font-size: 0.55rem;
  display: inline-flex;
  align-items: center; justify-content: center;
  border: 2px solid #1a2a1e;
}

.producer-main {
  display: flex; flex-direction: column; gap: 0.25rem; min-width: 0;
}

.producer-name {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.producer-meta {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem;
}

.stars { display: inline-flex; gap: 1px; color: #facc15; font-size: 0.7rem; }

.rating-value { color: #ffffff; font-weight: 700; }

.tag {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
}
.tag-top      { background: rgba(201, 226, 101, 0.18); color: #c9e265; border: 1px solid rgba(201, 226, 101, 0.35); }
.tag-capacity { background: rgba(96, 165, 250, 0.15); color: #93c5fd; border: 1px solid rgba(96, 165, 250, 0.35); }
.tag-verified { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.35); }

.producer-location {
  font-size: 0.7rem;
  color: #8fba8f;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.distance { text-align: right; }
.distance-value {
  display: block;
  font-size: 1rem;
  font-weight: 800;
  color: #c9e265;
}
.distance-label {
  display: block;
  font-size: 0.55rem;
  font-weight: 700;
  color: #6b8a6b;
  letter-spacing: 0.12em;
}

/* MAP */
.map-section { display: flex; flex-direction: column; gap: 0.55rem; }

.map-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #6b8a6b;
  margin: 0;
}

.map-container {
  position: relative;
  border: 1px solid #2a3d2e;
  border-radius: 14px;
  overflow: hidden;
  background: #0c1f15;
}

.map-svg { display: block; width: 100%; height: auto; }

.map-top-bar {
  position: absolute;
  top: 0.7rem; left: 0.7rem; right: 0.7rem;
  display: flex; justify-content: space-between; align-items: center;
}

.route-label {
  background: rgba(12, 31, 21, 0.85);
  color: #c9e265;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #2a3d2e;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.pulse {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #c9e265;
  box-shadow: 0 0 0 0 rgba(201, 226, 101, 0.6);
  animation: pulse 1.6s infinite;
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0.6); }
  70%  { box-shadow: 0 0 0 10px rgba(201, 226, 101, 0); }
  100% { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0); }
}

.expand-btn {
  background: rgba(12, 31, 21, 0.85);
  border: 1px solid #2a3d2e;
  color: #c9e265;
  width: 28px; height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center; justify-content: center;
  font-size: 0.75rem;
}

.map-bottom-bar {
  position: absolute;
  bottom: 0.7rem; left: 0.7rem; right: 0.7rem;
  display: flex; gap: 0.4rem; align-items: center;
}

.map-pill {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
}
.map-pill.yellow { background: #c9e265; color: #122216; }
.map-pill.dark   { background: #1a2a1e; color: #c9e265; border: 1px solid #2a3d2e; }
.map-pill.eta    { margin-left: auto; }

/* FOOTER */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.5rem;
  background: #0a1810;
  border-top: 1px solid #1a2a1e;
}

.cost-block { display: flex; flex-direction: column; }
.cost-value {
  font-size: 1.65rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.confirm-btn {
  background: #c9e265;
  color: #1a3020;
  border: none;
  padding: 0.95rem 1.8rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, transform 0.1s;
}
.confirm-btn:hover:not(:disabled) { background: #d6ec6e; transform: translateY(-1px); }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

:global(.assign-producer-root) {
  background: #0c1f15 !important;
  border-radius: 18px !important;
  border: 1px solid #2a3d2e !important;
  box-shadow: 0 30px 60px rgba(0,0,0,0.55) !important;
  overflow: hidden !important;
  font-family: 'DM Sans', sans-serif !important;
}
:global(.assign-producer-content) {
  background: #0c1f15 !important;
  color: #e0ead0 !important;
  padding: 0 !important;
}
:global(.assign-producer-mask) {
  background: rgba(6, 14, 9, 0.78) !important;
  backdrop-filter: blur(2px);
}
:global(.assign-producer-root .p-dialog-footer) {
  padding: 0 !important;
  background: #0a1810 !important;
  border-top: none !important;
}

/* Responsive */
@media (max-width: 820px) {
  .assign-layout { grid-template-columns: 1fr; }
}
</style>
