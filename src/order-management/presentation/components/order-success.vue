<template>
  <div class="page-wrapper">

    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span>Inicio</span>
      <span class="sep">></span>
      <span>Pedidos</span>
      <span class="sep">></span>
      <span class="active">Crear pedido</span>
    </nav>

    <h1 class="page-title">Crear Nuevo Pedido</h1>
    <p class="page-subtitle">Registre una nueva orden de suministro para la red de distribución global.</p>

    <!-- Success Card -->
    <div class="success-wrapper">
      <div class="success-card">

        <!-- Animated checkmark ring -->
        <div class="check-ring-outer">
          <div class="check-ring-inner">
            <svg class="check-icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="check-circle" cx="26" cy="26" r="24" stroke="#c8e645" stroke-width="3" fill="none"/>
              <path class="check-path" d="M14 26 L22 34 L38 18" stroke="#c8e645" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </div>
        </div>

        <h2 class="success-title">¡PEDIDO REGISTRADO<br/>EXITOSAMENTE!</h2>

        <p class="success-subtitle">
          Tu pedido ha sido confirmado. El productor asignado<br/>
          será notificado automáticamente y se iniciará<br/>
          la programación logística.
        </p>

        <div class="success-detail-row" v-if="order">
          <div class="detail-chip">
            <i class="pi pi-box"/>
            <span>{{ order.fruitType ? capitalize(order.fruitType) : 'Fruta' }}</span>
          </div>
          <div class="detail-chip">
            <i class="pi pi-chart-bar"/>
            <span>{{ order.quantity ? order.quantity + ' kg' : '—' }}</span>
          </div>
          <div class="detail-chip">
            <i class="pi pi-dollar"/>
            <span>S/. {{ order.totalAmount ? order.totalAmount.toFixed(2) : '0.00' }}</span>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn-volver" @click="$emit('volver')">
            <i class="pi pi-arrow-left"/>
            Volver
          </button>
          <button class="btn-nuevo" @click="$emit('nuevo-pedido')">
            <i class="pi pi-plus"/>
            Nuevo Pedido
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    default: null,
  }
})

defineEmits(['volver', 'nuevo-pedido'])

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
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
}

/* ── Breadcrumb ── */
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
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.87rem;
  color: #4a6b4a;
  margin: 0 0 2rem;
}

/* ── Success wrapper ── */
.success-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 3rem;
}

.success-card {
  background: #1e2d22;
  border-radius: 20px;
  padding: 3rem 3.5rem;
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  animation: fadeSlideUp 0.4s ease both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Animated check ring ── */
.check-ring-outer {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(200, 230, 69, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseRing 2.4s ease-in-out infinite;
}

@keyframes pulseRing {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200, 230, 69, 0.18); }
  50%       { box-shadow: 0 0 0 14px rgba(200, 230, 69, 0); }
}

.check-ring-inner {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #2a3d2e;
  border: 2.5px solid #3d5c42;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 44px;
  height: 44px;
}

.check-circle {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: drawCircle 0.6s ease 0.1s forwards;
}

.check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: drawCheck 0.4s ease 0.65s forwards;
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

/* ── Title ── */
.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #e0ead0;
  text-align: center;
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0;
}

/* ── Subtitle ── */
.success-subtitle {
  font-size: 0.84rem;
  color: #8fba8f;
  text-align: center;
  line-height: 1.65;
  margin: 0;
}

/* ── Detail chips ── */
.success-detail-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.detail-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: #2a3d2e;
  border: 1.5px solid #3d5c42;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #c8dcc8;
}

.detail-chip i {
  color: #4ade80;
  font-size: 0.82rem;
}

/* ── Buttons ── */
.btn-group {
  display: flex;
  gap: 0.85rem;
  width: 100%;
  margin-top: 0.4rem;
}

.btn-volver {
  flex: 1;
  padding: 0.8rem 1.2rem;
  background: transparent;
  border: 1.5px solid #3d5c42;
  border-radius: 12px;
  color: #8fba8f;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn-volver:hover {
  background: #2a3d2e;
  border-color: #6b8a6b;
  color: #e0ead0;
}

.btn-nuevo {
  flex: 1;
  padding: 0.8rem 1.2rem;
  background: #c8e645;
  border: none;
  border-radius: 12px;
  color: #1a3020;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, transform 0.1s;
}

.btn-nuevo:hover {
  background: #d4f06e;
  transform: translateY(-1px);
}

.btn-nuevo:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .page-wrapper {
    padding: 1.2rem 1rem;
  }

  .success-card {
    padding: 2rem 1.4rem;
  }

  .success-title {
    font-size: 1.25rem;
  }

  .btn-group {
    flex-direction: column;
  }
}
</style>
