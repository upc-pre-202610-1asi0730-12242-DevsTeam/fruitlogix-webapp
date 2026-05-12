/**
 * Threshold rule entity within the IoT Infrastructure bounded context.
 *
 * @class ThresholdRule
 */
export class ThresholdRule {
    constructor({ id = null, sensorType = '', minValue = null, maxValue = null, severity = 'WARNING' } = {}) {
        this.id = id;
        this.sensorType = sensorType; // TEMPERATURE | HUMIDITY
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.severity = severity; // WARNING | CRITICAL
    }
}
