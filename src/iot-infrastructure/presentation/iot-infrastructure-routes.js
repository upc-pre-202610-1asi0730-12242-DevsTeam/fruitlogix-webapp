const home = () => import('./views/iot-management.view.vue');
const calibration = () => import('./views/iot-calibration.view.vue');

const iotInfrastructureRoutes = [
    { path: '', name: 'iot-infrastructure-home', component: home, meta: { title: 'Gestión de Dispositivos IoT' } },
    { path: 'calibrate/:id', name: 'iot-calibration', component: calibration, meta: { title: 'Calibración de Dispositivo' } }
];

export default iotInfrastructureRoutes;
