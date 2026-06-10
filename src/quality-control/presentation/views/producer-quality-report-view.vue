<template>
  <div class="quality-report">
    <header class="page-header">
      <h1>Reportes de Calidad</h1>
      <p>Revisa el estado y calidad de tus cargas recientes</p>
    </header>

    <div class="reports-grid">
      <div v-for="report in 4" :key="report" class="report-card">
        <div class="report-header">
          <span class="batch-id">Lote #L-2026-{{ report * 12 }}</span>
          <span :class="['status', report % 2 === 0 ? 'status-good' : 'status-warning']">
            {{ report % 2 === 0 ? 'Óptimo' : 'Con Observaciones' }}
          </span>
        </div>
        <div class="report-body">
          <p><strong>Producto:</strong> <span>Aguacate Hass</span></p>
          <p><strong>Fecha de Inspección:</strong> <span>05 de Junio, 2026</span></p>
          <p><strong>Calibre Promedio:</strong> <span>14</span></p>
          <p><strong>Defectos:</strong> <span>{{ report % 2 === 0 ? '< 2%' : '5%' }}</span></p>
        </div>
        <div class="report-footer">
          <button class="btn-outline">Descargar PDF</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica de reportes de calidad
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