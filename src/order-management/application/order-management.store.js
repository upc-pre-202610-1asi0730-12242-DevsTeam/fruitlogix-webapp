/**
 * Application service store for the Order Management bounded context.
 * Coordinates order use cases and keeps UI-facing state.
 *
 * @module useOrderManagementStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { OrderManagementApi } from '../infrastructure/order-management-api.js';
import { OrderAssembler } from '../infrastructure/order.assembler.js';

const orderManagementApi = new OrderManagementApi();

/**
 * Reactive store that exposes Order Management commands and queries.
 *
 * @returns {Object} Store state, getters and actions.
 */
const useOrderManagementStore = defineStore('order-management', () => {
    /** @type {import('vue').Ref<import('../domain/order.entity.js').Order[]>} */
    const orders = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const isLoading = ref(false);
    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const ordersLoaded = ref(false);

    /** @type {import('vue').ComputedRef<number>} */
    const ordersCount = computed(() => orders.value.length);
    /** @type {import('vue').ComputedRef<import('../domain/order.entity.js').Order[]>} */
    const recentOrders = computed(() => orders.value.slice(-3));

    /**
     * Loads orders from infrastructure and updates the application state.
     * @returns {Promise<void>}
     */
    async function fetchOrders() {
        isLoading.value = true;
        try {
            const response = await orderManagementApi.getOrders();
            orders.value = response.data.map(o => OrderAssembler.toEntity(o));
            ordersLoaded.value = true;
        } catch (error) {
            console.error('[order-management.store]', error);
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Finds an order entity by identifier.
     * @param {number|string} id - Order identifier.
     * @returns {import('../domain/order.entity.js').Order|undefined}
     */
    function getOrderById(id) {
        return orders.value.find(o => o.id === id);
    }

    /**
     * Creates an order through infrastructure and appends it to local state.
     * @param {Object} orderData - Order payload.
     * @returns {Promise<void>}
     */
    async function addOrder(orderData) {
        try {
            const response = await orderManagementApi.createOrder(orderData);
            orders.value.push(OrderAssembler.toEntity(response.data));
        } catch (error) {
            console.error('[order-management.store]', error);
            errors.value.push(error);
        }
    }

    /**
     * Updates an existing order and synchronizes local state.
     * @param {number|string} id - Order identifier.
     * @param {Object} orderData - Updated payload.
     * @returns {Promise<void>}
     */
    async function updateOrder(id, orderData) {
        try {
            const response = await orderManagementApi.updateOrder(id, orderData);
            const index = orders.value.findIndex(o => o.id === id);
            if (index !== -1) {
                orders.value[index] = OrderAssembler.toEntity(response.data);
            }
        } catch (error) {
            console.error('[order-management.store]', error);
            errors.value.push(error);
        }
    }

    /**
     * Eliminación lógica: marca el pedido con status "Cancelado" en lugar de borrarlo
     * del backend. La fila desaparece de la tabla activa porque `activeOrders` filtra
     * los cancelados, pero queda histórico para reportes/auditoría.
     *
     * @param {number|string} id - Order identifier.
     * @returns {Promise<void>}
     */
    async function deleteOrder(id) {
        const idx = orders.value.findIndex(o => o.id === id);
        if (idx === -1) return;
        const current = orders.value[idx];
        try {
            const response = await orderManagementApi.updateOrder(id, {
                ...current,
                status: 'Cancelado',
                statusClass: 'status-cancelled',
                cancelledAt: new Date().toISOString()
            });
            orders.value[idx] = OrderAssembler.toEntity(response.data);
        } catch (error) {
            console.error('[order-management.store]', error);
            errors.value.push(error);
        }
    }

    /**
     * Borrado físico (uso administrativo). No expuesto al UI del distribuidor.
     * @param {number|string} id
     * @returns {Promise<void>}
     */
    async function hardDeleteOrder(id) {
        try {
            await orderManagementApi.deleteOrder(id);
            orders.value = orders.value.filter(o => o.id !== id);
        } catch (error) {
            console.error('[order-management.store]', error);
            errors.value.push(error);
        }
    }

    /** Pedidos visibles para el distribuidor (excluye cancelados). */
    const activeOrders = computed(() =>
        orders.value.filter(o => o.status !== 'Cancelado')
    );

    return {
        orders,
        activeOrders,
        isLoading,
        errors,
        ordersLoaded,
        ordersCount,
        recentOrders,
        fetchOrders,
        getOrderById,
        addOrder,
        updateOrder,
        deleteOrder,
        hardDeleteOrder
    };
});

export default useOrderManagementStore;
export { useOrderManagementStore };
