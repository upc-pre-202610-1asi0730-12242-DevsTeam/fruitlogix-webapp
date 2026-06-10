<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('dashboard.title', 'Mi Panel') }}</h1>
        <p class="page-sub">{{ t('dashboard.subtitle', 'Resumen de tu actividad comercial') }}</p>
      </div>
      <button class="btn-primary" @click="router.push('/customer/catalog')">{{ t('dashboard.newOrder', 'Nuevo Pedido') }}</button>
    </div>

    <div class="kpis">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.activeOrders', 'PEDIDOS ACTIVOS') }}</span>
          <span class="stat-icon"><i class="pi pi-box"></i></span>
        </div>
        <div class="stat-value">3</div>
        <div class="stat-badge">+1 esta semana</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.inTransit', 'EN TRÁNSITO') }}</span>
          <span class="stat-icon"><i class="pi pi-truck"></i></span>
        </div>
        <div class="stat-value">2</div>
        <div class="stat-badge">+2 esta semana</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.delivered', 'ENTREGADOS') }}</span>
          <span class="stat-icon"><i class="pi pi-check-circle"></i></span>
        </div>
        <div class="stat-value">S/ 8,450</div>
        <div class="stat-badge">Óptimo</div>
      </div>
    </div>

    <div class="grid2">
      <!-- Active Orders -->
      <div class="card card-large">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.activeOrdersTitle', 'Pedidos Activos') }}</h3>
          <button class="btn-text" @click="router.push('/customer/orders')">{{ t('dashboard.viewAll', 'Ver todos') }}</button>
        </div>
        <div class="card-body">
          <div class="active-order-item" @click="router.push('/customer/tracking/ORD-2025-089')">
            <div class="ao-icon"><i class="pi pi-truck"></i></div>
            <div class="ao-info">
              <div class="ao-title">Pedido #ORD-2025-089</div>
              <div class="ao-sub">{{ t('dashboard.inTransit', 'En Tránsito') }} · ETA 9:45 AM</div>
            </div>
            <span class="badge b-active">{{ t('dashboard.tracking', 'Rastrear') }}</span>
          </div>
          <div class="active-order-item" @click="router.push('/customer/orders')">
            <div class="ao-icon"><i class="pi pi-clock"></i></div>
            <div class="ao-info">
              <div class="ao-title">Pedido #ORD-2025-085</div>
              <div class="ao-sub">15 kg · Preparando</div>
            </div>
            <span class="badge b-pending">{{ t('dashboard.statusPending', 'En Producción') }}</span>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.alertsTitle', 'Notificaciones') }}</h3>
        </div>
        <div class="card-body">
          <div class="alert-item">
            <div class="alert-icon blue"><i class="pi pi-info-circle"></i></div>
            <div class="alert-info">
              <div class="alert-title">{{ t('dashboard.alertNear', 'El conductor está cerca') }}</div>
              <div class="alert-sub">{{ t('dashboard.alertNearSub', 'Pedido #ORD-2025-089') }}</div>
            </div>
          </div>
          <div class="alert-item">
            <div class="alert-icon green"><i class="pi pi-check"></i></div>
            <div class="alert-info">
              <div class="alert-title">{{ t('dashboard.alertDelivered', 'Pedido Entregado') }}</div>
              <div class="alert-sub">{{ t('dashboard.alertDeliveredSub', 'Pedido #ORD-2025-087') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid2">
      <!-- Quick History -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.historyTitle', 'Historial Reciente') }}</h3>
          <button class="btn-text" @click="router.push('/customer/orders')">{{ t('dashboard.viewAll', 'Ver todos') }}</button>
        </div>
        <div class="card-body">
          <div class="history-item">
            <div class="hi-info">
              <div class="hi-title">Pedido #ORD-2025-087</div>
              <div class="hi-sub">Entregado el 15 Feb</div>
            </div>
            <div class="hi-amount">S/ 850.00</div>
          </div>
          <div class="history-item">
            <div class="hi-info">
              <div class="hi-title">Pedido #ORD-2025-082</div>
              <div class="hi-sub">Entregado el 10 Feb</div>
            </div>
            <div class="hi-amount">S/ 1,200.00</div>
          </div>
        </div>
      </div>

      <!-- Chat Preview -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.chatTitle', 'Chat de Soporte') }}</h3>
          <button class="btn-text" @click="router.push('/customer/chat')">{{ t('dashboard.openChat', 'Abrir Chat') }}</button>
        </div>
        <div class="card-body chat-preview">
          <div class="chat-msg">
            <div class="chat-avatar">F</div>
            <div class="chat-bubble">{{ t('dashboard.chatMsg', 'Hola, ¿en qué podemos ayudarte hoy?') }}</div>
          </div>
          <button class="btn-outline-primary" @click="router.push('/customer/chat')">{{ t('dashboard.startChat', 'Iniciar conversación') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
</script>

<style scoped>
.dashboard-page { padding: 32px; min-height: 100vh; background: #E1EBE1; display: flex; flex-direction: column; gap: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.page-title {   font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;}
.page-sub { color: #4a6b4a; font-size: 14px; margin: 0; }

.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.stat-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); }
.stat-header { display: flex; justify-content: space-between; align-items: center; }
.stat-title { font-size: 11px; font-weight: 800; color: #9ab39d; letter-spacing: 0.5px; }
.stat-icon { font-size: 20px; }
.stat-value { font-size: 28px; font-weight: 800; color: #FFFFFF; }
.stat-badge { font-size: 11px; font-weight: 600; color: #D4E952; background: rgba(212, 233, 82, 0.1); padding: 4px 10px; border-radius: 20px; align-self: flex-start; }

.grid2 { display: grid; grid-template-columns: 60% 1fr; gap: 20px; }

.card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 800; color: #FFFFFF; margin: 0; }
.card-body { display: flex; flex-direction: column; gap: 12px; }

.active-order-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(0, 0, 0, 0.2); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; transition: all 0.2s; }
.active-order-item:hover { border-color: #D4E952; background: rgba(212, 233, 82, 0.05); transform: translateX(2px); }
.ao-icon { font-size: 24px; }
.ao-info { flex: 1; }
.ao-title { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.ao-sub { font-size: 12px; color: #9ab39d; margin-top: 2px; }
.badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.b-active { background: #D4E952; color: #121212; }
.b-pending { background: rgba(255, 255, 255, 0.1); color: #e0e0e0; border: 1px solid rgba(255, 255, 255, 0.1); }

.alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.alert-item:last-child { border: none; padding-bottom: 0; }
.alert-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: white; flex-shrink: 0; }
.alert-icon.blue { background: #3b82f6; }
.alert-icon.green { background: #4caf50; }
.alert-info { flex: 1; }
.alert-title { font-size: 13px; font-weight: 700; color: #FFFFFF; }
.alert-sub { font-size: 11px; color: #9ab39d; margin-top: 4px; }

.history-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.history-item:last-child { border: none; padding-bottom: 0; }
.hi-title { font-size: 13px; font-weight: 700; color: #FFFFFF; }
.hi-sub { font-size: 11px; color: #9ab39d; margin-top: 4px; }
.hi-amount { font-size: 14px; font-weight: 800; color: #FFFFFF; }

.chat-preview { gap: 16px; }
.chat-msg { display: flex; gap: 12px; align-items: flex-end; }
.chat-avatar { width: 32px; height: 32px; border-radius: 50%; background: #D4E952; color: #121212; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0; }
.chat-bubble { background: rgba(0, 0, 0, 0.3); color: #FFFFFF; padding: 12px 16px; border-radius: 16px 16px 16px 4px; font-size: 13px; font-weight: 500; border: 1px solid rgba(255, 255, 255, 0.05); }

.btn-primary { background: #D4E952; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.btn-primary:hover { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2); }

.btn-text { background: none; border: none; color: #9ab39d; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
.btn-text:hover { color: #FFFFFF; }

.btn-outline-primary { width: 100%; background: transparent; color: #D4E952; border: 1.5px solid rgba(212, 233, 82, 0.5); border-radius: 8px; padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.btn-outline-primary:hover { background: rgba(212, 233, 82, 0.1); border-color: #D4E952; }

@media (max-width: 900px) {
  .kpis { grid-template-columns: 1fr; }
  .grid2 { grid-template-columns: 1fr; }
}
</style>
