import { IoTDevice } from '../domain/model/iot-device.entity.js';

export class IoTDeviceAssembler {
    /**
     * @param {Object} raw
     * @returns {IoTDevice}
     */
    static toEntity(raw) {
        return new IoTDevice(
            raw.id || raw.deviceId,
            raw.deviceType,
            raw.location,
            raw.status,
            raw.lastReading ? new Date(raw.lastReading) : null
        );
    }

    /**
     * @param {IoTDevice} entity
     * @returns {Object}
     */
    static toResource(entity) {
        return {
            id: entity.deviceId,
            deviceType: entity.deviceType,
            location: entity.location,
            status: entity.status,
            lastReading: entity.lastReading?.toISOString()
        };
    }
}
