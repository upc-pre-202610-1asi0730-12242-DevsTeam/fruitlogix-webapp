<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <header class="mobile-top-bar">
      <div class="mobile-logo-wrap">
        <img src="../../../assets/logo_fruitlogix1.png" alt="Logo" class="mobile-logo-img" />
      </div>
      <pv-button icon="pi pi-bars" class="p-button-text toggle-btn" @click="sidebarVisible = true" />
    </header>

    <div v-if="sidebarVisible" class="sidebar-overlay" @click="sidebarVisible = false"></div>

    <aside class="sidebar" :class="{ 'sidebar-active': sidebarVisible }">
      <div class="sidebar-header">
        <div class="header-top-mobile">
          <pv-button icon="pi pi-times" class="p-button-text close-btn mobile-only" @click="sidebarVisible = false" />
        </div>
        <div class="logo-area">
          <img src="../../../assets/logo_fruitlogix1.png" alt="FruitLogix Logo" class="full-logo desktop-only" />
          <img src="../../../assets/logo_fruitlogix1.png" alt="FruitLogix Logo" class="small-logo-sidebar mobile-only" />
        </div>
        <div class="role-badge">{{ t('app.role.distributor') }}</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-group">
          <button v-for="item in menuItems" :key="item.id"
                  class="nav-item" :class="{ active: activeMenuItem.id === item.id }"
                  @click="handleNav(item)">
            <i :class="['pi', item.icon]" />
            <span>{{ t(item.sidebarLabel) }}</span>
          </button>
        </div>

        <div class="nav-footer">
          <button class="nav-item secondary">
            <i class="pi pi-question-circle" />
            <span>{{ t('nav.help') }}</span>
          </button>
          <button class="nav-item secondary logout" @click="handleLogout">
            <i class="pi pi-sign-out" />
            <span>{{ t('nav.logout') }}</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main Section -->
    <div class="main-container">
      <!-- Topbar -->
      <header class="topbar">
        <div class="page-info">
          <h1 class="header-title">{{ t(activeMenuItem.label) }}</h1>
          <p class="header-subtitle">{{ t('app.subtitle') }}</p>
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
              <span class="user-role">{{ t('app.role.distributor') }}</span>
            </div>
            <img src="https://v0.dev/placeholder.svg?height=40&width=40&text=CM" alt="User Avatar" class="user-avatar" />
          </div>
        </div>
      </header>

      <!-- Content Area -->
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
const authStore = useAuthStore();

const menuItems = [
  { id: 'dashboard',         label: 'pages.dashboard',   icon: 'pi-th-large',     sidebarLabel: 'nav.dashboard',    path: '/dashboard' },
  { id: 'order-management',  label: 'pages.order-management',  icon: 'pi-shopping-cart',sidebarLabel: 'nav.orders',      path: '/order-management/orders' },
  { id: 'profiles-and-vehicles', label: 'pages.profiles-and-vehicles', icon: 'pi-users',   sidebarLabel: 'nav.profiles',     path: '/profiles-and-vehicles' },
  { id: 'quality-control',   label: 'pages.quality-control',  icon: 'pi-check-square', sidebarLabel: 'nav.quality',      path: '/quality-control' },
  { id: 'logistics-monitoring', label: 'pages.logistics-monitoring', icon: 'pi-truck',  sidebarLabel: 'nav.logistics',    path: '/logistics-monitoring' },
  { id: 'payment-management',label: 'pages.payment-management',               icon: 'pi-dollar',       sidebarLabel: 'nav.payments',        path: '/payment-management' },
  { id: 'iot-infrastructure',label: 'pages.iot-infrastructure',icon: 'pi-wifi',         sidebarLabel: 'nav.iot',          path: '/iot-infrastructure' }
];

const handleLogout = () => {
  authStore.logout();

  router.push('/login');
};

const activeMenuItem = computed(() => {
  return menuItems.find(m => route.path.startsWith(m.path)) ?? menuItems[0];
});

const currentTitle = computed(() => activeMenuItem.value.label);

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
  width: 100vw;
  background-color: #E1EBE1;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background-color: #F0F8EC;
  border-right: 1px solid #d0e0d0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 2rem 1.5rem;
}

.logo-area {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.full-logo {
  height: 50px;
  width: auto;
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
  font-size: 0.65rem;
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
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 2000;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-active {
    left: 0;
    box-shadow: 10px 0 30px rgba(0,0,0,0.1);
  }

  .mobile-top-bar { display: flex; }
  .main-container { width: 100%; }

  .mobile-only { display: block; }
  .desktop-only { display: none; }

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
