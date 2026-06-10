<template>
  <div class="stock-page">
    
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="icon-box icon-light-green">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div class="kpi-info">
          <span class="label">Total disponible</span>
          <div class="value"><strong>660</strong> kg</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="icon-box icon-light-gray">
          <i class="pi pi-clipboard"></i>
        </div>
        <div class="kpi-info">
          <span class="label">Productos activos</span>
          <div class="value"><strong>4</strong></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="icon-box icon-light-gray">
          <i class="pi pi-paperclip"></i>
        </div>
        <div class="kpi-info">
          <span class="label">Pedidos vinculados</span>
          <div class="value"><strong>3</strong></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="icon-box icon-light-green">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="kpi-info">
          <span class="label">Próxima cosecha</span>
          <div class="value"><strong>8</strong> <span class="unit">jun.</span></div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      
      <div class="main-column">
        <h2 class="section-title">Inventario por Producto</h2>
        
        <div class="inventory-cards">
          <div class="inv-card">
            <div class="inv-header">
              <h3 class="product-title">
                <i class="pi pi-tag product-icon-decor"></i> Mango Kent
              </h3>
              <span class="badge badge-optimo">Óptimo</span>
            </div>
            
            <div class="capacity-info">
              <div class="capacity-labels">
                <span>Capacidad ocupada</span>
                <span>315 / 500 kg</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill fill-green" style="width: 63%"></div>
              </div>
            </div>

            <div class="inputs-row">
              <div class="input-group">
                <label>Disponible (kg)</label>
                <input type="number" value="315" />
              </div>
              <div class="input-group">
                <label>Disponible desde</label>
                <input type="text" value="10/25/2023" />
              </div>
            </div>

            <div class="actions-row">
              <select class="select-vinculo">
                <option>Vincular a pedido...</option>
              </select>
              <button class="btn-update">Actualizar</button>
            </div>
          </div>

          <div class="inv-card card-critical">
            <div class="inv-header">
              <h3 class="product-title">
                <i class="pi pi-tag product-icon-decor"></i> Uva Red Globe
              </h3>
              <span class="badge badge-critico">
                <i class="pi pi-exclamation-triangle" style="font-size: 0.75rem; margin-right: 4px;"></i> Crítico
              </span>
            </div>
            
            <div class="capacity-info critical">
              <div class="capacity-labels">
                <span class="label-red">Capacidad ocupada (Stock bajo)</span>
                <span class="label-red">85 / 400 kg</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill fill-red" style="width: 21%"></div>
              </div>
            </div>

            <div class="inputs-row">
              <div class="input-group">
                <label>Disponible (kg)</label>
                <input type="number" value="85" class="input-critical" />
              </div>
              <div class="input-group">
                <label>Disponible desde</label>
                <input type="text" value="10/24/2023" />
              </div>
            </div>

            <div class="actions-row">
              <select class="select-vinculo">
                <option>Vincular a pedido...</option>
              </select>
              <button class="btn-update">Actualizar</button>
            </div>
          </div>
        </div>
      </div>

      <div class="side-column">
        <div class="widget-card">
          <h3 class="widget-title">Próximas Cosechas</h3>
          <div class="harvest-timeline">
            <div class="harvest-item">
              <div class="h-dot"></div>
              <div class="h-content">
                <p class="h-date">10 jun.</p>
                <p class="h-product">Arándano de Exportación</p>
                <div class="h-bottom">
                  <span class="h-qty">~80 kg</span>
                  <span class="badge badge-plan">Planificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="widget-card">
          <h3 class="widget-title">Disponibilidad Semanal</h3>
          <div class="week-calendar">
            <div class="day-col">
              <span class="day-name">L</span>
              <span class="day-indicator badge-mango" title="Mango">MG</span>
            </div>
            <div class="day-col">
              <span class="day-name">M</span>
              <span class="day-indicator badge-mango" title="Mango">MG</span>
            </div>
            <div class="day-col">
              <span class="day-name">M</span>
              <span class="day-indicator badge-empty"><i class="pi pi-minus"></i></span>
            </div>
            <div class="day-col">
              <span class="day-name">J</span>
              <span class="day-indicator badge-palta" title="Aguacate">AV</span>
            </div>
            <div class="day-col">
              <span class="day-name">V</span>
              <span class="day-indicator badge-palta" title="Aguacate">AV</span>
            </div>
            <div class="day-col">
              <span class="day-name">S</span>
              <span class="day-indicator badge-empty"><i class="pi pi-minus"></i></span>
            </div>
            <div class="day-col">
              <span class="day-name">D</span>
              <span class="day-indicator badge-empty"><i class="pi pi-minus"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="log-section">
      <h2 class="log-title">Log de Actualizaciones</h2>
      <div class="table-container">
        <table class="log-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cambio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hoy, 10:23</td>
              <td>Mango Kent</td>
              <td><span class="badge badge-up"><i class="pi pi-arrow-up"></i> +50 kg</span></td>
              <td>Actualización manual</td>
            </tr>
            <tr>
              <td>Ayer, 16:45</td>
              <td>Uva Red Globe</td>
              <td><span class="badge badge-down"><i class="pi pi-arrow-down"></i> -120 kg</span></td>
              <td>Vinculado a Pedido #401</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.stock-page {
  padding: 32px;
  font-family: 'DM Sans', sans-serif;
  background-color: #E1EBE1;
  min-height: calc(100vh - 80px);
}

/* KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.kpi-card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 233, 82, 0.3);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.icon-light-green {
  background-color: rgba(212, 233, 82, 0.15);
  color: #D4E952;
}

.icon-light-gray {
  background-color: rgba(255, 255, 255, 0.05);
  color: #9ab39d;
}

.kpi-info {
  display: flex;
  flex-direction: column;
}

.kpi-info .label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ab39d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.kpi-info .value {
  font-size: 1.8rem;
  color: #FFFFFF;
}

.kpi-info .value strong {
  font-weight: 800;
}

.kpi-info .value .unit {
  font-size: 1rem;
  color: #9ab39d;
  font-weight: 600;
}

/* Main Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a3020;
  letter-spacing: -0.02em;
}

/* Inventory Cards */
.inventory-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inv-card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s;
}

.inv-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 233, 82, 0.3);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.inv-card.card-critical {
  border-color: rgba(220, 53, 69, 0.3);
  border-left: 4px solid #ff6b6b;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.product-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-icon-decor {
  color: #D4E952;
  font-size: 1.1rem;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.badge-optimo { background-color: rgba(212, 233, 82, 0.15); color: #D4E952; }
.badge-critico { background-color: rgba(220, 53, 69, 0.15); color: #ff6b6b; }
.badge-plan { background-color: rgba(255, 255, 255, 0.1); color: #9ab39d; }
.badge-up { background-color: rgba(212, 233, 82, 0.15); color: #D4E952; gap: 4px; }
.badge-down { background-color: rgba(220, 53, 69, 0.15); color: #ff6b6b; gap: 4px; }

.capacity-info {
  margin-bottom: 24px;
}

.capacity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ab39d;
  margin-bottom: 8px;
}

.label-red {
  color: #ff6b6b;
}

.progress-bar {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
}

.fill-green { background-color: #D4E952; }
.fill-red { background-color: #ff6b6b; }

.inputs-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ab39d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-group input, .select-vinculo {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: #FFFFFF;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.input-group input:focus, .select-vinculo:focus {
  outline: none;
  border-color: #D4E952;
  box-shadow: 0 0 0 3px rgba(212, 233, 82, 0.1);
}

.input-critical {
  color: #ff6b6b !important;
  border-color: rgba(220, 53, 69, 0.5) !important;
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.actions-row {
  display: flex;
  gap: 16px;
}

.select-vinculo {
  flex: 1;
  color: #9ab39d;
}

.select-vinculo option {
  background: #1e2d22;
  color: #FFFFFF;
}

.btn-update {
  background-color: #D4E952;
  border: none;
  border-radius: 8px;
  padding: 0 24px;
  font-weight: 800;
  font-size: 0.95rem;
  color: #121212;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.btn-update:hover {
  background-color: #e2f57a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2);
}

/* Right Sidebar Widgets */
.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.widget-card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
}

.widget-title {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
}

/* Timeline */
.harvest-timeline {
  padding-left: 8px;
}

.harvest-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.harvest-item::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 15px;
  bottom: -20px;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.05);
}

.h-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #D4E952;
  border: 3px solid #1e2d22;
  position: relative;
  z-index: 1;
  margin-top: 2px;
}

.h-content {
  flex: 1;
}

.h-date {
  margin: 0;
  font-size: 0.8rem;
  color: #D4E952;
  font-weight: 700;
}

.h-product {
  margin: 4px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #FFFFFF;
}

.h-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.h-qty {
  font-size: 0.85rem;
  color: #9ab39d;
}

/* Week Calendar (Estilos para la solución tipográfica de i18n/B2B) */
.week-calendar {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
}

.day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ab39d;
}

.day-indicator {
  font-size: 0.7rem;
  font-weight: 800;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.5px;
}

.badge-mango {
  background-color: rgba(255, 193, 7, 0.15);
  color: #ffca2c;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.badge-palta {
  background-color: rgba(212, 233, 82, 0.15);
  color: #D4E952;
  border: 1px solid rgba(212, 233, 82, 0.2);
}

.badge-empty {
  color: rgba(255, 255, 255, 0.15);
  font-size: 0.65rem;
}

/* Log Section */
.log-section {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
}

.log-title {
  padding: 24px 24px 16px 24px;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
}

.log-table th,
.log-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-table th {
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 0.75rem;
  font-weight: 800;
  color: #D4E952;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.log-table td {
  font-size: 0.95rem;
  color: #FFFFFF;
  font-weight: 500;
}

.log-table tr:last-child td {
  border-bottom: none;
}

.log-table tr:hover td {
  background-color: rgba(255, 255, 255, 0.02);
}
</style>