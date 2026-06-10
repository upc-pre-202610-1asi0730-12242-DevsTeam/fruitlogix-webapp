<template>
  <div class="layout-wrapper">
    <header class="mobile-top-bar">
      <div class="mobile-logo-wrap">
        <img src="../../../assets/logo_fruitlogix1.png" alt="Logo" class="mobile-logo-img" />
      </div>
      <pv-button icon="pi pi-bars" class="p-button-text toggle-btn" @click="sidebarVisible = true" />
    </header>

    <div v-if="sidebarVisible" class="sidebar-overlay" @click="sidebarVisible = false"></div>

    <aside class="sidebar" :class="{ 'sidebar-active': sidebarVisible, 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="header-top-mobile">
          <pv-button icon="pi pi-times" class="p-button-text close-btn mobile-only" @click="sidebarVisible = false" />
        </div>
        <div class="logo-area" :class="{ 'collapsed-logo-area': isCollapsed }">
          <img v-show="!isCollapsed" src="../../../assets/logo_fruitlogix1.png" alt="FruitLogix Logo" class="full-logo" />
          <img v-show="isCollapsed" src="../../../assets/fruit_logo.png" alt="FruitLogix Logo" class="rail-logo" />
        </div>
        <div class="role-badge" v-if="!isCollapsed">{{ t(currentRoleKey) }}</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-group">
          <button v-for="item in activeMenuSet" :key="item.id"
                  class="nav-item" :class="{ active: activeMenuItem && activeMenuItem.id === item.id }"
                  @click="handleNav(item)"
                  :title="isCollapsed ? t(item.sidebarLabel) : ''">
            <i :class="['pi', item.icon]" />
            <span class="nav-label" v-if="!isCollapsed">{{ t(item.sidebarLabel) }}</span>
          </button>
        </div>

        <div class="nav-footer">
          <button class="nav-item secondary" :title="isCollapsed ? t('nav.help') : ''">
            <i class="pi pi-question-circle" />
            <span class="nav-label" v-if="!isCollapsed">{{ t('nav.help') }}</span>
          </button>
          <button class="nav-item secondary logout" @click="handleLogout" :title="isCollapsed ? t('nav.logout') : ''">
            <i class="pi pi-sign-out" />
            <span class="nav-label" v-if="!isCollapsed">{{ t('nav.logout') }}</span>
          </button>
        </div>
      </nav>
    </aside>

    <div class="main-container">
      <header class="topbar">
        <div class="topbar-left-group">
          <pv-button icon="pi pi-bars" class="p-button-text desktop-toggle-btn desktop-only" @click="isCollapsed = !isCollapsed" />
          <div class="page-info">
            <h1 class="header-title">{{ activeMenuItem ? t(activeMenuItem.label) : '' }}</h1>
            <p class="header-subtitle">{{ t('app.subtitle') }}</p>
          </div>
        </div>

        <div class="header-actions">
          <language-switcher />

          <div class="action-icons">
            <i class="pi pi-bell icon-btn" />
            <i class="pi pi-cog icon-btn" />
          </div>

          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">Carlos Mendoza</span>
              <span class="user-role">{{ t(currentRoleKey) }}</span>
            </div>
            <img src="https://v0.dev/placeholder.svg?height=40&width=40&text=CM" alt="User Avatar" class="user-avatar" />
          </div>
        </div>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';
import { useAuthStore } from '../../../iam/application/auth.store.js';

const route  = useRoute();
const router = useRouter();
const { t }  = useI18n();
const sidebarVisible = ref(false);
const isCollapsed = ref(true);
const authStore = useAuthStore();

// 1. Menú Distribuidor (Usa paths i18n)
const distributorMenu = [
  { id: 'dashboard',              label: 'pages.dashboard',           icon: 'pi-th-large',       sidebarLabel: 'nav.dashboard',    path: '/dashboard' },
  { id: 'order-management',       label: 'pages.order-management',    icon: 'pi-shopping-cart',  sidebarLabel: 'nav.orders',       path: '/order-management/orders' },
  { id: 'profiles-and-vehicles',  label: 'pages.profiles-and-vehicles', icon: 'pi-users',          sidebarLabel: 'nav.profiles',     path: '/profiles-and-vehicles' },
  { id: 'logistics-monitoring',   label: 'pages.logistics-monitoring',  icon: 'pi-truck',          sidebarLabel: 'nav.logistics',    path: '/logistics-monitoring' },
  { id: 'payment-management',     label: 'pages.payment-management',  icon: 'pi-dollar',         sidebarLabel: 'nav.payments',     path: '/payment-management' },
  { id: 'iot-infrastructure',     label: 'pages.iot-infrastructure',  icon: 'pi-wifi',           sidebarLabel: 'nav.iot',          path: '/iot-infrastructure' },
  { id: 'distributor-chat',                   label: 'pages.chat',                icon: 'pi-comments',       sidebarLabel: 'nav.messages',     path: '/chat' }
];

// 2. Nuevo Menú Productor — Corregido para usar las nuevas llaves del i18n JSON
const producerMenu = [
  { id: 'producer-orders',      label: 'nav.producer_orders',      icon: 'pi-shopping-cart',   sidebarLabel: 'nav.producer_orders',   path: '/producer/mis-pedidos' },
  { id: 'producer-lots',        label: 'nav.producer_lots',        icon: 'pi-truck',           sidebarLabel: 'nav.producer_lots',     path: '/producer/mis-lotes' },
  { id: 'producer-inspections', label: 'nav.producer_inspections', icon: 'pi-list',            sidebarLabel: 'nav.producer_inspections', path: '/producer/inspecciones' },
  { id: 'producer-report',      label: 'nav.producer_report',      icon: 'pi-exclamation-triangle', sidebarLabel: 'nav.producer_report', path: '/producer/reportar-calidad' },
  { id: 'producer-stock',       label: 'nav.producer_stock',       icon: 'pi-box',             sidebarLabel: 'nav.producer_stock',    path: '/producer/stock' },
  { id: 'producer-chat',        label: 'nav.producer_chat',        icon: 'pi-comments',        sidebarLabel: 'nav.producer_chat',     path: '/producer/chat' }
];

// 3. Menú Cliente (Usa paths i18n)
const customerMenu = [
  { id: 'customer-dashboard',    label: 'dashboard.title',        icon: 'pi-th-large',     sidebarLabel: 'nav.dashboard',    path: '/customer/dashboard' },
  { id: 'customer-catalog',      label: 'catalog.title',          icon: 'pi-shopping-bag', sidebarLabel: 'nav.catalog',      path: '/customer/catalog' },
  { id: 'customer-orders',       label: 'orders.title',           icon: 'pi-shopping-cart',sidebarLabel: 'nav.orders',       path: '/customer/orders' },
  { id: 'customer-tracking',     label: 'track.title',            icon: 'pi-map-marker',   sidebarLabel: 'nav.tracking',     path: '/customer/tracking' },
  { id: 'customer-payments',     label: 'pay.title',              icon: 'pi-credit-card',  sidebarLabel: 'nav.payments',     path: '/customer/payments' },
  { id: 'customer-reception',    label: 'reception.title',        icon: 'pi-check-square', sidebarLabel: 'nav.reception',    path: '/customer/reception' },
  { id: 'customer-chat',         label: 'chat.title',             icon: 'pi-comments',     sidebarLabel: 'nav.chat',         path: '/customer/chat' }
];

// 4. Conmutador reactivo de conjuntos de menús según rol activo
const activeMenuSet = computed(() => {
  const role = authStore.role;
  if (role === 'producer' || role === 'Productor') return producerMenu; 
  if (role === 'customer' || role === 'Cliente Comercial') return customerMenu;
  return distributorMenu;
});

// Resuelve reactivamente qué llave de traducción usar para el badge de rol activo
const currentRoleKey = computed(() => {
  const role = authStore.role?.toLowerCase();
  if (role === 'producer' || role === 'productor') return 'app.role.producer';
  if (role === 'customer' || role === 'cliente comercial') return 'app.role.customer';
  return 'app.role.distributor';
});

const handleLogout = () => {
    authStore.logout(); 
    router.push('/login'); 
};

// Determina el elemento de menú actualmente seleccionado de forma segura
const activeMenuItem = computed(() => {
  const currentSet = activeMenuSet.value;
  return currentSet.find(m => route.path.startsWith(m.path)) ?? currentSet[0];
});

const handleNav = (item) => {
  router.push(item.path);
  sidebarVisible.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

.layout-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  background-color: #E1EBE1;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.sidebar {
  width: 260px;
  background-color: #F0F8EC;
  border-right: 1px solid #d0e0d0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 2rem 1.5rem;
}

.logo-area {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  min-height: 50px;
}

.collapsed-logo-area {
  justify-content: center;
}

.full-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.rail-logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
}

.small-logo-sidebar {
  height: 42px;
  width: auto;
  object-fit: contain;
}

.mobile-only { display: none; }
.desktop-only { display: block; }

.mobile-top-bar {
  display: none;
  background: #1e2d22;
  padding: 0.75rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
}

.mobile-logo-img { height: 40px; }
.toggle-btn { color: #c9e265 !important; font-size: 1.5rem !important; }

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 1500;
}

.header-top-mobile { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
.close-btn { color: #1a3020 !important; font-size: 1.5rem !important; }

.role-badge {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1a3020;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding-left: 0.2rem;
  opacity: 0.8;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem 1.5rem;
}

.nav-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  color: #1a3020;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.93rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
  white-space: nowrap;
}

.sidebar-collapsed .nav-item {
  padding: 0.85rem;
  justify-content: center;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item i {
  font-size: 1.1rem;
  opacity: 0.7;
}

.nav-item:hover {
  background-color: rgba(215, 236, 110, 0.3);
}

.nav-item.active {
  background-color: #D7EC6E;
  box-shadow: 0 4px 12px rgba(215, 236, 110, 0.4);
}

.nav-item.active i {
  opacity: 1;
}

.nav-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #d0e0d0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item.secondary {
  color: #4a6b4a;
  font-size: 0.88rem;
  padding: 0.7rem 1.25rem;
}

.sidebar-collapsed .nav-item.secondary {
  padding: 0.7rem;
  justify-content: center;
}

.nav-item.secondary i {
  font-size: 1rem;
  color: #1bb37e;
}

.nav-item.logout {
  color: #f25f5c;
}

.nav-item.logout i {
  color: #f25f5c;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}

.topbar {
  height: 80px;
  background-color: #2A3D2E;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  color: white;
  flex-shrink: 0;
}

.topbar-left-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.desktop-toggle-btn {
  color: #8fba8f !important;
  font-size: 1.2rem !important;
  margin-right: 0.5rem;
}

.desktop-toggle-btn:hover {
  color: #c8e645 !important;
}

.header-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}

.header-subtitle {
  font-size: 0.8rem;
  color: #9ab39d;
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-icons {
  display: flex;
  gap: 1rem;
  padding: 0 0.5rem;
}

.icon-btn {
  font-size: 1.1rem;
  color: #8fba8f;
  cursor: pointer;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #c8e645;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 1px solid #3d5c42;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
}

.user-role {
  font-size: 0.64rem;
  font-weight: 700;
  color: #8fba8f;
  letter-spacing: 0.05em;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #3d5c42;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  position: relative;
  width: 100%;
}

@media (max-width: 1024px) {
  /* 1. Obligamos al sidebar a quedarse en pantalla, pero comprimido a 80px */
  .sidebar {
    position: relative !important;
    left: 0 !important;
    width: 80px !important;
    z-index: 100;
  }

  /* 2. Matamos la barra oscura de móvil porque el sidebar siempre estará visible */
  .mobile-top-bar {
    display: none !important;
  }

  /* 3. Ocultamos todos los textos y el rol */
  .nav-label, .role-badge {
    display: none !important;
  }

  /* 4. Centramos los iconos de los botones perfectamente */
  .nav-item, .nav-item.secondary {
    padding: 0.85rem !important;
    justify-content: center !important;
  }

  /* 5. Forzamos a que SIEMPRE se vea la manzanita pequeña (rail-logo) */
  .logo-area {
    justify-content: center !important;
  }
  .full-logo { display: none !important; }
  .rail-logo { display: block !important; }

  /* Ajustes del topbar principal */
  .desktop-toggle-btn { display: none !important; }
  .topbar {
    padding: 0 1.5rem;
    height: 70px;
  }
  .header-subtitle, .user-info { display: none; }
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    align-items: flex-start;
    gap: 1rem;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>