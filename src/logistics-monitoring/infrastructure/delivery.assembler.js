import { Delivery } from '../domain/model/delivery.entity.js';

/**
 * Assembler for Delivery entities.
 * Maps between API DTOs and Domain Entities.
 */
export class DeliveryAssembler {
    /**
     * Maps a plain object (DTO) from the API to a Delivery Entity.
     * @param {Object} raw 
     * @returns {Delivery}
     */
    static toEntity(raw) {
        if (!raw) return null;
        return new Delivery(
            raw.deliveryId || raw.id,
            raw.orderId,
            raw.assignedDriver,
            raw.vehiclePlate,
            raw.estimatedTimeOfArrival ? new Date(raw.estimatedTimeOfArrival) : null,
            raw.currentStatus || raw.status
        );
    }

    /**
     * Maps a Delivery Entity to a plain object for API persistence.
     * @param {Delivery} entity 
     * @returns {Object}
     */
    static toResource(entity) {
        if (!entity) return null;
        return {
            id: entity.deliveryId,
            orderId: entity.orderId,
            assignedDriver: entity.assignedDriver,
            vehiclePlate: entity.vehiclePlate,
            estimatedTimeOfArrival: entity.estimatedTimeOfArrival?.toISOString(),
            status: entity.currentStatus
        };
    }
}
