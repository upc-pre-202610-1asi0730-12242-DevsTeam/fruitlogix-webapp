import { Order } from '../domain/model/order.entity.js';

/**
 * Maps Order resources from/to API payloads.
 *
 * @class OrderAssembler
 */
export class OrderAssembler {
    /**
     * Maps API JSON to an Order entity.
     * @param {Object} json
     * @returns {Order}
     */
    static toEntity(json) {
        return new Order(json);
    }

    /**
     * Maps a list of API resources to Order entities.
     * @param {Object[]} list
     * @returns {Order[]}
     */
    static toEntities(list) {
        return (list ?? []).map(json => new Order(json));
    }

    /**
     * Maps an Order entity to an API-ready JSON payload.
     * @param {Order} entity
     * @returns {Object}
     */
    static toApi(entity) {
        return {
            id: entity.id,
            clientName: entity.clientName,
            commercialClientId: entity.commercialClientId,
            selectedFruits: entity.selectedFruits,
            fruitType: entity.fruitType,
            quantity: entity.quantity,
            status: entity.status,
            statusClass: entity.statusClass,
            producer: entity.producer,
            producerId: entity.producerId,
            driver: entity.driver,
            vehicle: entity.vehicle,
            product: entity.product,
            volume: entity.volume,
            totalVolume: entity.totalVolume,
            totalAmount: entity.totalAmount,
            deliveryDueDate: entity.deliveryDueDate,
            cancelledAt: entity.cancelledAt
        };
    }
}
