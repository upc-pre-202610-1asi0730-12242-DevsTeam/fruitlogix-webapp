import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IoTInfrastructureApi } from '../infrastructure/iot-infrastructure-api.js';
import { IoTDeviceAssembler } from '../infrastructure/iot-device.assembler.js';
import { SensorReadingAssembler } from '../infrastructure/sensor-reading.assembler.js';

const api = new IoTInfrastructureApi();

export const useIoTInfrastructureStore = defineStore('iot-infrastructure', () => {
    const devices = ref([]);
    const readings = ref([]);
    const alertRules = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    async function fetchDevices() {
        isLoading.value = true;
        try {
            const response = await api.getDevices();
            devices.value = response.data.map(d => IoTDeviceAssembler.toEntity(d));
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchReadings() {
        try {
            const response = await api.getReadings();
            readings.value = response.data.map(r => SensorReadingAssembler.toEntity(r));
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function calibrateDevice(deviceId) {
        const device = devices.value.find(d => d.deviceId === deviceId);
        if (device) {
            device.calibrate();
            try {
                await api.updateDevice(deviceId, IoTDeviceAssembler.toResource(device));
                // After calibration, set back to ACTIVE
                setTimeout(async () => {
                    device.connect();
                    await api.updateDevice(deviceId, IoTDeviceAssembler.toResource(device));
                }, 3000);
            } catch (error) {
                errors.value.push(error);
            }
        }
    }

    const deviceStats = computed(() => {
        return {
            total: devices.value.length,
            active: devices.value.filter(d => d.status === 'ACTIVE').length,
            offline: devices.value.filter(d => d.status === 'OFFLINE').length
        };
    });

    return {
        devices,
        readings,
        isLoading,
        errors,
        deviceStats,
        fetchDevices,
        fetchReadings,
        calibrateDevice
    };
});

export default useIoTInfrastructureStore;
