/**
 * Lazy-loaded route definitions for the Order Management bounded context.
 * Registered as children of the `/order-management` route in the application router.
 *
 * @module orderManagementRoutes
 */
// Lazy-loaded views
const orderingModule = () => import('./views/ordering-moule.vue');
const orderDetailView = () => import('./views/order-detail-view.vue');

// Customer Views
const customerCatalogView = () => import('./views/customer-catalog-view.vue');
const customerOrdersView = () => import('./views/customer-orders-view.vue');

const orderManagementRoutes = [
    {
        path: 'catalog',
        name: 'customer-catalog',
        component: customerCatalogView,
        meta: { title: 'Catálogo de Productos', requiresAuth: true, role: 'customer' }
    },
    {
        path: 'customer-orders',
        name: 'customer-orders',
        component: customerOrdersView,
        meta: { title: 'Mis Pedidos', requiresAuth: true, role: 'customer' }
    },
    {
        path: 'orders',
        name: 'order-list',
        component: orderingModule,
        meta: { title: 'Gestión de Pedidos', requiresAuth: true, role: 'distributor' }
    },
    {
        path: 'orders/:id',
        name: 'order-detail',
        component: orderDetailView,
        meta: { title: 'Detalles del Pedido', requiresAuth: true, role: 'distributor' }
    },
    {
        path: 'orders/:id/assign-producer',
        name: 'assign-producer',
        component: () => import('./views/assign-producer-view.vue'),
        meta: { title: 'Seleccionar Productor', requiresAuth: true, role: 'distributor' }
    },
    {
        path: 'orders/:id/assign-fleet',
        name: 'assign-fleet',
        component: () => import('./views/assign-fleet-view.vue'),
        meta: { title: 'Asignar Flota', requiresAuth: true, role: 'distributor' }
    },
    {
        path: 'orders/:id/assign-success',
        name: 'assign-success',
        component: () => import('./views/assign-success-view.vue'),
        meta: { title: 'Asignación Exitosa', requiresAuth: true, role: 'distributor' }
    }
];

export default orderManagementRoutes;
