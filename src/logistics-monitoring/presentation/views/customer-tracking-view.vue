<template>
  <div class="tracking-page">
    <div class="page-header">
      <button class="btn-back" @click="router.push('/customer/orders')">{{ t('track.back', '← Mis Pedidos') }}</button>
      <div>
        <h1 class="page-title">{{ t('track.title', 'Rastrear Pedido') }} — #{{ orderId }}</h1>
        <p class="page-sub">{{ t('track.subtitle', 'Seguimiento en tiempo real') }}</p>
      </div>
    </div>

    <div v-if="isLoading" style="text-align: center; padding: 4rem; color: #c9e265;">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <p style="color: #8fba8f; font-weight: bold;">Conectando con el GPS del camión...</p>
    </div>

    <div v-else-if="!deliveryData" style="text-align: center; padding: 4rem; color: #8fba8f;">
      <i class="pi pi-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <p>El pedido aún no tiene un camión asignado para su entrega.</p>
    </div>

    <template v-else>
      <div class="eta-banner">
        <div class="eta-left">
          <div class="eta-label">{{ t('track.etaLabel', 'ETA ESTIMADO') }}</div>
          <div class="eta-main"><i class="pi pi-truck" style="margin-right: 8px;"></i>{{ t('track.arrivesIn', 'Llega a las') }} {{ deliveryData.etaTime }}</div>
          <div class="eta-sub">{{ t('track.order', 'Pedido') }} #{{ orderId }} · {{ deliveryData.status === 'DELAYED' ? 'Retrasado' : t('track.onWay', 'En camino') }}</div>
        </div>
        <div class="eta-right">
          <div class="eta-stat">
            <span class="eta-stat-val">{{ deliveryData.distanceKm }}</span>
            <span class="eta-stat-label">{{ t('track.kmLeft', 'km aprox.') }}</span>
          </div>
          <div class="eta-divider"></div>
          <div class="eta-stat">
            <span class="eta-stat-val">98%</span>
            <span class="eta-stat-label">{{ t('track.punctuality', 'puntualidad') }}</span>
          </div>
          <div class="eta-divider"></div>
          <div class="eta-stat">
            <span class="eta-stat-val live">{{ t('track.live', 'EN VIVO') }}</span>
            <span class="eta-stat-label">{{ t('track.updated', 'actualizado') }}</span>
          </div>
        </div>
      </div>

      <div class="layout">
        <div class="left">
          <div class="map-container">
            <div class="map-topbar">
              <div class="map-live"><span class="live-dot"></span> Live Fleet Tracking</div>
              <div class="map-right-info">
                <span class="map-driver-label">{{ deliveryData.vehiclePlate }} · {{ deliveryData.driverName }}</span>
                <span class="map-status-badge" :class="{'bg-warn': deliveryData.status === 'DELAYED'}">
                  {{ deliveryData.status === 'DELAYED' ? 'RETRASADO' : 'EN RUTA' }}
                </span>
              </div>
            </div>
            <div class="map-background-wrapper">
              <live-tracking-map
                  :origin-label="deliveryData.origin"
                  :destination-label="deliveryData.destination"
                  :total-km="deliveryData.distanceKm"
              />
            </div>
          </div>

          <div class="timeline-card">
            <h3 class="section-title">{{ t('track.timeline', 'Estado del Envío') }}</h3>
            <div class="timeline">
              <div :class="['t-item', 'done']">
                <div class="t-icon"><i class="pi pi-check"></i></div>
                <div class="t-content">
                  <div class="t-title">{{ t('track.confirmed', 'Pedido Confirmado') }}</div>
                  <div class="t-desc">FruitLogix Center</div>
                </div>
              </div>
              <div class="t-line done"></div>

              <div :class="['t-item', 'done']">
                <div class="t-icon"><i class="pi pi-check"></i></div>
                <div class="t-content">
                  <div class="t-title">{{ t('track.prepared', 'Empacado y Listo') }}</div>
                  <div class="t-desc">{{ deliveryData.origin }}</div>
                </div>
              </div>
              <div class="t-line done"></div>

              <div :class="['t-item', 'active']">
                <div class="t-icon pulse">
                  <i class="pi pi-truck"></i>
                </div>
                <div class="t-content">
                  <div class="t-title">{{ deliveryData.status === 'DELAYED' ? 'Retraso en la Ruta' : t('track.onWay', 'En Camino') }}</div>
                  <div class="t-desc">Hacia: {{ deliveryData.destination }}</div>
                </div>
              </div>
              <div class="t-line pending"></div>

              <div :class="['t-item', 'pending']">
                <div class="t-icon"><i class="pi pi-map-marker"></i></div>
                <div class="t-content">
                  <div class="t-title">{{ t('track.arriving', 'Llegando a destino') }}</div>
                  <div class="t-desc">ETA: {{ deliveryData.etaTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right">
          <div class="driver-card">
            <div class="card-hdr"><span class="card-title">{{ t('track.driver', 'Conductor') }}</span></div>
            <div class="driver-row">
              <div class="av-lg">{{ deliveryData.driverInitials }}</div>
              <div>
                <div class="driver-name">{{ deliveryData.driverName }}</div>
                <div class="driver-sub">Distribuidor FruitLogix</div>
                <div class="driver-sub">Vehículo: {{ deliveryData.vehiclePlate }} · {{ deliveryData.vehicleType }}</div>
              </div>
            </div>
            <button class="btn-outline" @click="handleChatClick"><i class="pi pi-comment" style="margin-right: 6px;"></i> {{ t('track.message', 'Enviar mensaje') }}</button>
            <button class="btn-info">{{ t('track.info', 'Ver información del vehículo') }}</button>
          </div>

          <div class="notifications-card">
            <div class="card-hdr"><span class="card-title">{{ t('track.notifications', 'Notificaciones') }}</span></div>
            <div class="notif-list">
              <div class="notif-item">
                <div class="notif-dot blue"></div>
                <div>
                  <div class="notif-title">El camión está en tránsito</div>
                  <div class="notif-time">Actualizado recientemente</div>
                </div>
              </div>
              <div class="notif-item" v-if="deliveryData.temperature">
                <div class="notif-dot green"></div>
                <div>
                  <div class="notif-title">Temperatura óptima ({{ deliveryData.temperature }}°C)</div>
                  <div class="notif-time">Lectura de sensor IoT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LiveTrackingMap from '../../../shared/presentation/components/live-tracking-map.vue';
import { BaseApi } from '../../../shared/infrastructure/base-api.js';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const api = new BaseApi();

const orderId = computed(() => route.params.id || 'N/A');
const isLoading = ref(true);
const deliveryData = ref(null);

// Lógica de animación del timeline para el mapa
const trackingProgress = ref(0.6); // Lo fijamos en 0.6 para que se quede animando "En Camino"
let animFrameId = null;
let lastTime = null;
const SPEED = 0.045;

onMounted(async () => {
  await fetchDeliveryForClient();
  startAnimation();
});

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
});

async function fetchDeliveryForClient() {
  isLoading.value = true;
  try {
    // 1. Buscamos todos los deliveries (ya que no hay GET by OrderId en tu Swagger)
    const delRes = await api.http.get('https://fruitlogix-platform.onrender.com/api/v1/deliveries');

    // 2. Filtramos el delivery que pertenece a esta orden
    const foundDelivery = delRes.data.find(d => String(d.orderId) === String(orderId.value));

    if (foundDelivery) {
      deliveryData.value = {
        id: foundDelivery.id,
        status: foundDelivery.currentStatus,
        driverName: foundDelivery.driverName || 'Conductor Asignado',
        driverInitials: (foundDelivery.driverName || 'CA').substring(0,2).toUpperCase(),
        vehiclePlate: foundDelivery.vehiclePlate || 'N/A',
        vehicleType: foundDelivery.vehicleType || 'Camión',
        origin: foundDelivery.routeOrigin || 'Centro Logístico',
        destination: foundDelivery.routeDestination || 'Ubicación del Cliente',
        distanceKm: foundDelivery.routeDistanceKm || 4.2,
        etaTime: foundDelivery.estimatedTimeOfArrival
            ? new Date(foundDelivery.estimatedTimeOfArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : 'Calculando...',
        temperature: (Math.random() * (5 - 3) + 3).toFixed(1) // Simulando IoT por ahora
      };
    }
  } catch (error) {
    console.error("Error al cargar el tracking para el cliente:", error);
  } finally {
    isLoading.value = false;
  }
}

function handleChatClick() {
  router.push({ name: 'customer-chat', query: { orderId: orderId.value } });
}

function startAnimation() {
  function animateTimeline(ts) {
    if (!lastTime) lastTime = ts;
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;
    // Solo animamos un pequeño bucle visual para que parezca que avanza
    trackingProgress.value = 0.5 + (Math.sin(ts / 1000) * 0.1);
    animFrameId = requestAnimationFrame(animateTimeline);
  }
  animFrameId = requestAnimationFrame(animateTimeline);
}
</script>

<style scoped>
.tracking-page { padding: 32px; min-height: 100vh; background: #E1EBE1; }
.page-header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; color: #4a6b4a; font-size: 13px; font-weight: 700; text-decoration: none; border: none; background: none; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; transition: all 0.2s; align-self: flex-start; }
.btn-back:hover { color: #1a3020; }
.page-title { font-size: 24px; font-weight: 800; color: #1a3020; margin: 0; }
.page-sub { color: #4a6b4a; font-size: 14px; margin: 4px 0 0 0; }

.eta-banner { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-left: 6px solid #D4E952; border-radius: 16px; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.eta-label { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 6px; }
.eta-main { font-size: 26px; font-weight: 800; color: #D4E952; letter-spacing: -0.5px; }
.eta-sub { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 6px; font-weight: 500; }
.eta-right { display: flex; align-items: center; gap: 24px; flex-shrink: 0; }
.eta-stat { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
.eta-stat-val { font-size: 22px; font-weight: 800; color: #fff; }
.eta-stat-val.live { font-size: 12px; color: #121212; background: #D4E952; padding: 4px 12px; border-radius: 20px; animation: pulse-live 2s infinite; font-weight: 800; box-shadow: 0 0 0 4px rgba(212,233,82,0.2); }
@keyframes pulse-live { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
.eta-stat-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
.eta-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.15); }

.layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
.left, .right { display: flex; flex-direction: column; gap: 24px; }

/* 🟢 NUEVOS ESTILOS PARA EL MAPA COMPARTIDO */
.map-container { background: #1a2a1e; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.map-topbar { display: flex; justify-content: space-between; align-items: center; padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.07); background: #1a2a1e; z-index: 2; position: relative;}
.map-live { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 13px; font-weight: 700; }
.live-dot { width: 8px; height: 8px; background: #D4E952; border-radius: 50%; animation: blink 1.4s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
.map-right-info { display: flex; align-items: center; gap: 10px; }
.map-driver-label { font-size: 12px; color: #7a9a7a; font-weight: 600; }
.map-status-badge { background: #D4E952; color: #121212; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; }
.map-background-wrapper { position: relative; width: 100%; height: 280px; overflow: hidden; }

.timeline-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.section-title { font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px 0; }
.timeline { display: flex; flex-direction: column; gap: 0; }
.t-item { display: flex; gap: 16px; position: relative; z-index: 1; }
.t-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0; }
.t-item.done .t-icon { background: #D4E952; color: #121212; }
.t-item.active .t-icon { background: #6c2bd9; color: white; box-shadow: 0 0 0 4px rgba(108,43,217,0.2); }
.t-item.active .t-icon.pulse { animation: pulse-icon 2s infinite; }
.t-item.pending .t-icon { background: rgba(255, 255, 255, 0.05); color: #9ab39d; border: 2px solid rgba(255, 255, 255, 0.1); }
@keyframes pulse-icon { 0% { box-shadow: 0 0 0 0 rgba(108,43,217,0.4); } 70% { box-shadow: 0 0 0 10px rgba(108,43,217,0); } 100% { box-shadow: 0 0 0 0 rgba(108,43,217,0); } }
.t-content { padding-bottom: 8px; padding-top: 8px; }
.t-title { font-size: 15px; font-weight: 800; color: #FFFFFF; }
.t-item.pending .t-title { color: #9ab39d; }
.t-desc { font-size: 13px; color: #9ab39d; margin-top: 4px; font-weight: 500; }
.t-line { width: 2px; height: 24px; margin: 4px 0 4px 17px; }
.t-line.done { background: #D4E952; }
.t-line.pending { background: rgba(255, 255, 255, 0.05); border-left: 2px dashed rgba(255, 255, 255, 0.1); width: 0; }

.driver-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.card-hdr { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 800; color: #FFFFFF; }
.driver-row { display: flex; align-items: center; gap: 16px; }
.av-lg { width: 56px; height: 56px; border-radius: 50%; background: rgba(212, 233, 82, 0.05); color: #D4E952; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; border: 2px solid #D4E952; }
.driver-name { font-size: 16px; font-weight: 800; color: #FFFFFF; }
.driver-sub { font-size: 13px; color: #9ab39d; margin-top: 4px; font-weight: 500; }
.btn-outline { width: 100%; background: transparent; color: #9ab39d; border: 1.5px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; padding: 12px; cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.4); color: #FFFFFF; }
.btn-info { width: 100%; background: rgba(255, 255, 255, 0.05); border: none; color: #9ab39d; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; padding: 12px; cursor: pointer; transition: all 0.2s; }
.btn-info:hover { background: rgba(255, 255, 255, 0.1); color: #FFFFFF; }

.notifications-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.notif-list { display: flex; flex-direction: column; gap: 16px; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
.notif-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
.notif-dot.blue { background: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
.notif-dot.green { background: #4caf50; box-shadow: 0 0 0 3px rgba(76,175,80,0.2); }
.notif-title { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.notif-time { font-size: 12px; color: #9ab39d; margin-top: 4px; font-weight: 600; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .eta-banner { flex-direction: column; align-items: flex-start; }
}
</style>