/**
 * Lazy-loaded route definitions for the Profiles & Vehicles bounded context.
 *
 * @module profilesAndVehiclesRoutes
 */
const producerList = () => import('./views/producer-list.view.vue');
const producerForm = () => import('./components/producer-register-form.vue');

const profilesAndVehiclesRoutes = [
    { path: '',                   redirect: { name: 'profiles-and-vehicles-list' } },
    { path: 'producers',          name: 'profiles-and-vehicles-list', component: producerList, meta: { title: 'Productores' } },
    { path: 'producers/new',      name: 'profiles-and-vehicles-new',  component: producerForm, meta: { title: 'Registrar Productor' } },
    { path: 'producers/:id/edit', name: 'profiles-and-vehicles-edit', component: producerForm, meta: { title: 'Editar Productor' } }
];

export default profilesAndVehiclesRoutes;
