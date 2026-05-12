/**
 * Sensor entity within the IoT Infrastructure bounded context.
 *
 * @class Sensor
 */
export class Sensor {
    constructor({ id = null, type = '', vehicleId = null, isActive = true, registeredAt = null } = {}) {
        this.id = id;
        this.type = type; // TEMPERATURE | HUMIDITY | GPS
        this.vehicleId = vehicleId;
        this.isActive = isActive;
        this.registeredAt = registeredAt;
    }
}
