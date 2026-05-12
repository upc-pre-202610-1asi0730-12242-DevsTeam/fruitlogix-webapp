const home = () => import('./views/quality-control-home.vue');

const qualityControlRoutes = [
    { path: '', name: 'quality-control-home', component: home, meta: { title: 'Control de Calidad' } }
];

export default qualityControlRoutes;
