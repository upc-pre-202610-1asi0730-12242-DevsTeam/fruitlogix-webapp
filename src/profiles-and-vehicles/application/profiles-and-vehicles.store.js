/**
 * Application service store for the Profiles & Vehicles bounded context.
 *
 * @module useProfilesAndVehiclesStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ProfilesAndVehiclesApi } from '../infrastructure/profiles-and-vehicles-api.js';
import { ProducerAssembler } from '../infrastructure/producer.assembler.js';
import { User } from '../domain/model/user.entity.js';
import { Driver } from '../domain/model/driver.entity.js';
import { Vehicle } from '../domain/model/vehicle.entity.js';

const api = new ProfilesAndVehiclesApi();

const useProfilesAndVehiclesStore = defineStore('profiles-and-vehicles', () => {
    const users     = ref([]);
    const drivers   = ref([]);
    const vehicles  = ref([]);
    const producers = ref([]);
    const errors    = ref([]);
    const isLoading = ref(false);

    const producersCount = computed(() => producers.value.length);

    // ─── Users ──────────────────────────────────
    async function fetchUsers() {
        try {
            const r = await api.getUsers();
            users.value = r.data.map(u => new User(u));
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    // ─── Drivers ────────────────────────────────
    async function fetchDrivers() {
        try {
            const r = await api.getDrivers();
            drivers.value = r.data.map(d => new Driver(d));
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    // ─── Vehicles ───────────────────────────────
    async function fetchVehicles() {
        try {
            const r = await api.getVehicles();
            vehicles.value = r.data.map(v => new Vehicle(v));
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    // ─── Producers ──────────────────────────────
    async function fetchProducers() {
        isLoading.value = true;
        try {
            const r = await api.getProducers();
            producers.value = ProducerAssembler.toEntities(r.data);
        } catch (e) {
            console.error('[profiles-and-vehicles.store]', e);
            errors.value.push(e);
        } finally {
            isLoading.value = false;
        }
    }

    function getProducerById(id) {
        return producers.value.find(p => String(p.id) === String(id));
    }

    async function addProducer(producerData) {
        try {
            const r = await api.createProducer(producerData);
            producers.value.push(ProducerAssembler.toEntity(r.data));
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    async function updateProducer(id, producerData) {
        try {
            const r = await api.updateProducer(id, producerData);
            const idx = producers.value.findIndex(p => String(p.id) === String(id));
            if (idx !== -1) producers.value[idx] = ProducerAssembler.toEntity(r.data);
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    async function deleteProducer(id) {
        try {
            await api.deleteProducer(id);
            producers.value = producers.value.filter(p => String(p.id) !== String(id));
        } catch (e) { console.error('[profiles-and-vehicles.store]', e); errors.value.push(e); }
    }

    return {
        users, drivers, vehicles, producers,
        errors, isLoading, producersCount,
        fetchUsers, fetchDrivers, fetchVehicles,
        fetchProducers, getProducerById, addProducer, updateProducer, deleteProducer
    };
});

export default useProfilesAndVehiclesStore;
export { useProfilesAndVehiclesStore };
