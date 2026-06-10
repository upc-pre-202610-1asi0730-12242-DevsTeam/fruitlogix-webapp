import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LogisticsMonitoringApi } from '../infrastructure/logistics-monitoring-api.js';
import { DeliveryAssembler } from '../infrastructure/delivery.assembler.js';
import { TrackingLogAssembler } from '../infrastructure/tracking-log.assembler.js';

const api = new LogisticsMonitoringApi();

/**
 * Logistics Monitoring Store.
 * Manages state for deliveries, tracking logs, and real-time monitoring.
 */
export const useLogisticsMonitoringStore = defineStore('logistics-monitoring', () => {
    /** @type {import('src/logistics-monitoring/domain/model/delivery.entity.js').Ref<import('../domain/model/delivery.entity.js').Delivery[]>} */
    const deliveries = ref([]);
    /** @type {import('src/logistics-monitoring/domain/model/tracking-log.entity.js').Ref<import('../domain/model/tracking-log.entity.js').TrackingLog[]>} */
    const trackingLogs = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    /** @type {import('vue').ComputedRef<number>} */
    const activeDeliveriesCount = computed(() =>
        deliveries.value.filter(d => d.currentStatus === 'IN_TRANSIT' || d.currentStatus === 'DELAYED').length
    );

    /**
     * Fetches all deliveries and maps them to domain entities.
     */
    async function fetchDeliveries() {
        isLoading.value = true;
        try {
            const response = await api.getDeliveries();
            deliveries.value = response.data.map(d => DeliveryAssembler.toEntity(d));
        } catch (error) {
            console.error('[logistics.store] Error fetching deliveries:', error);
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Fetches tracking logs for a specific delivery.
     * @param {string} deliveryId
     */
    async function fetchTrackingLogs(deliveryId) {
        try {
            const response = await api.getTrackingLogs(deliveryId);
            trackingLogs.value = response.data.map(l => TrackingLogAssembler.toEntity(l));
        } catch (error) {
            console.error('[logistics.store] Error fetching logs:', error);
            errors.value.push(error);
        }
    }

    /**
     * Starts a delivery route.
     * @param {string} deliveryId
     */
    async function startDelivery(deliveryId) {
        const delivery = deliveries.value.find(d => d.deliveryId === deliveryId);
        if (delivery) {
            delivery.startRoute();
            try {
                await api.updateDelivery(deliveryId, DeliveryAssembler.toResource(delivery));
            } catch (error) {
                errors.value.push(error);
            }
        }
    }

    /**
     * Reports a delay for a delivery.
     * @param {string} deliveryId
     * @param {string} reason
     */
    async function reportDelay(deliveryId, reason) {
        const delivery = deliveries.value.find(d => d.deliveryId === deliveryId);
        if (delivery) {
            delivery.reportDelay(reason);
            try {
                await api.updateDelivery(deliveryId, DeliveryAssembler.toResource(delivery));
            } catch (error) {
                errors.value.push(error);
            }
        }
    }

    return {
        deliveries,
        trackingLogs,
        isLoading,
        errors,
        activeDeliveriesCount,
        fetchDeliveries,
        fetchTrackingLogs,
        startDelivery,
        reportDelay
    };
});

export default useLogisticsMonitoringStore;
