/**
 * Application router configuration.
 * Registers all top-level routes, wires bounded-context child routes,
 * and applies the global navigation guard that manages document titles.
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

// Lazy-loaded shared views
const dashboardView = () => import('./dashboard/presentation/views/dashboard-view.vue');
const pageNotFound  = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/dashboard',             name: 'dashboard',             component: dashboardView, meta: { titleKey: 'pages.dashboard' } },
    {
        path: '/order-management',
        name: 'order-management',
        redirect: '/order-management/orders',
        children: orderManagementRoutes
    },
    { path: '/profiles-and-vehicles', name: 'profiles-and-vehicles', children: profilesAndVehiclesRoutes },
    { path: '/quality-control',       name: 'quality-control',       children: qualityControlRoutes },
    { path: '/logistics-monitoring',  name: 'logistics-monitoring',  children: logisticsMonitoringRoutes },
    { path: '/payment-management',    name: 'payment-management',    children: paymentManagementRoutes },
    { path: '/iot-infrastructure',    name: 'iot-infrastructure',    children: iotInfrastructureRoutes },
    { path: '/',                redirect: '/dashboard' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { titleKey: 'pages.not-found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * Global navigation guard that updates the document title.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${String(from.name)} to ${String(to.name)}`);
    const baseTitle = 'FruitLogix';
    const pageTitle = to.meta?.titleKey ? i18n.global.t(to.meta.titleKey) : 'Centro de Distribución';
    document.title = `${baseTitle} - ${pageTitle}`;
    return next();
});

export default router;
