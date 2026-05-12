/**
 * Alert entity within the Logistics & Monitoring bounded context.
 *
 * @class Alert
 */
export class Alert {
    constructor({ id = null, deliveryId = null, type = '', severity = 'INFO', message = '', createdAt = null } = {}) {
        this.id = id;
        this.deliveryId = deliveryId;
        this.type = type; // TEMPERATURE | HUMIDITY | LOCATION | DELAY
        this.severity = severity; // INFO | WARNING | CRITICAL
        this.message = message;
        this.createdAt = createdAt;
    }
}
