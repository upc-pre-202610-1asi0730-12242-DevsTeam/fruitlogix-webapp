import { TrackingLog } from '../domain/model/tracking-log.entity.js';

/**
 * Assembler for TrackingLog entities.
 */
export class TrackingLogAssembler {
    /**
     * @param {Object} raw 
     * @returns {TrackingLog}
     */
    static toEntity(raw) {
        if (!raw) return null;
        return new TrackingLog(
            raw.logId || raw.id,
            raw.deliveryId,
            raw.timestamp ? new Date(raw.timestamp) : new Date(),
            raw.gpsCoordinates || raw.location,
            raw.temperature,
            raw.humidity
        );
    }

    /**
     * @param {TrackingLog} entity 
     * @returns {Object}
     */
    static toResource(entity) {
        if (!entity) return null;
        return {
            id: entity.logId,
            deliveryId: entity.deliveryId,
            timestamp: entity.timestamp?.toISOString(),
            location: entity.gpsCoordinates,
            temperature: entity.temperature,
            humidity: entity.humidity
        };
    }
}
