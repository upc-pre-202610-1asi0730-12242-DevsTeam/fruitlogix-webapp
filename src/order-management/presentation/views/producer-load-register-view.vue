<template>
  <div class="load-register">
    <header class="page-header">
      <h1>Registro de Carga</h1>
      <p>Ingresa los detalles de la nueva cosecha a enviar</p>
    </header>

    <div class="form-container">
      <form @submit.prevent="submitLoad" class="load-form">
        <div class="form-group">
          <label for="product">Producto</label>
          <select id="product" v-model="form.product" required>
            <option value="" disabled>Selecciona un producto</option>
            <option value="avocado">Aguacate Hass</option>
            <option value="mango">Mango Tommy</option>
            <option value="lemon">Limón Tahití</option>
          </select>
        </div>

        <div class="form-group">
          <label for="quantity">Cantidad (kg)</label>
          <input type="number" id="quantity" v-model="form.quantity" placeholder="Ej. 5000" required />
        </div>

        <div class="form-group">
          <label for="date">Fecha de Cosecha</label>
          <input type="date" id="date" v-model="form.date" required />
        </div>

        <div class="form-group">
          <label for="notes">Notas Adicionales</label>
          <textarea id="notes" v-model="form.notes" rows="4" placeholder="Observaciones de la carga..."></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">Registrar Carga</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  product: '',
  quantity: null,
  date: '',
  notes: ''
});

const submitLoad = () => {
  console.log('Carga registrada:', form);
  // Aquí llamamos al caso de uso de Application para registrar la carga
  alert('Carga registrada exitosamente');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.load-register {
  padding: 32px;
  font-family: 'DM Sans', sans-serif;
  background-color: #E1EBE1; /* Fondo base del Design System */
  min-height: calc(100vh - 80px);
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020; /* Texto oscuro para fondo claro */
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.page-header p {
  color: #4a6b4a;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.form-container {
  background: #1e2d22; /* Tarjeta oscura para el formulario */
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 600px;
}

.load-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 800;
  color: #9ab39d; /* Etiqueta gris/verde */
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #FFFFFF;
  transition: all 0.2s;
}

/* Color para el texto de relleno (placeholder) */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Solución para que las opciones del select se vean bien en modo oscuro */
.form-group select option {
  background: #1e2d22;
  color: #FFFFFF;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #D4E952;
  box-shadow: 0 0 0 3px rgba(212, 233, 82, 0.15);
  background: rgba(0, 0, 0, 0.3);
}

.form-actions {
  margin-top: 16px;
}

.btn-submit {
  width: 100%;
  background-color: #D4E952; /* Verde Neón */
  color: #121212;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2);
}

.btn-submit:hover {
  background-color: #e2f57a;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 233, 82, 0.3);
}

/* Ajuste del icono de calendario en el input date */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Pone el icono de calendario en blanco */
  opacity: 0.6;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>