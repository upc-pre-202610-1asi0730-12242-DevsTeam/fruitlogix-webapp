const qualityControlHome = () => import('./views/quality-control-home.vue');
const customerReceptionView = () => import('./views/customer-reception-view.vue');

const qualityControlRoutes = [
    { path: '', name: 'quality-control-home', component: qualityControlHome, meta: { title: 'Control de Calidad' } },
    { path: 'customer-reception/:id', name: 'customer-reception', component: customerReceptionView, meta: { title: 'Confirmar Recepción', requiresAuth: true, role: 'customer' } }
];

export default qualityControlRoutes;
