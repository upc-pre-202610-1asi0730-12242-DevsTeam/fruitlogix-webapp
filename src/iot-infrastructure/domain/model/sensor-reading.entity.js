/**
 * SensorReading Domain Entity.
 */
export class SensorReading {
    /**
     * @param {string} readingId
     * @param {string} deviceId
     * @param {Date} timestamp
     * @param {number} value
     * @param {string} unit
     */
    constructor(readingId, deviceId, timestamp, value, unit) {
        this.readingId = readingId;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.value = value;
        this.unit = unit;
    }

    /**
     * Validates if the reading value is within a valid range for its type.
     * @param {number} min
     * @param {number} max
     * @returns {boolean}
     */
    validateRange(min, max) {
        return this.value >= min && this.value <= max;
    }

    /**
     * Generates an alert based on the reading.
     * @param {string} message
     */
    generateAlert(message) {
        console.warn(`[ALERT] Reading ${this.readingId}: ${message}`);
    }
}
