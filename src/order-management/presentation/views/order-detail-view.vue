<template>
  <div class="detail-wrapper">
    <transition name="fade">
      <div class="drawer-overlay" v-if="isQualityReportOpen" @click="isQualityReportOpen = false"></div>
    </transition>

    <transition name="slide-drawer">
      <aside class="quality-drawer" v-if="isQualityReportOpen" @click.stop>
        <div class="drawer-accent"></div>

        <header class="drawer-header">
          <div class="drawer-header-left">
            <button class="drawer-back-btn" @click="isQualityReportOpen = false">
              <i class="pi pi-arrow-left"></i>
            </button>
            <div class="drawer-titles">
              <h2>Reporte de Calidad</h2>
              <p>Pedido {{ order?.id || 'ORD-2024-005' }} · Productor: {{ producerName }}</p>
            </div>
          </div>
          <div class="drawer-header-right">
            <span class="drawer-badge-main">REPORTE RECIBIDO</span>
            <span class="drawer-time">Datos verificados</span>
          </div>
        </header>

        <div v-if="isLoadingQuality" class="drawer-content" style="align-items: center; justify-content: center;">
          <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem; color: #c9e265; margin-bottom: 1rem;"></i>
          <p style="color: #8fba8f; font-weight: 600;">Descargando reporte de la base de datos...</p>
        </div>

        <div v-else class="drawer-content">

          <section class="drawer-section">
            <div class="section-heading-row">
              <h3 class="section-heading"><i class="pi pi-verified"></i> Resumen por Producto</h3>
            </div>
            <div class="info-card no-margin">
              <table class="products-table">
                <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>KG APROB.</th>
                  <th>KG RECHAZ.</th>
                  <th>% CALIDAD</th>
                  <th>RESULTADO</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="fruit in productsList" :key="fruit.name">
                  <td class="product-name">{{ fruit.name }}</td>
                  <td>{{ calculateApproved(fruit.qty, qualityReport?.wastePercentage) }} kg</td>
                  <td>{{ calculateRejected(fruit.qty, qualityReport?.wastePercentage) }} kg</td>
                  <td style="color: #1bb37e; font-weight: 800;">{{ 100 - (qualityReport?.wastePercentage || 0) }}%</td>
                  <td><span class="status-pill-header pill-delivered">✓ Evaluado</span></td>
                </tr>
                </tbody>
              </table>
              <div class="table-summary-strip">
                <i class="pi pi-exclamation-triangle"></i>
                Merma calculada basada en el {{ qualityReport?.wastePercentage || 0 }}% de rechazo reportado por el productor.
              </div>
            </div>
          </section>

          <section class="drawer-section">
            <div class="section-heading-row">
              <h3 class="section-heading"><i class="pi pi-chart-bar"></i> Parámetros Técnicos</h3>
              <span class="status-pill-header pill-assigned">Datos de Inspección</span>
            </div>
            <div class="info-card no-margin">
              <table class="products-table">
                <thead>
                <tr>
                  <th>PARÁMETRO</th>
                  <th>RECIBIDO</th>
                  <th>RANGO ACEPTABLE</th>
                  <th>ESTADO</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Temperatura</td>
                  <td class="total-value">{{ qualityReport?.temperatureCelsius ?? '--' }}°C</td>
                  <td>2°C – 15°C</td>
                  <td><i class="pi pi-check-circle" style="color: #1bb37e; font-size: 1.1rem;"></i></td>
                </tr>
                <tr>
                  <td>Humedad</td>
                  <td class="total-value">{{ qualityReport?.humidityPercent ?? '--' }}%</td>
                  <td>85% – 95%</td>
                  <td><i class="pi pi-check-circle" style="color: #1bb37e; font-size: 1.1rem;"></i></td>
                </tr>
                <tr>
                  <td>Brix (dulzor)</td>
                  <td class="total-value">{{ qualityReport?.brixDegrees ?? '--' }} °Bx</td>
                  <td>13 – 17 °Bx</td>
                  <td><i class="pi pi-check-circle" style="color: #1bb37e; font-size: 1.1rem;"></i></td>
                </tr>
                <tr>
                  <td>pH</td>
                  <td class="total-value">{{ qualityReport?.ph ?? '--' }}</td>
                  <td>3.5 – 4.5</td>
                  <td><i class="pi pi-check-circle" style="color: #1bb37e; font-size: 1.1rem;"></i></td>
                </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="drawer-section">
            <div class="section-heading-row">
              <h3 class="section-heading"><i class="pi pi-camera"></i> Evidencia Fotográfica</h3>
              <span class="delivery-sub">Registro Visual</span>
            </div>
            <div class="photo-grid">
              <div class="photo-placeholder">
                <i class="pi pi-image" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p>Vista General</p>
              </div>
              <div class="photo-placeholder">
                <i class="pi pi-image" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p>Clasificación</p>
              </div>
              <div class="photo-placeholder">
                <i class="pi pi-image" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p>Empaque</p>
              </div>
            </div>
          </section>

          <section class="drawer-section">
            <div class="section-heading-row">
              <h3 class="section-heading"><i class="pi pi-file-edit"></i> Notas del Productor</h3>
            </div>
            <div class="producer-notes">
              <p>"{{ qualityReport?.notes || 'No se registraron observaciones adicionales durante la inspección de este lote.' }}"</p>
              <span class="delivery-sub">— {{ producerName }}</span>
            </div>
          </section>

        </div>

        <footer class="drawer-footer">
          <div class="footer-btn-group">
            <button class="action-btn-full lime" @click="isQualityReportOpen = false">
              ✓ Aprobar lote y continuar →
            </button>
            <span class="delivery-sub">Siguiente paso: Asignar flota al pedido</span>
          </div>
          <div class="footer-btn-group">
            <button class="action-btn-full outline-amber" @click="isQualityReportOpen = false">
              Aprobar parcialmente
            </button>
          </div>
          <div class="footer-btn-group">
            <button class="action-btn-full outline-danger" @click="isQualityReportOpen = false">
              Rechazar con observaciones
            </button>
          </div>
        </footer>
      </aside>
    </transition>

    <div class="back-nav">
      <button class="back-btn" @click="goBack">
        <i class="pi pi-arrow-left"></i>
        <span>Detalles del Pedido</span>
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>Cargando detalles del pedido...</p>
    </div>

    <div v-else-if="!order" class="empty-state">
      <i class="pi pi-inbox empty-icon"></i>
      <p class="empty-title">Pedido no encontrado</p>
      <p class="empty-sub">El pedido solicitado no existe o fue eliminado.</p>
      <button class="back-list-btn" @click="goBack">
        <i class="pi pi-arrow-left"></i> Volver a Pedidos
      </button>
    </div>

    <template v-else>
      <div class="header-card">
        <div class="header-left">
          <div class="order-id-row">
            <h2 class="order-id">{{ order.id }}</h2>
            <span class="status-pill-header" :class="statusPillClass">{{ statusLabel }}</span>
          </div>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Fecha de Creación</span>
              <span class="meta-value">{{ creationDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Cliente</span>
              <div class="meta-value client-row">
                <i class="pi pi-building"></i>
                {{ order.clientName ? order.clientName : 'Cliente #' + order.commercialClientId }}
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-label">Dirección</span>
              <span class="meta-value">{{ deliveryAddress }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fecha Entrega</span>
              <span class="meta-value">{{ deliveryDate }}</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <button class="action-btn outline" @click="showOrderEdit">
              Editar pedido
            </button>
            <button class="action-btn danger" @click="showCancelConfirm">
              Cancelar pedido
            </button>
          </div>
          <div class="payment-row">
            <i class="pi pi-wallet"></i>
            <span class="payment-label">Pago pendiente · S/ {{ totalAmount }}</span>
            <button class="link-btn">Ver factura</button>
          </div>
        </div>
      </div>

      <div class="body-grid">
        <div class="left-col">
          <div class="info-card">
            <div class="card-title-row">
              <h3 class="card-title">Productos del Pedido</h3>
              <i class="pi pi-list card-icon"></i>
            </div>
            <table class="products-table">
              <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>$/kg</th>
                <th>Subtotal</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="fruit in productsList" :key="fruit.name">
                <td class="product-name">{{ fruit.name }}</td>
                <td>{{ fruit.qty }}</td>
                <td>{{ fruit.price }}</td>
                <td>{{ fruit.subtotal }}</td>
              </tr>
              </tbody>
            </table>
            <div class="total-row">
              <span class="total-label">Total</span>
              <span class="total-value">S/ {{ totalAmount }}</span>
            </div>
          </div>

          <div class="info-card">
            <div class="card-title-row">
              <h3 class="card-title">Productor Asignado</h3>
              <i class="pi pi-users card-icon"></i>
            </div>

            <div v-if="order.producerId" class="producer-info">
              <div class="producer-detail">
                <h4 class="producer-name">{{ producerName }}</h4>
                <div class="producer-meta-row">
                  <i class="pi pi-map-marker"></i>
                  <span>{{ producerLocation }}</span>
                </div>
                <div class="producer-meta-row">
                  <i class="pi pi-phone"></i>
                  <span>{{ producerPhone }}</span>
                </div>
              </div>
            </div>

            <div v-else class="producer-empty">
              <div class="producer-empty-icon">
                <i class="pi pi-user-plus"></i>
              </div>
              <p class="producer-empty-text">Aún no se asigna productor</p>
              <p class="producer-empty-sub">Selecciona un productor disponible para este pedido.</p>
              <button class="select-producer-btn" @click="showAssignDialog">
                <i class="pi pi-plus-circle"></i> Seleccionar Productor
              </button>
            </div>
          </div>
        </div>

        <div class="center-col">
          <div class="info-card tracking-card">
            <div class="tracking-header">
              <div class="tracking-title-row">
                <span class="pulse-dot" :class="{ inactive: !isEnRoute }"></span>
                <span class="tracking-title">Live Fleet Tracking</span>
              </div>
              <div class="tracking-meta">
                <span class="tracking-truck" v-if="isEnRoute">{{ order.vehicle || 'TRK-03' }} · {{ order.driver || 'Javier Torres' }}</span>
                <span class="tracking-badge" :class="isEnRoute ? 'badge-active' : 'badge-waiting'">
                  {{ isEnRoute ? 'En Ruta' : 'En espera' }}
                </span>
              </div>
            </div>

            <div class="map-container">
              <template v-if="isEnRoute">
                <svg class="map-svg" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#0c1f15"/>
                      <stop offset="100%" stop-color="#1a2a1e"/>
                    </linearGradient>
                  </defs>
                  <rect width="600" height="240" fill="url(#mapGrad)"/>
                  <line v-for="i in 5" :key="'h'+i" :x1="0" :x2="600" :y1="i*48" :y2="i*48" stroke="#1a2a1e" stroke-width="0.5"/>
                  <line v-for="i in 7" :key="'v'+i" :x1="i*85" :x2="i*85" :y1="0" :y2="240" stroke="#1a2a1e" stroke-width="0.5"/>
                  <path d="M 80 200 Q 200 140 300 120 Q 400 100 520 40" fill="none" stroke="#c9e265" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.7"/>
                  <circle cx="300" cy="120" r="6" fill="#c9e265"/>
                  <circle cx="300" cy="120" r="12" fill="none" stroke="#c9e265" stroke-width="1" opacity="0.4">
                    <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="80" cy="200" r="4" fill="#3d5c42"/>
                  <circle cx="520" cy="40" r="4" fill="#c9e265"/>
                  <rect x="210" y="65" width="120" height="28" rx="6" fill="rgba(12,31,21,0.85)" stroke="#2a3d2e"/>
                  <text x="270" y="84" fill="#c9e265" font-size="11" text-anchor="middle" font-family="DM Sans" font-weight="700">⊘ 287 km restantes</text>
                  <text x="530" y="30" fill="#6b8a6b" font-size="10" text-anchor="middle" font-family="DM Sans">Lima</text>
                </svg>

                <div class="map-sensors">
                  <div class="sensor-item">
                    <i class="pi pi-chart-line sensor-icon"></i>
                    <div class="sensor-data">
                      <span class="sensor-label">Temperatura</span>
                      <span class="sensor-value">4.2°C</span>
                    </div>
                  </div>
                  <div class="sensor-divider"></div>
                  <div class="sensor-item">
                    <i class="pi pi-cloud sensor-icon"></i>
                    <div class="sensor-data">
                      <span class="sensor-label">Humedad</span>
                      <span class="sensor-value">85%</span>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="map-waiting">
                  <i class="pi pi-map map-waiting-icon"></i>
                  <p class="map-waiting-title">Flota no asignada</p>
                  <p class="map-waiting-sub">Aún no has asignado un conductor y vehículo a este pedido para recoger la carga.</p>

                  <button class="action-btn outline btn-reporte" @click="showAssignFleetDialog" style="margin-top: 1rem; border-color: #c9e265; color: #c9e265;">
                    <i class="pi pi-truck" style="margin-right: 0.5rem;"></i> Asignar Flota
                  </button>
                </div>
              </template>
            </div>
          </div>

          <div class="info-card quality-card">
            <div class="quality-row">
              <div class="quality-icon-wrap">
                <i class="pi pi-verified"></i>
              </div>
              <div class="quality-info">
                <span class="quality-title">Control de Calidad</span>
                <span class="quality-status">Estado: {{ qualityStatus }}</span>
              </div>
              <button class="action-btn outline btn-reporte" @click="openQualityReport">
                Ver Reporte
              </button>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="info-card">
            <div class="card-title-row">
              <h3 class="card-title">Estado del Pedido</h3>
              <i class="pi pi-chart-line card-icon"></i>
            </div>
            <div class="timeline">
              <div v-for="(step, idx) in timelineSteps" :key="step.label" class="timeline-step" :class="{ completed: step.completed, current: step.current, pending: step.pending }">
                <div class="timeline-marker">
                  <div class="marker-dot">
                    <i v-if="step.completed" class="pi pi-check"></i>
                    <span v-else-if="step.current" class="current-ring"></span>
                  </div>
                  <div v-if="idx < timelineSteps.length - 1" class="marker-line" :class="{ 'line-completed': step.completed }"></div>
                </div>
                <div class="timeline-content">
                  <span class="timeline-label" :class="{ bold: step.current }">{{ step.label }}</span>
                  <span class="timeline-sub">{{ step.sub }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3 class="card-title" style="margin-bottom: 1rem;">Detalles de Entrega</h3>
            <div class="delivery-items">
              <div class="delivery-item">
                <div class="delivery-icon-wrap"><i class="pi pi-map-marker"></i></div>
                <div class="delivery-text">
                  <span class="delivery-label">Dirección de entrega</span>
                  <span class="delivery-value">{{ order.clientName || 'Mercado Central S.A.' }}</span>
                  <span class="delivery-sub">{{ deliveryAddress }}</span>
                </div>
              </div>
              <div class="delivery-item">
                <div class="delivery-icon-wrap"><i class="pi pi-clock"></i></div>
                <div class="delivery-text">
                  <span class="delivery-label">Ventana de entrega</span>
                  <span class="delivery-value">8:00 AM – 10:00 AM</span>
                  <span class="delivery-sub">{{ deliveryDate }}</span>
                </div>
              </div>
              <div class="delivery-item">
                <div class="delivery-icon-wrap"><i class="pi pi-comment"></i></div>
                <div class="delivery-text">
                  <span class="delivery-label">Instrucciones especiales</span>
                  <span class="delivery-value">Acceso por puerta trasera. Requiere firma del responsable de almacén.</span>
                </div>
              </div>
              <div class="delivery-item">
                <div class="delivery-icon-wrap"><i class="pi pi-user"></i></div>
                <div class="delivery-text">
                  <span class="delivery-label">Contacto en destino</span>
                  <span class="delivery-value">{{ order.clientName || 'Miguel Ángel Pérez' }}</span>
                  <span class="delivery-sub">+34 612 345 678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <pv-dialog
        v-model:visible="isCancelConfirmVisible"
        modal
        :closable="true"
        :style="{ width: '420px' }"
        class="delete-confirm-dialog"
    >
      <template #header>
        <div class="cancel-header">
          <div class="cancel-icon-wrap"><i class="pi pi-exclamation-triangle"></i></div>
          <span>Cancelar Pedido</span>
        </div>
      </template>
      <div class="cancel-body">
        <p class="cancel-message">¿Estás seguro de que deseas cancelar el pedido <strong>{{ order?.id }}</strong>?</p>
        <p class="cancel-warning">Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <div class="cancel-footer">
          <button class="cancel-dismiss-btn" @click="isCancelConfirmVisible = false">
            <i class="pi pi-times"></i> No, mantener
          </button>
          <button class="cancel-confirm-btn" @click="confirmCancel">
            <i class="pi pi-trash"></i> Sí, cancelar
          </button>
        </div>
      </template>
    </pv-dialog>

    <pv-dialog
        v-model:visible="isAssignFleetVisible"
        modal
        :closable="true"
        :style="{ width: '450px' }"
        class="delete-confirm-dialog"
    >
      <template #header>
        <div class="cancel-header">
          <div class="cancel-icon-wrap" style="background: rgba(201, 226, 101, 0.15); color: #c9e265; border-color: #c9e265;">
            <i class="pi pi-truck"></i>
          </div>
          <span>Asignar Flota y Conductor</span>
        </div>
      </template>
      <div class="cancel-body">
        <p class="cancel-message" style="margin-bottom: 1.5rem;">Selecciona los recursos logísticos para iniciar la ruta hacia el productor y luego al cliente final.</p>

        <div style="display:flex; flex-direction: column; gap: 1rem;">
          <div style="display:flex; flex-direction: column; gap: 0.3rem;">
            <label style="color: #6b8a6b; font-size: 0.8rem; font-weight: bold;">Conductor Asignado</label>
            <input type="text" v-model="fleetForm.driverName" placeholder="Ej. Carlos Ávila" style="padding: 0.75rem; border-radius: 8px; background: #2a3d2e; border: 1px solid #3d5c42; color: #e0ead0; outline: none;"/>
          </div>

          <div style="display:flex; flex-direction: column; gap: 0.3rem;">
            <label style="color: #6b8a6b; font-size: 0.8rem; font-weight: bold;">Placa del Vehículo</label>
            <input type="text" v-model="fleetForm.vehiclePlate" placeholder="Ej. ABC-123" style="padding: 0.75rem; border-radius: 8px; background: #2a3d2e; border: 1px solid #3d5c42; color: #e0ead0; outline: none;"/>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="delete-footer">
          <button class="cancel-del-btn" @click="isAssignFleetVisible = false">
            <i class="pi pi-times"></i> Cancelar
          </button>
          <button class="confirm-del-btn" @click="submitFleetAssignment" style="flex:1; border-radius: 10px; font-weight: 700; background: #c9e265; color: #122216; border-color: #c9e265;">
            <i class="pi pi-check"></i> Confirmar Asignación
          </button>
        </div>
      </template>
    </pv-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderManagementStore } from '../../application/order-management.store.js';
// 🌟 Asegúrate de que esta ruta hacia base-api.js sea correcta en tu proyecto
import { BaseApi } from '../../../shared/infrastructure/base-api.js';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderManagementStore();
const api = new BaseApi();

const isLoading = ref(true);
const isCancelConfirmVisible = ref(false);

// CONTROL DEL DRAWER DE CALIDAD
const isQualityReportOpen = ref(false);
const qualityReport = ref(null);
const isLoadingQuality = ref(false);

// 🌟 VARIABLES PARA ASIGNAR FLOTA
const isAssignFleetVisible = ref(false);
const fleetForm = ref({
  driverName: '',
  vehiclePlate: ''
});

const order = computed(() => {
  const id = route.params.id;
  return orderStore.orders.find(o => o.id === id || String(o.id) === String(id)) || null;
});

onMounted(async () => {
  if (!orderStore.ordersLoaded) {
    await orderStore.fetchOrders();
  }
  isLoading.value = false;
});

function goBack() {
  router.push({ name: 'order-list' });
}

// 🌟 FUNCIONES DEL MODAL DE FLOTA
function showAssignFleetDialog() {
  isAssignFleetVisible.value = true;
}

async function submitFleetAssignment() {
  try {
    if (!fleetForm.value.driverName || !fleetForm.value.vehiclePlate) {
      alert("Por favor completa los datos del conductor y vehículo.");
      return;
    }

    const payload = {
      orderId: order.value.id,
      driverName: fleetForm.value.driverName,
      driverPhone: "987654321", // Simulado
      vehiclePlate: fleetForm.value.vehiclePlate,
      vehicleType: "Refrigerated Truck",
      routeOrigin: producerLocation.value || "Finca Origen",
      routeDestination: deliveryAddress.value || "Cliente Destino",
      routeDistanceKm: 42.5,
      estimatedTimeOfArrival: new Date(new Date().getTime() + 2 * 60 * 60000).toISOString(),
      currentStatus: "IN_TRANSIT"
    };

    // Hacemos el POST a tu API real en Render
    await api.http.post('https://fruitlogix-platform.onrender.com/api/v1/deliveries', payload);

    // Cerramos el modal
    isAssignFleetVisible.value = false;
    alert("¡Flota asignada correctamente! El camión ya está en ruta.");

    // Opcional: Redirigimos al Centro de Control para ver el camión vivo
    // router.push({ name: 'logistics-monitoring' });

  } catch (error) {
    console.error("Error al asignar flota:", error);
    alert("Hubo un error al crear el despacho.");
  }
}

async function openQualityReport() {
  isQualityReportOpen.value = true;

  if (!order.value?.id) return;

  isLoadingQuality.value = true;
  try {
    const url = `https://fruitlogix-platform.onrender.com/api/v1/quality-inspections/batch/${order.value.id}`;
    console.log("Consultando API real:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`El backend respondió con estado ${response.status}`);
    }

    const data = await response.json();
    const rawData = Array.isArray(data) ? data[0] : data;

    qualityReport.value = {
      temperatureCelsius: rawData.technicalParameters?.temperatureCelsius ?? '--',
      humidityPercent: rawData.technicalParameters?.humidityPercent ?? '--',
      brixDegrees: rawData.technicalParameters?.brixDegrees ?? '--',
      ph: rawData.technicalParameters?.ph ?? '--',
      wastePercentage: rawData.visualInspection?.wastePercentage ?? 0,
      notes: rawData.notes || 'Sin observaciones adicionales.'
    };

  } catch (error) {
    console.error("Error al obtener el reporte real:", error);
    qualityReport.value = {
      temperatureCelsius: '--',
      humidityPercent: '--',
      brixDegrees: '--',
      ph: '--',
      wastePercentage: 0,
      notes: "No se encontró un reporte de calidad en la base de datos para este lote."
    };
  } finally {
    isLoadingQuality.value = false;
  }
}

const calculateApproved = (qtyString, wastePct) => {
  const total = parseFloat(qtyString) || 0;
  const waste = total * ((wastePct || 0) / 100);
  return (total - waste).toFixed(1);
};

const calculateRejected = (qtyString, wastePct) => {
  const total = parseFloat(qtyString) || 0;
  return (total * ((wastePct || 0) / 100)).toFixed(1);
};


// ── Computed helpers (Tus computed originales) ──
const statusLabel = computed(() => {
  if (!order.value?.producerId) return 'Sin Asignar';
  const s = order.value?.status;
  if (!s) return 'Pendiente';
  return s;
});

const statusPillClass = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  if (s.includes('entregado')) return 'pill-delivered';
  if (s.includes('cancelado')) return 'pill-cancelled';
  if (s.includes('camino') || s.includes('ruta') || s.includes('transit')) return 'pill-transit';
  if (s.includes('asignado') || s.includes('prepar')) return 'pill-assigned';
  return 'pill-pending';
});

const isEnRoute = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  return s.includes('camino') || s.includes('ruta') || s.includes('transit');
});

const isQualityApproved = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  return s.includes('camino') || s.includes('ruta') || s.includes('transit') || s.includes('entregado');
});

const qualityStatus = computed(() => isQualityApproved.value ? 'Aprobado' : 'Pendiente');

const creationDate = computed(() => '22 Oct 2026');

const deliveryDate = computed(() => {
  const raw = order.value?.deliveryDueDate;
  if (!raw) return '24 Oct 2026';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
});

const deliveryAddress = computed(() => 'Calle Mayor 12, Lima');

const totalAmount = computed(() => {
  const amt = Number(order.value?.totalAmount ?? 0);
  if (amt > 0) return amt.toLocaleString('es-PE', { minimumFractionDigits: 2 });
  return '680.00';
});

const producerName = computed(() => order.value?.producer || 'Finca La Esperanza');
const producerLocation = computed(() => 'Valle de San Lorenzo, Piura');
const producerPhone = computed(() => '+51 987 654 321');

const productsList = computed(() => {
  const fruits = order.value?.items || order.value?.selectedFruits;
  if (Array.isArray(fruits) && fruits.length > 0) {
    return fruits.map(f => ({
      name: f.productName || f.name || '—',
      qty: `${Number(f.quantityKg || f.quantity || 0)}`,
      price: `$${(f.unitPrice || f.pricePerKg || 2.50).toFixed(2)}`,
      subtotal: `$${(Number(f.quantityKg || f.quantity || 0) * (f.unitPrice || f.pricePerKg || 2.50)).toFixed(0)}`
    }));
  }
  const name = order.value?.product || order.value?.fruitType || 'Producto';
  return [{
    name,
    qty: order.value?.quantity || '—',
    price: '$2.50',
    subtotal: `$${totalAmount.value}`
  }];
});

const timelineSteps = computed(() => {
  const s = (order.value?.status || '').toLowerCase();

  const steps = [
    { label: 'Pedido Registrado', sub: '08:00 AM - Hoy', completed: true, current: false, pending: false },
    { label: 'Productor Asignado', sub: '09:15 AM - Hoy', completed: false, current: false, pending: true },
    { label: 'En Ruta al Productor', sub: 'Hacia la finca', completed: false, current: false, pending: true },
    { label: 'Control de Calidad', sub: 'En destino', completed: false, current: false, pending: true },
    { label: 'En Tránsito', sub: 'Hacia el cliente', completed: false, current: false, pending: true },
    { label: 'Entregado', sub: 'Pendiente', completed: false, current: false, pending: true }
  ];

  if (!order.value?.producerId) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].current = true; steps[1].pending = false;
    return steps;
  }

  if (s.includes('entregado')) {
    steps.forEach(st => { st.completed = true; st.current = false; st.pending = false; });
    steps[5].current = false;
    steps[5].sub = 'Entregado';
  } else if (s.includes('tránsito') || s.includes('transito') || s.includes('cliente')) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].completed = true; steps[1].pending = false;
    steps[2].completed = true; steps[2].pending = false;
    steps[3].completed = true; steps[3].pending = false;
    steps[4].current = true; steps[4].pending = false;
  } else if (s.includes('calidad') || s.includes('control')) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].completed = true; steps[1].pending = false;
    steps[2].completed = true; steps[2].pending = false;
    steps[3].current = true; steps[3].pending = false;
  } else if (s.includes('camino') || s.includes('ruta')) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].completed = true; steps[1].pending = false;
    steps[2].current = true; steps[2].pending = false;
  } else if (s.includes('asignado') || s.includes('prepar')) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].completed = true; steps[1].pending = false;
    steps[2].current = true; steps[2].pending = false;
  } else if (s.includes('registrado') || s.includes('pend')) {
    steps[0].completed = true; steps[0].pending = false;
    steps[1].current = true; steps[1].pending = false;
  }

  return steps;
});

// ── Actions ──

function showOrderEdit() {}

function showCancelConfirm() {
  isCancelConfirmVisible.value = true;
}

function showAssignDialog() {
  if (order.value?.id) {
    router.push({ name: 'assign-producer', params: { id: order.value.id } });
  }
}

async function handleStatusChange({orderId, newStatus}) {
  const order = orderStore.orders.find(o => o.id === orderId);
  if (!order) return;
  const updatedOrder = {...order, status: newStatus};
  await orderStore.updateOrder(orderId, updatedOrder);
}

async function confirmCancel() {
  if (order.value?.id) {
    await orderStore.deleteOrder(order.value.id);
    isCancelConfirmVisible.value = false;
    goBack();
  }
}
</script>

<style scoped>
/* TUS ESTILOS SE MANTIENEN INTACTOS */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');

.detail-wrapper { padding: 1.5rem 2rem; background: #e8f5e4; min-height: 100vh; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
.back-nav { margin-bottom: 1.25rem; }
.back-btn { background: transparent; border: none; color: #1a3020; font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.6rem; padding: 0; transition: color 0.15s; }
.back-btn:hover { color: #4a6b4a; }
.back-btn i { font-size: 0.9rem; }
.loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; }
.loading-icon { font-size: 2.5rem; color: #c9e265; margin-bottom: 1rem; }
.empty-icon { font-size: 3rem; color: #3d5c42; margin-bottom: 1rem; }
.empty-title { font-size: 1.2rem; font-weight: 800; color: #1a3020; margin-bottom: 0.3rem; }
.empty-sub { font-size: 0.85rem; color: #4a6b4a; margin-bottom: 1.5rem; }
.back-list-btn { background: #c9e265; color: #122216; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; }
.header-card { background: #1e2d22; border-radius: 16px; padding: 1.5rem 1.75rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; margin-bottom: 1.5rem; border: 1px solid #2a3d2e; }
.header-left { flex: 1; }
.order-id-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
.order-id { font-size: 1.75rem; font-weight: 900; color: #e0ead0; margin: 0; letter-spacing: -0.02em; }
.status-pill-header { padding: 0.35rem 0.85rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; }
.pill-pending { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.35); }
.pill-assigned { background: rgba(96, 165, 250, 0.15); color: #93c5fd; border: 1px solid rgba(96, 165, 250, 0.35); }
.pill-transit { background: rgba(212, 163, 75, 0.12); color: #e5b95e; border: 1px solid rgba(212, 163, 75, 0.45); }
.pill-delivered { background: rgba(27, 179, 126, 0.15); color: #1bb37e; border: 1px solid rgba(27, 179, 126, 0.35); }
.pill-cancelled { background: rgba(120, 113, 108, 0.18); color: #a8a29e; border: 1px solid rgba(120, 113, 108, 0.45); text-decoration: line-through; }
.meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.meta-item { display: flex; flex-direction: column; gap: 0.25rem; }
.meta-label { font-size: 0.65rem; font-weight: 700; color: #6b8a6b; letter-spacing: 0.1em; text-transform: uppercase; }
.meta-value { font-size: 0.9rem; font-weight: 600; color: #e0ead0; }
.client-row { display: flex; align-items: center; gap: 0.4rem; }
.client-row i { color: #c9e265; font-size: 0.85rem; }
.header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.85rem; }
.header-actions { display: flex; gap: 0.65rem; }
.action-btn { padding: 0.6rem 1.1rem; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s; }
.action-btn.outline { background: transparent; color: #e0ead0; border: 1.5px solid #3d5c42; }
.action-btn.outline:hover { background: #2a3d2e; }
.action-btn.danger { background: transparent; color: #f87171; border: 1.5px solid rgba(248, 113, 113, 0.35); }
.action-btn.danger:hover { background: rgba(248, 113, 113, 0.1); }
.payment-row { display: flex; align-items: center; gap: 0.5rem; background: #2a3d2e; padding: 0.5rem 0.85rem; border-radius: 8px; border: 1px solid #3d5c42; }
.payment-row i { color: #c9e265; font-size: 0.9rem; }
.payment-label { font-size: 0.78rem; font-weight: 700; color: #c9e265; }
.link-btn { background: transparent; border: none; color: #e0ead0; font-size: 0.78rem; font-weight: 600; cursor: pointer; text-decoration: underline; font-family: 'DM Sans', sans-serif; }
.body-grid { display: grid; grid-template-columns: 1fr 1.3fr 1fr; gap: 1.25rem; align-items: start; }
.info-card { background: #1e2d22; border: 1px solid #2a3d2e; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; }
.card-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.card-title { font-size: 1.05rem; font-weight: 800; color: #e0ead0; margin: 0; }
.card-icon { color: #6b8a6b; font-size: 1rem; }
.products-table { width: 100%; border-collapse: collapse; margin-bottom: 0.85rem; }
.products-table th { text-align: left; font-size: 0.65rem; font-weight: 700; color: #6b8a6b; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 0 0.65rem 0; border-bottom: 1px solid #2a3d2e; }
.products-table td { padding: 0.65rem 0; font-size: 0.85rem; color: #e0ead0; border-bottom: 1px solid #2a3d2e; }
.products-table tr:last-child td { border-bottom: none; }
.product-name { font-weight: 600; }
.total-row { display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid #3d5c42; }
.total-label { font-size: 0.95rem; font-weight: 800; color: #e0ead0; }
.total-value { font-size: 1.1rem; font-weight: 900; color: #c9e265; }
.producer-info { display: flex; flex-direction: column; gap: 0.75rem; }
.producer-name { font-size: 1rem; font-weight: 800; color: #e0ead0; margin: 0; }
.producer-meta-row { display: flex; align-items: center; gap: 0.45rem; font-size: 0.82rem; color: #8fba8f; }
.producer-meta-row i { color: #c9e265; font-size: 0.85rem; }
.producer-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1rem 0.5rem; }
.producer-empty-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(201, 226, 101, 0.1); border: 1px solid rgba(201, 226, 101, 0.2); display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 1.3rem; margin-bottom: 0.75rem; }
.producer-empty-text { font-size: 0.92rem; font-weight: 700; color: #e0ead0; margin: 0 0 0.3rem; }
.producer-empty-sub { font-size: 0.78rem; color: #6b8a6b; margin: 0 0 1rem; line-height: 1.4; }
.select-producer-btn { background: #c9e265; color: #122216; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: background 0.15s, transform 0.1s; }
.select-producer-btn:hover { background: #d6ec6e; transform: translateY(-1px); }
.tracking-card { padding: 0; overflow: hidden; }
.tracking-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid #2a3d2e; }
.tracking-title-row { display: flex; align-items: center; gap: 0.5rem; }
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #c9e265; box-shadow: 0 0 0 0 rgba(201, 226, 101, 0.6); animation: pulse 1.6s infinite; }
.pulse-dot.inactive { background: #3d5c42; animation: none; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0.6); } 70% { box-shadow: 0 0 0 10px rgba(201, 226, 101, 0); } 100% { box-shadow: 0 0 0 0 rgba(201, 226, 101, 0); } }
.tracking-title { font-size: 0.92rem; font-weight: 800; color: #e0ead0; }
.tracking-meta { display: flex; align-items: center; gap: 0.6rem; }
.tracking-truck { font-size: 0.72rem; font-weight: 600; color: #8fba8f; }
.tracking-badge { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; padding: 0.3rem 0.65rem; border-radius: 6px; }
.badge-active { background: rgba(201, 226, 101, 0.15); color: #c9e265; border: 1px solid rgba(201, 226, 101, 0.35); }
.badge-waiting { background: rgba(148, 163, 184, 0.12); color: #9ab39d; border: 1px solid rgba(148, 163, 184, 0.3); }
.map-container { background: #0c1f15; }
.map-svg { display: block; width: 100%; height: auto; }
.map-sensors { display: flex; align-items: center; padding: 0.85rem 1.25rem; border-top: 1px solid #1a2a1e; gap: 1rem; }
.sensor-item { display: flex; align-items: center; gap: 0.55rem; flex: 1; }
.sensor-icon { color: #c9e265; font-size: 1rem; }
.sensor-data { display: flex; flex-direction: column; }
.sensor-label { font-size: 0.65rem; font-weight: 600; color: #6b8a6b; text-transform: uppercase; letter-spacing: 0.08em; }
.sensor-value { font-size: 1.1rem; font-weight: 800; color: #c9e265; }
.sensor-divider { width: 1px; height: 30px; background: #2a3d2e; }
.map-waiting { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem 2rem; }
.map-waiting-icon { font-size: 2.5rem; color: #3d5c42; margin-bottom: 0.85rem; }
.map-waiting-title { font-size: 0.95rem; font-weight: 700; color: #9ab39d; margin: 0 0 0.35rem; }
.map-waiting-sub { font-size: 0.78rem; color: #6b8a6b; max-width: 280px; margin: 0; line-height: 1.45; }
.quality-card { padding: 1rem 1.25rem; }
.quality-row { display: flex; align-items: center; gap: 0.85rem; }
.quality-icon-wrap { width: 38px; height: 38px; border-radius: 10px; background: rgba(201, 226, 101, 0.1); border: 1px solid rgba(201, 226, 101, 0.2); display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 1rem; flex-shrink: 0; }
.quality-info { display: flex; flex-direction: column; flex: 1; }
.quality-title { font-size: 0.78rem; font-weight: 700; color: #8fba8f; text-transform: uppercase; letter-spacing: 0.08em; }
.quality-status { font-size: 0.95rem; font-weight: 800; color: #e0ead0; }
.btn-reporte { margin-left: auto; padding: 0.45rem 0.9rem; font-size: 0.75rem; }
.timeline { display: flex; flex-direction: column; }
.timeline-step { display: flex; gap: 0.85rem; min-height: 56px; }
.timeline-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 24px; }
.marker-dot { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #2a3d2e; border: 2px solid #3d5c42; transition: all 0.2s; }
.timeline-step.completed .marker-dot { background: #c9e265; border-color: #c9e265; color: #122216; font-size: 0.65rem; }
.timeline-step.current .marker-dot { background: transparent; border-color: #c9e265; border-width: 3px; }
.current-ring { width: 8px; height: 8px; border-radius: 50%; background: #c9e265; }
.timeline-step.pending .marker-dot { background: #2a3d2e; border-color: #3d5c42; }
.marker-line { width: 2px; flex: 1; background: #3d5c42; margin: 4px 0; min-height: 16px; }
.marker-line.line-completed { background: #c9e265; }
.timeline-content { display: flex; flex-direction: column; padding-bottom: 0.75rem; }
.timeline-label { font-size: 0.85rem; font-weight: 600; color: #e0ead0; }
.timeline-label.bold { font-weight: 800; color: #c9e265; }
.timeline-step.pending .timeline-label { color: #6b8a6b; }
.timeline-sub { font-size: 0.72rem; color: #6b8a6b; margin-top: 0.15rem; }
.delivery-items { display: flex; flex-direction: column; gap: 0.65rem; }
.delivery-item { display: flex; gap: 0.75rem; align-items: flex-start; background: #2a3d2e; padding: 0.85rem; border-radius: 10px; border: 1px solid #3d5c42; }
.delivery-icon-wrap { width: 32px; height: 32px; border-radius: 8px; background: rgba(201, 226, 101, 0.1); border: 1px solid rgba(201, 226, 101, 0.2); display: flex; align-items: center; justify-content: center; color: #c9e265; font-size: 0.85rem; flex-shrink: 0; }
.delivery-text { display: flex; flex-direction: column; gap: 0.1rem; }
.delivery-label { font-size: 0.62rem; font-weight: 700; color: #6b8a6b; text-transform: uppercase; letter-spacing: 0.08em; }
.delivery-value { font-size: 0.82rem; font-weight: 700; color: #e0ead0; line-height: 1.35; }
.delivery-sub { font-size: 0.72rem; color: #8fba8f; }
:global(.delete-confirm-dialog) { font-family: 'DM Sans', sans-serif !important; background: #1a2a1e !important; border-radius: 16px !important; border: 1px solid #3d5c42 !important; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important; }
:global(.delete-confirm-dialog .p-dialog-header), :global(.delete-confirm-dialog .p-dialog-content), :global(.delete-confirm-dialog .p-dialog-footer) { background: #1a2a1e !important; color: #e0ead0 !important; border: none !important; }
.cancel-header { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; font-weight: 800; color: #e0ead0; }
.cancel-icon-wrap { width: 38px; height: 38px; border-radius: 10px; background: rgba(251, 191, 36, 0.15); border: 1.5px solid rgba(251, 191, 36, 0.35); display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 1.1rem; }
.cancel-body { font-family: 'DM Sans', sans-serif; }
.cancel-message { font-size: 0.9rem; color: #c8dcc8; line-height: 1.5; margin: 0.5rem 0 0.5rem; }
.cancel-warning { font-size: 0.75rem; color: #f87171; margin: 0; }
.cancel-footer { display: flex; gap: 0.75rem; }
.cancel-dismiss-btn, .cancel-confirm-btn { flex: 1; padding: 0.75rem; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.45rem; font-family: 'DM Sans', sans-serif; }
.cancel-dismiss-btn { background: transparent; color: #8fba8f; border: 1.5px solid #3d5c42; transition: background 0.15s, color 0.15s; }
.cancel-dismiss-btn:hover { background: #2a3d2e; color: #e0ead0; }
.cancel-confirm-btn { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1.5px solid rgba(248, 113, 113, 0.35); transition: background 0.2s, border-color 0.2s, color 0.2s; }
.cancel-confirm-btn:hover { background: rgba(248, 113, 113, 0.28); border-color: #f87171; color: #fca5a5; }
.drawer-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 1000; }
.quality-drawer { position: fixed; top: 0; right: 0; width: 520px; height: 100vh; background: #1a2a1e; box-shadow: -10px 0 30px rgba(0,0,0,0.5); border-left: 1px solid #2a3d2e; display: flex; flex-direction: column; z-index: 1001; }
.slide-drawer-enter-active, .slide-drawer-leave-active { transition: transform 0.3s ease-out; }
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.drawer-accent { height: 2px; background: #c9e265; flex-shrink: 0; }
.drawer-header { padding: 1.5rem; border-bottom: 1px solid #2a3d2e; display: flex; justify-content: space-between; align-items: flex-start; }
.drawer-header-left { display: flex; gap: 1rem; }
.drawer-back-btn { background: transparent; border: none; color: #e0ead0; font-size: 1.1rem; cursor: pointer; padding: 0.2rem; }
.drawer-titles h2 { font-size: 1.2rem; font-weight: 800; color: #e0ead0; margin: 0 0 0.25rem 0; }
.drawer-titles p { margin: 0; font-size: 0.75rem; color: #8fba8f; }
.drawer-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
.drawer-badge-main { background: #c9e265; color: #1a3020; font-size: 0.65rem; font-weight: 900; padding: 0.3rem 0.6rem; border-radius: 6px; letter-spacing: 0.05em; }
.drawer-time { font-size: 0.65rem; color: #6b8a6b; font-weight: 600; }
.drawer-content { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.drawer-section { display: flex; flex-direction: column; gap: 0.85rem; }
.section-heading-row { display: flex; justify-content: space-between; align-items: center; }
.section-heading { margin: 0; font-size: 0.85rem; color: #c9e265; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
.info-card.no-margin { margin-bottom: 0; padding: 1rem; }
.table-summary-strip { background: rgba(212, 163, 75, 0.12); color: #e5b95e; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; border-radius: 8px; margin-top: 0.5rem; border: 1px solid rgba(212, 163, 75, 0.3); }
.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.photo-item, .photo-placeholder { display: flex; flex-direction: column; gap: 0.4rem; }
.photo-item img { width: 100%; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #3d5c42; }
.photo-item p { margin: 0; font-size: 0.65rem; color: #8fba8f; text-align: center; line-height: 1.3; }
.photo-placeholder { height: 90px; border: 1px dashed #3d5c42; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6b8a6b; font-size: 0.75rem; gap: 0.3rem;}
.producer-notes { background: #1e2d22; border-left: 3px solid #c9e265; padding: 1rem; border-radius: 0 8px 8px 0; display: flex; flex-direction: column; gap: 0.75rem; border: 1px solid #2a3d2e; border-left-width: 3px; }
.producer-notes p { margin: 0; color: #e0ead0; font-size: 0.85rem; font-style: italic; line-height: 1.5; }
.drawer-footer { background: #1a2a1e; border-top: 1px solid #2a3d2e; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.footer-btn-group { display: flex; flex-direction: column; gap: 0.4rem; align-items: center; }
.action-btn-full { width: 100%; height: 44px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; }
.action-btn-full.lime { background: #c9e265; color: #122216; }
.action-btn-full.lime:hover { background: #d6ec6e; }
.action-btn-full.outline-amber { background: transparent; color: #e5b95e; border: 1.5px solid #e5b95e; height: 40px; }
.action-btn-full.outline-amber:hover { background: rgba(212, 163, 75, 0.1); }
.action-btn-full.outline-danger { background: transparent; color: #f87171; border: 1.5px solid rgba(248, 113, 113, 0.35); height: 40px; }
.action-btn-full.outline-danger:hover { background: rgba(248, 113, 113, 0.1); }
@media (max-width: 1200px) { .body-grid { grid-template-columns: 1fr 1fr; } .right-col { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; } .right-col .info-card { margin-bottom: 0; } }
@media (max-width: 900px) { .header-card { flex-direction: column; } .header-right { align-items: flex-start; } .meta-grid { grid-template-columns: repeat(2, 1fr); } .quality-drawer { width: 100%; } }
@media (max-width: 768px) { .detail-wrapper { padding: 1rem; } .body-grid { grid-template-columns: 1fr; } .right-col { grid-template-columns: 1fr; } }
</style>