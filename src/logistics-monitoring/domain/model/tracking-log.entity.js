/**
 * TrackingLog Value Object / Entity.
 * Represents a point-in-time sensor reading for a specific delivery.
 * 
 * @class TrackingLog
 */
export class TrackingLog {
    /**
     * @param {string} logId - Unique identifier (UUID).
     * @param {string} deliveryId - Associated delivery identifier.
     * @param {Date} timestamp - Time of the recording.
     * @param {string} gpsCoordinates - Current GPS location (lat, lng).
     * @param {number} temperature - Recorded temperature in Celsius.
     * @param {number} humidity - Recorded humidity percentage.
     */
    constructor(logId, deliveryId, timestamp, gpsCoordinates, temperature, humidity) {
        this.logId = logId;
        this.deliveryId = deliveryId;
        this.timestamp = timestamp;
        this.gpsCoordinates = gpsCoordinates;
        this.temperature = temperature;
        this.humidity = humidity;
    }

    /**
     * Records new sensor data.
     * (In a domain entity, this might trigger domain events).
     */
    recordSensorData() {
        console.log(`Recorded sensor data for Delivery ${this.deliveryId} at ${this.timestamp}`);
    }

    /**
     * Returns the conditions history (Stub for complex logic).
     * @returns {Object}
     */
    getConditionsHistory() {
        return {
            temp: this.temperature,
            hum: this.humidity,
            at: this.timestamp
        };
    }
}
