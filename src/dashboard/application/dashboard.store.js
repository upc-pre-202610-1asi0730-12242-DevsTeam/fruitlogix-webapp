/**
 * Application service store for the Dashboard bounded context.
 *
 * @module useDashboardStore
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DashboardApi } from '../infrastructure/dashboard-api.js';
import { DashboardAssembler } from '../infrastructure/dashboard.assembler.js';

const dashboardApi = new DashboardApi();

const useDashboardStore = defineStore('dashboard', () => {
    /** @type {import('vue').Ref<?import('../domain/dashboard-stats.entity.js').DashboardStats>} */
    const stats = ref(null);
    /** @type {import('vue').Ref<boolean>} */
    const isLoading = ref(false);
    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);

    /**
     * Loads dashboard statistics from infrastructure.
     * @returns {Promise<void>}
     */
    async function fetchStats() {
        isLoading.value = true;
        try {
            const response = await dashboardApi.getStats();
            stats.value = DashboardAssembler.toEntity(response.data);
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    return { stats, isLoading, errors, fetchStats };
});

export default useDashboardStore;
export { useDashboardStore };
