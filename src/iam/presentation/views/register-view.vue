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
        <h1 class="main-heading">Únete a la red<br/>logística más<br/>eficiente.</h1>
        <p class="sub-heading">Crea una cuenta en FruitLogix y comienza a gestionar tus operaciones, monitorizar calidad y optimizar tus rutas en tiempo real.</p>

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

          <h1 class="title">Registro</h1>
          <p class="subtitle">Ingresa tus datos para crear una nueva cuenta.</p>

          <form @submit.prevent="handleRegister" class="form">
            <div class="form-row">
              <div class="form-group half-width">
                <label for="username">Nombre de Usuario</label>
                <div class="input-wrapper">
                  <i class="pi pi-user icon"></i>
                  <input type="text" id="username" v-model="username" placeholder="Usuario" required />
                </div>
              </div>

              <div class="form-group half-width">
                <label for="phone">Teléfono</label>
                <div class="input-wrapper">
                  <i class="pi pi-phone icon"></i>
                  <input type="tel" id="phone" v-model="phone" placeholder="+51..." required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <div class="input-wrapper">
                <i class="pi pi-envelope icon"></i>
                <input type="email" id="email" v-model="email" placeholder="nombre@fruitlogix.com" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half-width">
                <label for="password">Contraseña</label>
                <div class="input-wrapper">
                  <i class="pi pi-lock icon"></i>
                  <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="••••••••" required />
                  <button type="button" class="icon-btn" @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-group half-width">
                <label for="confirmPassword">Confirmar</label>
                <div class="input-wrapper">
                  <i class="pi pi-lock icon"></i>
                  <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" placeholder="••••••••" required />
                  <button type="button" class="icon-btn" @click="showConfirmPassword = !showConfirmPassword">
                    <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="userType">Tipo de Usuario</label>
              <div class="input-wrapper select-wrapper">
                <i class="pi pi-id-card icon"></i>
                <select id="userType" v-model="userType" required>
                  <option value="" disabled selected>Selecciona un tipo</option>
                  <option value="Cliente Comercial">Cliente Comercial</option>
                  <option value="Distribuidor">Distribuidor</option>
                  <option value="Productor">Productor</option>
                </select>
                <i class="pi pi-chevron-down select-icon"></i>
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? 'Procesando...' : 'Crear Cuenta' }}
              <i class="pi pi-user-plus" v-if="!loading"></i>
            </button>
          </form>

          <div class="footer-text">
            <p>¿Ya tienes una cuenta? <router-link to="/login" class="login-link">Iniciar Sesión</router-link></p>
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
  name: 'RegisterView',
  setup() {
    const username = ref('');
    const phone = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const userType = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const loading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      if (!userType.value) {
        alert('Selecciona un tipo de usuario.');
        return;
      }
      loading.value = true;
      try {
        await authStore.register({
          username: username.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
          userType: userType.value
        });
        alert('Cuenta creada exitosamente. Inicie sesión.');
        router.push('/login');
      } catch (error) {
        console.error('Error in registration', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      phone,
      email,
      password,
      confirmPassword,
      userType,
      showPassword,
      showConfirmPassword,
      loading,
      handleRegister
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
  padding: 40px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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
  font-size: 12px;
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
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 13px;
  color: #9ab39d;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-row {
  display: flex;
  gap: 16px;
}

.half-width {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #e0e0e0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #D4E952;
  box-shadow: 0 0 0 4px rgba(212, 233, 82, 0.1);
}

.icon {
  color: #7a947e;
  margin-right: 10px;
  font-size: 15px;
}

input, select {
  flex: 1;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  width: 100%;
}

input::placeholder {
  color: #5a705e;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #7a947e;
  cursor: pointer;
  font-size: 15px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: #FFFFFF;
}

.select-wrapper {
  padding-right: 14px;
}

select {
  appearance: none;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: 14px;
  color: #7a947e;
  pointer-events: none;
  font-size: 12px;
}

select option {
  background-color: #151a16;
  color: #FFFFFF;
}

.submit-btn {
  width: 100%;
  background-color: #D4E952;
  color: #0d1a11;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(212, 233, 82, 0.25);
  font-family: inherit;
  margin-top: 24px;
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

.footer-text {
  text-align: center;
  font-size: 13px;
  color: #9ab39d;
  margin-top: 24px;
}

.login-link {
  color: #D4E952;
  text-decoration: none;
  font-weight: 700;
  margin-left: 6px;
}

.login-link:hover {
  text-decoration: underline;
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
