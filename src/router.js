/**
 * Application router configuration.
 * Registers all top-level routes, wires bounded-context child routes,
 * and applies the global navigation guard that manages document titles and IAM auth.
 *
 * @module router
 */
import { createRouter, createWebHistory, RouterView } from "vue-router";
import orderManagementRoutes from "./order-management/presentation/order-management-routes.js";
import profilesAndVehiclesRoutes from "./profiles-and-vehicles/presentation/profiles-and-vehicles-routes.js";
import qualityControlRoutes from "./quality-control/presentation/quality-control-routes.js";
import logisticsMonitoringRoutes from "./logistics-monitoring/presentation/logistics-monitoring-routes.js";
import paymentManagementRoutes from "./payment-management/presentation/payment-management-routes.js";
import iotInfrastructureRoutes from "./iot-infrastructure/presentation/iot-infrastructure-routes.js";
import i18n from './i18n.js';
import { useAuthStore } from './iam/application/auth.store.js';

// Lazy-loaded shared views
const dashboardView = () => import('./dashboard/presentation/views/dashboard-view.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

// Customer Views
const customerDashboardView = () => import('./dashboard/presentation/views/customer-dashboard-view.vue');
const customerCatalogView = () => import('./order-management/presentation/views/customer-catalog-view.vue');
const customerOrdersView = () => import('./order-management/presentation/views/customer-orders-view.vue');
const customerPaymentView = () => import('./payment-management/presentation/views/customer-payment-view.vue');
const customerTrackingView = () => import('./logistics-monitoring/presentation/views/customer-tracking-view.vue');
const customerReceptionView = () => import('./quality-control/presentation/views/customer-reception-view.vue');
const customerPayDashboardView = () => import('./payment-management/presentation/views/customer-pay-dashboard.view.vue');
import chatRoutes from './chat/presentation/chat-routes.js';

// Auth views
const loginView = () => import('./iam/presentation/views/login-view.vue');
const registerView = () => import('./iam/presentation/views/register-view.vue');

// ─── Producer views — Order Management bounded context ──────────────────────
const producerAssignedOrdersView = () => import('./order-management/presentation/views/producer-assigned-orders-view.vue');
const producerOrderDetailView = () => import('./order-management/presentation/views/producer-order-detail-view.vue');
const producerLoadRegisterView = () => import('./order-management/presentation/views/producer-load-register-view.vue');
const producerStockView = () => import('./order-management/presentation/views/producer-stock-view.vue');

// ─── Producer views — Quality Control bounded context ───────────────────────
const producerInspectionsView = () => import('./quality-control/presentation/views/producer-inspections-view.vue');
const producerQualityReportView = () => import('./quality-control/presentation/views/producer-quality-report-view.vue');

const routes = [
    // 1. Rutas Públicas (No requieren auth)
    { path: '/login', name: 'login', component: loginView, meta: { titleKey: 'pages.login', requiresAuth: false } },
    { path: '/register', name: 'register', component: registerView, meta: { titleKey: 'pages.register', requiresAuth: false } },

    // 2. Rutas Privadas — Distribuidor / Admin
    { path: '/dashboard', name: 'dashboard', component: dashboardView, meta: { titleKey: 'pages.dashboard', requiresAuth: true } },
    {
        path: '/order-management',
        name: 'order-management',
        redirect: '/order-management/orders',
        children: orderManagementRoutes,
        meta: { requiresAuth: true }
    },
    { path: '/profiles-and-vehicles', name: 'profiles-and-vehicles', children: profilesAndVehiclesRoutes, meta: { requiresAuth: true } },
    { path: '/quality-control', name: 'quality-control', children: qualityControlRoutes, meta: { requiresAuth: true } },
    { path: '/logistics-monitoring', name: 'logistics-monitoring', children: logisticsMonitoringRoutes, meta: { requiresAuth: true } },
    { path: '/payment-management', name: 'payment-management', children: paymentManagementRoutes, meta: { requiresAuth: true } },
    { path: '/iot-infrastructure', name: 'iot-infrastructure', children: iotInfrastructureRoutes, meta: { requiresAuth: true } },

    // 🟢 ARREGLADO: Chat del Distribuidor usando titleKey para i18n
    {
        path: '/chat',
        name: 'distributor-chat',
        component: () => import('./chat/presentation/views/distributor-chat-view.vue'),
        meta: { titleKey: 'nav.messages', requiresAuth: true }
    },

    // 3. Rutas Cliente
    {
        path: '/customer',
        component: RouterView, // <--- EL LIENZO TRANSPARENTE
        meta: { requiresAuth: true, role: 'customer' },
        children: [
            { path: 'dashboard', name: 'customer-dashboard', component: customerDashboardView, meta: { titleKey: 'pages.dashboard' } },
            { path: 'catalog', name: 'customer-catalog', component: customerCatalogView, meta: { titleKey: 'catalog.title' } },
            { path: 'orders', name: 'customer-orders', component: customerOrdersView, meta: { titleKey: 'orders.title' } },
            { path: 'payment/:orderId?', name: 'customer-payment', component: customerPaymentView, meta: { titleKey: 'pay.title' } },
            { path: 'tracking/:id?', name: 'customer-tracking', component: customerTrackingView, meta: { titleKey: 'track.title' } },
            { path: 'reception/:id?', name: 'customer-reception', component: customerReceptionView, meta: { titleKey: 'reception.title' } },
            { path: 'payments', name: 'customer-payments', component: customerPayDashboardView, meta: { titleKey: 'pay.title' } },
            { path: 'chat', children: chatRoutes, meta: { titleKey: 'chat.title' } }
        ]
    },

    // 4. Rutas Productor — Agrupadas lógicamente sin layout propio
    {
        path: '/producer',
        component: RouterView, // <--- EL LIENZO TRANSPARENTE
        redirect: '/producer/mis-pedidos',
        meta: { requiresAuth: true, role: 'producer' },
        children: [
            // order-management BC
            {
                path: 'mis-pedidos',
                name: 'producer-mis-pedidos',
                component: producerAssignedOrdersView,
                meta: { title: 'Mis Pedidos Asignados', subtitle: '3 pedidos activos esta semana' }
            },
            {
                path: 'mis-pedidos/:id',
                name: 'producer-mis-pedidos-detalle',
                component: producerOrderDetailView,
                meta: { title: 'Detalle del Pedido', subtitle: '3 pedidos activos esta semana' }
            },
            {
                path: 'mis-lotes',
                name: 'producer-mis-lotes',
                component: producerLoadRegisterView,
                meta: { title: 'Mis Lotes', subtitle: 'Portal del Productor - Gestión de cultivos y envíos' }
            },
            {
                path: 'stock',
                name: 'producer-stock',
                component: producerStockView,
                meta: { title: 'Mi Disponibilidad de Stock', subtitle: 'Mantén tu inventario actualizado para recibir pedidos' }
            },
            // quality-control BC
            {
                path: 'inspecciones',
                name: 'producer-inspecciones',
                component: producerInspectionsView,
                meta: { title: 'Documentar Calidad', subtitle: 'Paso 2 de 3 — Reporte de inspección' }
            },
            {
                path: 'reportar-calidad',
                name: 'producer-reportar-calidad',
                component: producerQualityReportView,
                meta: { title: 'Reportar Calidad', subtitle: 'Portal del Productor - Gestión de cultivos y envíos' }
            },
            {
                path: 'chat',
                name: 'producer-chat',
                component: () => import('./chat/presentation/views/producer-chat-view.vue'),
                meta: { title: 'Mensajes Logísticos' }
            }
        ]
    },

    // 5. Redirección base y 404
    { path: '/', name: 'root-redirect', redirect: '/dashboard' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { titleKey: 'pages.not-found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * Helper: retorna la ruta home según el rol del usuario.
 */
function getHomeRoute(role) {
    if (role === 'customer') return '/customer/dashboard';
    if (role === 'producer') return '/producer/mis-pedidos';
    return '/dashboard';
}

/**
 * Global navigation guard
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${String(from.name)} to ${String(to.name)}`);

    // Título de la pestaña
    const baseTitle = 'FruitLogix';
    const pageTitle = to.meta?.titleKey ? i18n.global.t(to.meta.titleKey) : (to.meta?.title || 'Centro de Distribución');
    document.title = `${baseTitle} - ${pageTitle}`;

    // Lógica de Autenticación (IAM)
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.userRole || authStore.role;

    // Regla A: Ruta privada sin sesión → Login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'login' });
    }

    // Regla B: Autenticado intenta ir al Login/Registro → su dashboard
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        return next(getHomeRoute(userRole));
    }

    // Regla C: Root redirect según rol
    if (to.name === 'root-redirect' && isAuthenticated) {
        return next(getHomeRoute(userRole));
    }

    // Regla D: Cliente intenta rutas fuera de /customer → su dashboard
    // PERMITIMOS EL ACCESO A /chat SI ES PARTE DE SU RUTA
    if (isAuthenticated && userRole === 'customer' && !to.path.startsWith('/customer') && to.meta.requiresAuth && to.name !== 'not-found') {
        return next('/customer/dashboard');
    }

    // Regla E: Productor intenta rutas fuera de /producer → su dashboard
    if (isAuthenticated && userRole === 'producer' && !to.path.startsWith('/producer') && to.meta.requiresAuth && to.name !== 'not-found') {
        return next('/producer/mis-pedidos');
    }

    // Regla F: Distribuidor intenta acceder a rutas de cliente o productor → su dashboard
    if (isAuthenticated && userRole !== 'customer' && userRole !== 'producer' && (to.path.startsWith('/customer') || to.path.startsWith('/producer'))) {
        return next('/dashboard');
    }

    return next();
});

export default router;