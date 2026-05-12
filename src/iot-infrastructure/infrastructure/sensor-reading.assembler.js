import { SensorReading } from '../domain/model/sensor-reading.entity.js';

export class SensorReadingAssembler {
    /**
     * @param {Object} raw
     * @returns {SensorReading}
     */
    static toEntity(raw) {
        return new SensorReading(
            raw.id || raw.readingId,
            raw.deviceId,
            raw.timestamp ? new Date(raw.timestamp) : new Date(),
            raw.value,
            raw.unit
        );
    }

    /**
     * @param {SensorReading} entity
     * @returns {Object}
     */
    static toResource(entity) {
        return {
            id: entity.readingId,
            deviceId: entity.deviceId,
            timestamp: entity.timestamp?.toISOString(),
            value: entity.value,
            unit: entity.unit
        };
    }
}
