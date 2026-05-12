const billing  = () => import('./views/invoices-billing.view.vue');
const checkout = () => import('./views/checkout.view.vue');
const result   = () => import('./views/payment-result.view.vue');

const paymentManagementRoutes = [
    { path: '',          name: 'payment-management-home', redirect: { name: 'invoices-billing' } },
    { path: 'billing',   name: 'invoices-billing',        component: billing,  meta: { title: 'Facturación e Invoices' } },
    { path: 'checkout',  name: 'payment-checkout',        component: checkout, meta: { title: 'Confirmar Pago' } },
    { path: 'result/:id',name: 'payment-result',          component: result,   meta: { title: 'Resultado del Pago' } }
];

export default paymentManagementRoutes;
