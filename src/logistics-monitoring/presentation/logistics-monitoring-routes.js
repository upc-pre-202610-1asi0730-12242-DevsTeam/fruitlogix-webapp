const home      = () => import('./views/logistics-monitoring-home.vue');
const dashboard = () => import('./views/monitoring-dashboard.view.vue');
const details   = () => import('./views/delivery-details.view.vue');
const incidents = () => import('./views/analytics-incidents.view.vue');

const logisticsMonitoringRoutes = [
    { path: '',          redirect: { name: 'logistics-monitoring-dashboard' } },
    { path: 'dashboard', name: 'logistics-monitoring-dashboard', component: dashboard, meta: { title: 'Panel de Monitoreo' } },
    { path: 'tracking',  name: 'logistics-monitoring-tracking',  component: home,      meta: { title: 'Rastreo de Pedidos' } },
    { path: 'delivery/:id', name: 'delivery-details', component: details, meta: { title: 'Detalles de Seguimiento' } },
    { path: 'analytics-incidents', name: 'analytics-incidents', component: incidents, meta: { title: 'Analítica e Incidencias' } }
];

export default logisticsMonitoringRoutes;
