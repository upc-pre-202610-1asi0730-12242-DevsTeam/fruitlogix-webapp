/**
 * Delivery Status Enumeration.
 * Defines the possible states of a shipment in the logistics workflow.
 * 
 * @enum {string}
 */
export const DeliveryStatus = {
    PENDING_DISPATCH: 'PENDING_DISPATCH',
    IN_TRANSIT: 'IN_TRANSIT',
    DELAYED: 'DELAYED',
    DELIVERED: 'DELIVERED',
    FAILED: 'FAILED'
};

/**
 * Delivery Domain Entity.
 * Represents a shipment being tracked within the logistics context.
 * 
 * @class Delivery
 */
export class Delivery {
    /**
     * @param {string} deliveryId - Unique identifier (UUID).
     * @param {string} orderId - Associated order identifier.
     * @param {string} assignedDriver - Name of the driver responsible for delivery.
     * @param {string} vehiclePlate - License plate of the assigned vehicle.
     * @param {Date} estimatedTimeOfArrival - Expected delivery date and time.
     * @param {DeliveryStatus} currentStatus - Current state of the delivery.
     */
    constructor(deliveryId, orderId, assignedDriver, vehiclePlate, estimatedTimeOfArrival, currentStatus = DeliveryStatus.PENDING_DISPATCH) {
        this.deliveryId = deliveryId;
        this.orderId = orderId;
        this.assignedDriver = assignedDriver;
        this.vehiclePlate = vehiclePlate;
        this.estimatedTimeOfArrival = estimatedTimeOfArrival;
        this.currentStatus = currentStatus;
    }

    /**
     * Changes the delivery status to IN_TRANSIT.
     */
    startRoute() {
        this.currentStatus = DeliveryStatus.IN_TRANSIT;
        console.log(`Delivery ${this.deliveryId} is now in transit.`);
    }

    /**
     * Updates the delivery status.
     * @param {DeliveryStatus} status 
     */
    updateStatus(status) {
        if (Object.values(DeliveryStatus).includes(status)) {
            this.currentStatus = status;
        }
    }

    /**
     * Reports a delay and changes status to DELAYED.
     * @param {string} reason 
     */
    reportDelay(reason) {
        this.currentStatus = DeliveryStatus.DELAYED;
        console.warn(`Delivery ${this.deliveryId} delayed. Reason: ${reason}`);
    }
}
