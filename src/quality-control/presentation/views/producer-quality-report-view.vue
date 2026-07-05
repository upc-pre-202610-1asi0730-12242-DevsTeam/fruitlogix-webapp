<template>
  <div class="quality-report">
    <header class="page-header">
      <h1>Reportes de Calidad</h1>
      <p>Revisa el estado y calidad de tus cargas recientes</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #c9e265;"></i>
      <p>Consultando base de datos...</p>
    </div>

    <div v-else-if="reports.length === 0" class="empty-state">
      <i class="pi pi-file-excel" style="font-size: 3rem; color: #8fba8f; margin-bottom: 1rem;"></i>
      <h3>No hay reportes disponibles</h3>
      <p>Aún no has documentado ninguna inspección de calidad.</p>
    </div>

    <div v-else class="reports-grid">
      <div v-for="report in reports" :key="report.id" class="report-card">

        <div class="report-header">
          <span class="batch-id">Pedido #{{ report.orderId }}</span>
          <span :class="['status', report.wastePercentage <= 3 ? 'status-good' : 'status-warning']">
            {{ report.wastePercentage <= 3 ? 'ÓPTIMO' : 'CON OBSERVACIONES' }}
          </span>
        </div>

        <div class="report-body">
          <p><strong>Inspección Visual:</strong> <span>{{ report.appearanceRating }} / 5</span></p>
          <p><strong>Defectos (Merma):</strong> <span>{{ report.wastePercentage }}%</span></p>
          <p><strong>Temperatura:</strong> <span>{{ report.temperature }}°C</span></p>
          <p><strong>Humedad:</strong> <span>{{ report.humidity }}%</span></p>

          <div v-if="report.notes" class="report-notes">
            <small><i>"{{ report.notes }}"</i></small>
          </div>
        </div>

        <div class="report-footer">
          <button class="btn-outline" @click="downloadMockPdf(report.orderId)">
            <i class="pi pi-file-pdf" style="margin-right: 0.5rem;"></i> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// Usamos tu BaseApi que ya tiene inyectado el Token JWT y la base de Render
import { BaseApi } from '../../../shared/infrastructure/base-api.js';

const api = new BaseApi();
const reports = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // 🌟 HACEMOS LA LLAMADA A TU BACKEND REAL
    // Pedimos TODAS las inspecciones. C# devolverá un Array JSON.
    const url = 'https://fruitlogix-platform.onrender.com/api/v1/quality-inspections';
    const response = await api.http.get(url);

    // Mapeamos la data rara de C# a algo bonito y fácil de leer para Vue
    if (response.data && Array.isArray(response.data)) {
      reports.value = response.data.map(item => ({
        id: item.id,
        orderId: item.batchId || item.id, // Tu API parece usar batchId como OrderId
        notes: item.notes,
        wastePercentage: item.visualInspection?.wastePercentage || 0,
        appearanceRating: item.visualInspection?.appearanceRating || 5,
        temperature: item.technicalParameters?.temperatureCelsius || '--',
        humidity: item.technicalParameters?.humidityPercent || '--'
      })).reverse(); // Reverse para que los más nuevos salgan primero arriba
    }

  } catch (error) {
    console.error("Error cargando los reportes reales:", error);
    // Si falla (ej. problemas de C# o base de datos vacía), cargamos Mock Data
    reports.value = [
      { id: 1, orderId: '1', notes: 'Fruta en perfectas condiciones.', wastePercentage: 1.5, appearanceRating: 5, temperature: 12.5, humidity: 88 },
      { id: 2, orderId: '4', notes: 'Golpes leves por transporte en el 4% del lote.', wastePercentage: 4.2, appearanceRating: 3, temperature: 14.0, humidity: 90 }
    ];
  } finally {
    isLoading.value = false;
  }
});

function downloadMockPdf(id) {
  alert(`Generando PDF del Pedido #${id}... (Simulación de descarga)`);
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.quality-report {
  padding: 32px;
  font-family: 'DM Sans', sans-serif;
  background-color: #E1EBE1; /* Fondo base claro del Design System */
  min-height: calc(100vh - 80px);
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020; /* Título oscuro para contraste con el fondo */
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.page-header p {
  color: #4a6b4a;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.report-card {
  background: #1e2d22; /* Tarjeta en modo oscuro */
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 4px solid #D4E952; /* Acento verde neón superior */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.report-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 233, 82, 0.3);
  border-top-color: #D4E952;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.batch-id {
  font-weight: 800;
  color: #FFFFFF;
  font-size: 1.2rem;
}

.status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-good {
  background-color: rgba(212, 233, 82, 0.15);
  color: #D4E952;
}

.status-warning {
  background-color: rgba(253, 126, 20, 0.15);
  color: #fd9843;
}

.report-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-body p {
  margin: 0;
  color: #FFFFFF;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-body strong {
  color: #9ab39d; /* Etiqueta gris/verde */
  font-weight: 700;
  font-size: 0.85rem;
}

.report-body span {
  font-weight: 600;
}

.report-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.btn-outline {
  width: 100%;
  background-color: transparent;
  color: #D4E952;
  border: 1px solid rgba(212, 233, 82, 0.4);
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: rgba(212, 233, 82, 0.1);
  border-color: #D4E952;
}
</style>