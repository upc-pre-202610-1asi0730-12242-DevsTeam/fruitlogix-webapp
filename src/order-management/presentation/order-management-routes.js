/**
 * Lazy-loaded route definitions for the Order Management bounded context.
 * Registered as children of the `/order-management` route in the application router.
 *
 * @module orderManagementRoutes
 */
// Lazy-loaded views
const orderingModule = () => import('./views/ordering-module.vue');

const orderManagementRoutes = [
    {
        path: 'orders',
        name: 'order-list',
        component: orderingModule,
        meta: { title: 'Gestión de Pedidos' }
    }
];

export default orderManagementRoutes;
