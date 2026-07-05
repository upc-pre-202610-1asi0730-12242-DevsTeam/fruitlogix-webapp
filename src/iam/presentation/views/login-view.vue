<template>
  <div class="auth-page">
    <div class="auth-background-image"></div>
    <div class="auth-overlay"></div>

    <div class="auth-content">
      <!-- Left Side Branding -->
      <div class="branding-section">
        <div class="badge">
          <span class="dot"></span>
          Plataforma inteligente para cadena de frío
        </div>
        <h1 class="main-heading">Controla calidad,<br/>trazabilidad y entregas<br/>desde un solo lugar.</h1>
        <p class="sub-heading">Accede a FruitLogix para monitorear lotes, validar productores y mantener cada envío dentro de sus parámetros críticos de frescura.</p>

        <div class="feature-badges">
          <div class="feature-badge"><i class="pi pi-bolt"></i> Monitoreo IoT</div>
          <div class="feature-badge"><i class="pi pi-map-marker"></i> Seguimiento en ruta</div>
          <div class="feature-badge"><i class="pi pi-check-circle"></i> Validación de calidad</div>
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="form-section">
        <div class="auth-card">
          <div class="card-header">
            <div class="logo-wrapper">
              <img src="../../../assets/logo_fruitlogix1.png" alt="FruitLogix" class="brand-logo" />
            </div>
            <div class="lang-switch">
              <span class="lang-btn active">ES</span>
              <span class="lang-btn">EN</span>
            </div>
          </div>

          <h1 class="title">Bienvenido</h1>
          <p class="subtitle">Ingresa tus credenciales para continuar con la operación logística.</p>

          <form @submit.prevent="handleLogin" class="form">
            <div class="form-group">
              <label for="username">Nombre de Usuario</label>
              <div class="input-wrapper">
                <i class="pi pi-user icon"></i>
                <input type="text" id="username" v-model="username" placeholder="Tu nombre de usuario" required />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <div class="input-wrapper">
                <i class="pi pi-lock icon"></i>
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="••••••••••••" required />
                <button type="button" class="icon-btn" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                Recordarme en este equipo
              </label>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
              <i class="pi pi-arrow-right" v-if="!loading"></i>
            </button>
          </form>

          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-label">Estado sensores</span>
              <span class="stat-value">24 online</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Rutas activas</span>
              <span class="stat-value">12 hoy</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Lotes validados</span>
              <span class="stat-value">148</span>
            </div>
          </div>

          <div class="footer-text">
            <p>¿No tienes una cuenta? <router-link to="/register" class="register-link">Crear Cuenta</router-link></p>
            <p class="disclaimer">Acceso seguro para distribuidores, productores y equipos de calidad.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../application/auth.store.js';

export default {
  name: 'LoginView',
  setup() {
    const username = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const loading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    const handleLogin = async () => {
      loading.value = true;
      try {
        const result = await authStore.login(username.value, password.value);

        if (result.success) {
        if (result.role === 'customer') {
          router.push('/customer/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    username,
    password,
    rememberMe,
    showPassword,
    loading,
    handleLogin
  };
}
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.auth-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #070e0a;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.auth-background-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 30%;
  background-image: url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  opacity: 0.25;
  filter: blur(8px) contrast(1.2) brightness(0.8);
  mask-image: linear-gradient(to right, transparent, black 40%);
  -webkit-mask-image: linear-gradient(to right, transparent, black 40%);
}

.auth-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 20%, rgba(212, 233, 82, 0.08) 0%, transparent 40%),
  radial-gradient(circle at 90% 80%, rgba(30, 60, 40, 0.4) 0%, transparent 40%);
  pointer-events: none;
}

.auth-content {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 1300px;
  padding: 40px;
  gap: 80px;
  align-items: center;
}

/* Left Side Branding */
.branding-section {
  flex: 1;
  color: #FFFFFF;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 45, 34, 0.8);
  border: 1px solid rgba(212, 233, 82, 0.15);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #D4E952;
  margin-bottom: 24px;
}

.badge .dot {
  width: 8px;
  height: 8px;
  background-color: #D4E952;
  border-radius: 50%;
  box-shadow: 0 0 8px #D4E952;
}

.main-heading {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.sub-heading {
  font-size: 1.1rem;
  color: #9ab39d;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 40px;
}

.feature-badges {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 30, 24, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #e0e0e0;
}

.feature-badge i {
  color: #D4E952;
}

/* Right Side Form */
.form-section {
  flex: 0 0 520px;
}

.auth-card {
  background: rgba(21, 26, 22, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 67px;
  width: auto;
  object-fit: contain;
}

.lang-switch {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 4px;
}

.lang-btn {
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  color: #7a947e;
  transition: all 0.2s;
}

.lang-btn.active {
  background: #FFFFFF;
  color: #121212;
}

.title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #9ab39d;
  margin-bottom: 32px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #e0e0e0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #D4E952;
  box-shadow: 0 0 0 4px rgba(212, 233, 82, 0.1);
}

.icon {
  color: #7a947e;
  margin-right: 12px;
  font-size: 16px;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 15px;
  outline: none;
  font-family: inherit;
}

input::placeholder {
  color: #5a705e;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #7a947e;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: #FFFFFF;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  font-size: 13px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 28px;
  color: #9ab39d;
  font-weight: 500;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  transition: all 0.2s;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #D4E952;
  border-color: #D4E952;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 3px;
  width: 4px;
  height: 9px;
  border: solid #121212;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #D4E952;
}

.submit-btn {
  width: 100%;
  background-color: #D4E952;
  color: #0d1a11;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(212, 233, 82, 0.25);
  font-family: inherit;
}

.submit-btn:hover {
  background-color: #e2f57a;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212, 233, 82, 0.35);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.stat-box {
  flex: 1;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 11px;
  color: #7a947e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
}

.footer-text {
  text-align: center;
  font-size: 13px;
  color: #9ab39d;
}

.register-link {
  color: #D4E952;
  text-decoration: none;
  font-weight: 700;
  margin-left: 6px;
}

.register-link:hover {
  text-decoration: underline;
}

.disclaimer {
  margin-top: 16px;
  font-size: 12px;
  color: #5a705e;
}

@media (max-width: 1024px) {
  .auth-content {
    flex-direction: column;
    padding: 20px;
    gap: 40px;
  }

  .branding-section {
    text-align: center;
    margin-top: 40px;
  }

  .sub-heading {
    margin: 0 auto 32px;
  }

  .feature-badges {
    justify-content: center;
  }

  .auth-background-image {
    left: 0;
    opacity: 0.15;
    mask-image: none;
    -webkit-mask-image: none;
  }

  .form-section {
    flex: 1;
    width: 100%;
    max-width: 520px;
  }
}
</style>
