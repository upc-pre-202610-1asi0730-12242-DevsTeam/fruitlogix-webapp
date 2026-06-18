export const chatRoutes = [
    {
        path: '',
        name: 'customer-chat',
        component: () => import('./views/customer-chat-view.vue'),
        meta: { title: 'Mensajes', requiresAuth: true, role: 'customer' }
    }
];

export default chatRoutes;
