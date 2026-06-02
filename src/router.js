/**
 * Application router configuration.
 * Registers all top-level routes, wires bounded-context child routes,
 * and applies the global navigation guard that manages document titles and IAM auth.
 *
 * @module router
 */
import { createRouter, createWebHistory } from "vue-router";
import orderManagementRoutes      from "./order-management/presentation/order-management-routes.js";
import profilesAndVehiclesRoutes  from "./profiles-and-vehicles/presentation/profiles-and-vehicles-routes.js";
import qualityControlRoutes       from "./quality-control/presentation/quality-control-routes.js";
import logisticsMonitoringRoutes  from "./logistics-monitoring/presentation/logistics-monitoring-routes.js";
import paymentManagementRoutes    from "./payment-management/presentation/payment-management-routes.js";
import iotInfrastructureRoutes    from "./iot-infrastructure/presentation/iot-infrastructure-routes.js";
import i18n from './i18n.js';
import { useAuthStore } from './iam/application/auth.store.js';

// Lazy-loaded shared views
const dashboardView = () => import('./dashboard/presentation/views/dashboard-view.vue');
const pageNotFound  = () => import('./shared/presentation/views/page-not-found.vue');

// Auth views
const loginView = () => import('./iam/presentation/views/login-view.vue');
const registerView = () => import('./iam/presentation/views/register-view.vue');

const routes = [
    // 1. Rutas Públicas (No requieren auth)
    { path: '/login', name: 'login', component: loginView, meta: { titleKey: 'pages.login', requiresAuth: false } },
    { path: '/register', name: 'register', component: registerView, meta: { titleKey: 'pages.register', requiresAuth: false } },

    // 2. Rutas Privadas (¡Añadimos requiresAuth: true a todas!)
    { path: '/dashboard', name: 'dashboard', component: dashboardView, meta: { titleKey: 'pages.dashboard', requiresAuth: true } },
    {
        path: '/order-management',
        name: 'order-management',
        redirect: '/order-management/orders',
        children: orderManagementRoutes,
        meta: { requiresAuth: true }
    },
    { path: '/profiles-and-vehicles', name: 'profiles-and-vehicles', children: profilesAndVehiclesRoutes, meta: { requiresAuth: true } },
    { path: '/quality-control',       name: 'quality-control',       children: qualityControlRoutes, meta: { requiresAuth: true } },
    { path: '/logistics-monitoring',  name: 'logistics-monitoring',  children: logisticsMonitoringRoutes, meta: { requiresAuth: true } },
    { path: '/payment-management',    name: 'payment-management',    children: paymentManagementRoutes, meta: { requiresAuth: true } },
    { path: '/iot-infrastructure',    name: 'iot-infrastructure',    children: iotInfrastructureRoutes, meta: { requiresAuth: true } },

    // 3. Redirección base y 404
    { path: '/', redirect: '/dashboard' }, // El guard interceptará esto si no hay sesión
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { titleKey: 'pages.not-found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * Global navigation guard
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${String(from.name)} to ${String(to.name)}`);

    // Configuración del Título
    const baseTitle = 'FruitLogix';
    const pageTitle = to.meta?.titleKey ? i18n.global.t(to.meta.titleKey) : (to.meta?.title || 'Centro de Distribución');
    document.title = `${baseTitle} - ${pageTitle}`;

    // Lógica de Autenticación (IAM)
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated; // Asegúrate de que esto exista en tu auth.store.js

    // Regla A: Si la ruta es privada y el usuario NO está logueado -> Al Login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'login' });
    }

    // Regla B: Si el usuario SÍ está logueado e intenta ir al Login o Registro -> Al Dashboard
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        return next({ name: 'dashboard' }); // O la ruta de inicio según su rol
    }

    // Regla C: Si todo está en orden, pasa libremente
    return next();
});

export default router;