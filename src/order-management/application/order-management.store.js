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

    /* ── Wizard temporary state (lives across Steps 1→2→3) ── */
    const wizardProducer = ref(null);  // { id, name, location, rating, ... }
    const wizardVehicle = ref('ABC-123');
    const wizardDriver = ref('Carlos Ávila');

    function clearWizard() {
        wizardProducer.value = null;
        wizardVehicle.value = 'ABC-123';
        wizardDriver.value = 'Carlos Ávila';
    }

    /** @type {import('vue').ComputedRef<number>} */
    const ordersCount = computed(() => orders.value.length);
    /** @type {import('vue').ComputedRef<import('../domain/order.entity.js').Order[]>} */
    const recentOrders = computed(() => orders.value.slice(-3));

    /* ── 🌟 SIMULATION QUERIES (GETTERS PARA ROLES DE USUARIO) ── */

    /** Filtra pedidos visibles para el Distribuidor (excluye cancelados). */
    const activeOrders = computed(() =>
        orders.value.filter(o => o.status !== 'Cancelado' && o.status !== 'Cancelled')
    );

    /** Filtra pedidos para el Productor. Muestra solo los asignados a él en proceso. */
    const getOrdersForProducer = computed(() => {
        return (producerId) => orders.value.filter(o =>
            o.producerId === producerId || o.producer === producerId
        );
    });

    /** Filtra pedidos del Cliente actual para que vea su propio historial. */
    const getOrdersForCustomer = computed(() => {
        return (customerName) => orders.value.filter(o =>
            o.customerName === customerName || o.distributor === customerName
        );
    });


    /**
     * Loads orders from infrastructure and updates the application state.
     * @returns {Promise<void>}
     */
    async function fetchOrders() {
        isLoading.value = true;
        try {
            const response = await orderManagementApi.getOrders();
            orders.value = response.data.map(o => {
                // Mantenemos la inicialización de pruebas limpia de tu compañero
                if (o.status !== 'Cancelado' && o.status !== 'En Preparación' && o.status !== 'Listo Despacho') {
                    o.status = 'Pendiente';
                    o.statusClass = 'status-registered';
                }
                return OrderAssembler.toEntity(o);
            });
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
        return orders.value.find(o => String(o.id) === String(id));
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

    /* ── 🌟 SIMULATION COMMANDS (ACCIONES PARA INTERCONECTAR ROLES) ── */

    /**
     * CASO DE USO 1: El Cliente crea un pedido directo desde su carrito.
     * Inserta síncronamente en el array local para simulación inmediata.
     */
    function simulateCustomerCheckout(cartData) {
        const mockOrder = {
            id: String(Math.floor(Math.random() * 90) + 100), // Crea un ID aleatorio como #102
            distributor: cartData.distributor || 'Distribuidora Lima Sur',
            customerName: cartData.customerName || 'Distribuidora Lima Sur',
            summary: cartData.itemsSummary || 'Productos variados',
            products: cartData.itemsSummary || 'Mango Kent — 120 kg • Uva Red Globe — 50 kg',
            totalAmount: cartData.total || 170,
            deliveryDate: cartData.date || '15 jun. 2026',
            status: 'Pendiente',
            statusClass: 'status-registered',
            producerId: null,
            producer: '',
            driver: '',
            vehicle: ''
        };

        orders.value.unshift(mockOrder);
        console.log('[Simulación] Cliente creó pedido:', mockOrder);
        return mockOrder;
    }

    /**
     * CASO DE USO 2: El Distribuidor asigna productor y flota.
     * Modifica las propiedades reactivas locales y sincroniza el API.
     */
    function assignOrder(orderId, data) {
        const order = orders.value.find(
            o => o.id === orderId || String(o.id) === String(orderId)
        );
        if (!order) {
            console.error('[assignOrder] Order not found:', orderId);
            return false;
        }

        order.producerId = data.producerId ?? order.producerId;
        order.producer = data.producer ?? order.producer;
        order.driver = data.driver ?? order.driver;
        order.vehicle = data.vehicle ?? order.vehicle;
        order.status = data.status ?? order.status;
        order.statusClass = data.statusClass ?? order.statusClass;

        console.log('[assignOrder] Local state updated:', order);

        // API sync secundario
        const payload = OrderAssembler.toApi(order);
        orderManagementApi.updateOrder(orderId, payload).catch(err => {
            console.warn('[assignOrder] API sync failed:', err.message);
        });

        return true;
    }

    /**
     * CASO DE USO 3: El Productor cambia el estado del lote en su taller.
     * Ejemplo: Pasa de 'Pendiente Preparación' a 'En Preparación' o 'Listo Despacho'
     */
    function simulateProducerUpdateStatus(orderId, newStatus, statusClass = 'status-processing') {
        const order = orders.value.find(o => String(o.id) === String(orderId));
        if (order) {
            order.status = newStatus;
            order.statusClass = statusClass;
            console.log(`[Simulación] Productor actualizó orden #${orderId} a: ${newStatus}`);

            // API sync en segundo plano
            orderManagementApi.updateOrder(orderId, { status: newStatus, statusClass }).catch(() => { });
            return true;
        }
        return false;
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
     * Logical deletion.
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
     * Physical deletion.
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

    return {
        orders,
        activeOrders,
        getOrdersForProducer,
        getOrdersForCustomer,
        isLoading,
        errors,
        ordersLoaded,
        ordersCount,
        recentOrders,
        wizardProducer,
        wizardVehicle,
        wizardDriver,
        clearWizard,
        fetchOrders,
        getOrderById,
        addOrder,
        updateOrder,
        assignOrder,
        simulateCustomerCheckout,
        simulateProducerUpdateStatus,
        deleteOrder,
        hardDeleteOrder
    };
});

export default useOrderManagementStore;
export { useOrderManagementStore };