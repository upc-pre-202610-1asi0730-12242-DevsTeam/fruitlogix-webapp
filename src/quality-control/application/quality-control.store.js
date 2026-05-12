import { defineStore } from 'pinia';
import { ref } from 'vue';
import { QualityControlApi } from '../infrastructure/quality-control-api.js';
import { HarvestBatch } from '../domain/model/harvest-batch.entity.js';
import { Incident } from '../domain/model/incident.entity.js';

const api = new QualityControlApi();

const useQualityControlStore = defineStore('quality-control', () => {
    const batches   = ref([]);
    const incidents = ref([]);
    const errors    = ref([]);

    async function fetchBatches() {
        try {
            const r = await api.getBatches();
            batches.value = r.data.map(b => new HarvestBatch(b));
        } catch (e) { errors.value.push(e); }
    }
    async function fetchIncidents() {
        try {
            const r = await api.getIncidents();
            incidents.value = r.data.map(i => new Incident(i));
        } catch (e) { errors.value.push(e); }
    }
    return { batches, incidents, errors, fetchBatches, fetchIncidents };
});

export default useQualityControlStore;
export { useQualityControlStore };
