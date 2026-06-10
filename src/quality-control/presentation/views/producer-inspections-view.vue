<template>
  <div class="inspections-page">
    
    <!-- Stepper Workflow -->
    <div class="header-section">
      <div class="stepper">
        <div class="step completed">
          <div class="step-icon"><i class="pi pi-check" style="font-size: 0.75rem;"></i></div>
          <span class="step-text">Registrar lote</span>
        </div>
        <div class="step-connector"></div>
        <div class="step active">
          <div class="step-icon">2</div>
          <span class="step-text">Documentar calidad</span>
        </div>
        <div class="step-connector pending"></div>
        <div class="step pending">
          <div class="step-icon">3</div>
          <span class="step-text">Enviar reporte</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Form Forms -->
      <div class="form-column">
        
        <h1 class="page-title">Reporte de Calidad — Lote #205</h1>
        
        <!-- Metadata Tags Section (Cleaned from Emojis) -->
        <div class="tags-container">
          <span class="tag">
            <i class="pi pi-tag tag-icon"></i> Mango Kent
          </span>
          <span class="tag">
            <i class="pi pi-database tag-icon"></i> 150 kg
          </span>
          <span class="tag">
            <i class="pi pi-sliders-h tag-icon"></i> Calibre A
          </span>
          <span class="tag tag-optimo">
            <i class="pi pi-sun tag-icon"></i> Madurez 72%
          </span>
        </div>

        <!-- Inspection Card 1 -->
        <div class="card">
          <h2 class="card-title">Inspección visual</h2>
          
          <div class="form-group">
            <label>Apariencia general</label>
            <div class="rating-boxes">
              <div class="rating-box">1</div>
              <div class="rating-box">2</div>
              <div class="rating-box">3</div>
              <div class="rating-box active">4</div>
              <div class="rating-box">5</div>
            </div>
            <div class="rating-labels">
              <span>Muy malo</span>
              <span>Excelente</span>
            </div>
          </div>

          <div class="form-group">
            <label>Defectos visibles</label>
            <div class="checkbox-grid">
              <label class="checkbox-label">
                <input type="checkbox" /> Manchas
              </label>
              <label class="checkbox-label">
                <input type="checkbox" /> Golpes
              </label>
              <label class="checkbox-label">
                <input type="checkbox" /> Deformaciones
              </label>
              <label class="checkbox-label">
                <input type="checkbox" /> Podredumbre
              </label>
            </div>
            <label class="checkbox-label checked-none">
              <input type="checkbox" checked /> Ninguno
            </label>
          </div>

          <div class="form-group">
            <label>Merma estimada</label>
            <div class="input-with-addon">
              <input type="number" value="3" />
              <span class="addon">%</span>
            </div>
          </div>
        </div>

        <!-- Inspection Card 2: Tech Specs -->
        <div class="card">
          <div class="card-header-flex">
            <h2 class="card-title with-icon">
              <i class="pi pi-sliders-v" style="color: #D4E952;"></i> Parámetros técnicos
            </h2>
            <button class="btn-link">
              <i class="pi pi-refresh" style="font-size: 0.8rem; margin-right: 4px;"></i> Autocompletar con sensor
            </button>
          </div>
          
          <div class="inputs-grid">
            <div class="input-group">
              <label>Temperatura</label>
              <div class="input-with-suffix">
                <input type="text" value="12" />
                <span class="suffix">°C</span>
              </div>
            </div>
            <div class="input-group">
              <label>Humedad</label>
              <div class="input-with-suffix">
                <input type="text" value="85" />
                <span class="suffix">%</span>
              </div>
            </div>
            <div class="input-group">
              <label>pH</label>
              <div class="input-with-suffix">
                <input type="text" value="4.2" />
              </div>
            </div>
            <div class="input-group">
              <label>Brix</label>
              <div class="input-with-suffix">
                <input type="text" value="14.5" />
                <span class="suffix">°Bx</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Status Indicators -->
        <div class="status-cards-grid">
          <div class="status-card white-card">
            <i class="pi pi-file status-icon-native"></i>
            <div class="status-text">
              <h4>Estándares del cliente</h4>
              <p>(Order #089)</p>
            </div>
          </div>
          <div class="status-card green-card">
            <div class="status-icon green-icon">
              <i class="pi pi-check"></i>
            </div>
            <div class="status-text">
              <h4>Lote apto para distribución</h4>
              <p>Todos los parámetros documentados</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Summary Panels -->
      <div class="summary-column">
        
        <div class="card">
          <h2 class="card-title">Resumen del lote</h2>
          
          <div class="product-header">
            <div class="product-img-placeholder">
              <i class="pi pi-image" style="color: #9ab39d; font-size: 1.4rem;"></i>
            </div>
            <div class="product-info">
              <h3>Mango Kent</h3>
              <p>Cosecha Lote #205</p>
            </div>
          </div>

          <div class="summary-list">
            <div class="summary-item">
              <span class="label">Cantidad Total</span>
              <span class="value">150 kg</span>
            </div>
            <div class="summary-item">
              <span class="label">Calibre Predominante</span>
              <span class="badge-grey">A (Grande)</span>
            </div>
            <div class="summary-item">
              <span class="label">Distribuidor Destino</span>
              <span class="value">
                <i class="pi pi-truck" style="color: #D4E952; margin-right: 6px; font-size: 0.9rem;"></i> FreshMart Intl.
              </span>
            </div>
          </div>
        </div>

        <!-- Photos Card -->
        <div class="card">
          <div class="card-header-flex">
            <h2 class="card-title">Fotos adjuntas</h2>
            <button class="btn-link">
              <i class="pi pi-camera" style="font-size: 0.8rem; margin-right: 4px;"></i> Añadir
            </button>
          </div>
          
          <div class="photos-grid">
            <div class="photo-box photo-1"></div>
            <div class="photo-box photo-2"></div>
          </div>
        </div>

        <!-- Checklist Card -->
        <div class="card">
          <h2 class="card-title">Checklist de preparación</h2>
          
          <div class="custom-checklist">
            <label class="custom-checkbox">
              <input type="checkbox" checked />
              <span class="checkmark"></span>
              Limpieza en seco realizada
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" checked />
              <span class="checkmark"></span>
              Clasificación por calibre confirmada
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" checked />
              <span class="checkmark"></span>
              Material de empaque inspeccionado
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" />
              <span class="checkmark"></span>
              Sellado final de cajas
            </label>
          </div>
        </div>

      </div>
    </div>

    <!-- Sticky Bottom Layout Bar -->
    <div class="bottom-actions">
      <button class="btn-text">
        <i class="pi pi-arrow-left" style="font-size: 0.85rem; margin-right: 6px;"></i> Volver
      </button>
      <button class="btn-primary">
        Enviar Reporte al Distribuidor <i class="pi pi-arrow-right" style="font-size: 0.85rem; margin-left: 6px;"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.inspections-page {
  font-family: 'DM Sans', sans-serif;
  background-color: #E1EBE1; 
  padding-bottom: 100px; 
  min-height: calc(100vh - 80px);
}

.header-section {
  padding: 24px 40px;
  background-color: transparent;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020; 
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.step-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  background: rgba(26, 48, 32, 0.1);
  border: 2px solid transparent;
  color: #4a6b4a;
}

.step.completed .step-icon,
.step.active .step-icon {
  background-color: #D4E952;
  border-color: #D4E952;
  color: #121212;
  box-shadow: 0 0 0 4px rgba(212, 233, 82, 0.2);
}

.step-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a6b4a;
}

.step.completed .step-text,
.step.active .step-text {
  color: #1a3020;
  font-weight: 800;
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #D4E952;
  margin: 0 16px;
  min-width: 60px;
  border-radius: 2px;
}

.step-connector.pending {
  background-color: rgba(26, 48, 32, 0.1);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: #1e2d22;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
  align-items: center;
}

.tag {
  background-color: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tag-icon {
  color: #D4E952;
  font-size: 0.9rem;
}

.tag-optimo {
  background-color: rgba(212, 233, 82, 0.15);
  color: #D4E952;
  border-color: rgba(212, 233, 82, 0.3);
}

.tag-optimo .tag-icon {
  color: #D4E952;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  padding: 0 40px;
}

.card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0 0 24px 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
}

.card-title.with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header-flex .card-title {
  margin-bottom: 0;
}

.btn-link {
  background: none;
  border: none;
  color: #D4E952;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s;
}

.btn-link:hover {
  opacity: 0.8;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ab39d;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rating-boxes {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.rating-box {
  flex: 1;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-weight: 700;
  color: #FFFFFF;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.rating-box:hover {
  border-color: rgba(212, 233, 82, 0.5);
}

.rating-box.active {
  border: 2px solid #D4E952;
  color: #D4E952;
  background-color: rgba(212, 233, 82, 0.05);
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.15);
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ab39d;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #FFFFFF;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #D4E952;
}

.checked-none {
  background-color: rgba(212, 233, 82, 0.15);
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  color: #D4E952;
  display: inline-flex;
  border: 1px solid rgba(212, 233, 82, 0.3);
}

.input-with-addon {
  display: flex;
  width: 140px;
}

.input-with-addon input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  width: 100%;
}

.input-with-addon .addon {
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 8px 8px 0;
  color: #9ab39d;
  font-weight: 700;
}

.input-with-addon input:focus {
  outline: none;
  border-color: #D4E952;
  box-shadow: inset 0 0 0 1px #D4E952;
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ab39d;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  transition: all 0.2s;
}

.input-with-suffix input:focus {
  outline: none;
  border-color: #D4E952;
  box-shadow: 0 0 0 3px rgba(212, 233, 82, 0.15);
}

.input-with-suffix .suffix {
  position: absolute;
  right: 16px;
  font-size: 0.85rem;
  color: #9ab39d;
  font-weight: 700;
}

.status-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.status-card {
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.status-card.white-card {
  background: rgba(0, 0, 0, 0.2);
}

.status-icon-native {
  font-size: 1.4rem;
  color: #9ab39d;
}

.status-card.green-card {
  background: rgba(212, 233, 82, 0.1);
  border-color: rgba(212, 233, 82, 0.3);
}

.status-icon.green-icon {
  width: 40px;
  height: 40px;
  background: #D4E952;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #121212;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2);
}

.status-text h4 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: #FFFFFF;
  font-weight: 800;
}

.status-text p {
  margin: 0;
  font-size: 0.85rem;
  color: #9ab39d;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.product-img-placeholder {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  color: #FFFFFF;
  font-weight: 800;
}

.product-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #9ab39d;
  font-weight: 500;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #FFFFFF;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.summary-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary-item .label {
  color: #9ab39d;
  font-weight: 600;
}

.summary-item .value {
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.badge-grey {
  background: rgba(255, 255, 255, 0.1);
  color: #9ab39d;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.photo-box {
  height: 120px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.photo-1 {
  background-image: linear-gradient(45deg, #1e2d22, #D4E952);
  opacity: 0.8;
}

.photo-2 {
  background-image: linear-gradient(45deg, #1a3020, #9ab39d);
  opacity: 0.8;
}

.custom-checklist {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 36px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #FFFFFF;
  font-weight: 500;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.2s;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: rgba(255, 255, 255, 0.05);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #D4E952;
  border-color: #D4E952;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid #121212;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 260px; 
  right: 0;
  background: #E1EBE1;
  border-top: 1px solid rgba(26, 48, 32, 0.1);
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.btn-text {
  background: none;
  border: none;
  font-weight: 700;
  color: #4a6b4a;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'DM Sans', sans-serif;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.btn-text:hover {
  color: #1a3020;
}

.btn-primary {
  background: #D4E952;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 800;
  color: #121212;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2);
}

.btn-primary:hover {
  background: #e2f57a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(212, 233, 82, 0.3);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .bottom-actions {
    left: 0;
  }
}
</style>