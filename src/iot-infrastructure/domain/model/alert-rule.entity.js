/**
 * AlertRule Domain Entity.
 */
export class AlertRule {
    /**
     * @param {string} ruleId
     * @param {string} deviceType
     * @param {number} minThreshold
     * @param {number} maxThreshold
     * @param {string} alertMessage
     */
    constructor(ruleId, deviceType, minThreshold, maxThreshold, alertMessage) {
        this.ruleId = ruleId;
        this.deviceType = deviceType;
        this.minThreshold = minThreshold;
        this.maxThreshold = maxThreshold;
        this.alertMessage = alertMessage;
    }

    /**
     * Evaluates a reading against the rule.
     * US18-TASK007: Quality alert evaluation.
     * @param {import('./sensor-reading.entity.js').SensorReading} reading
     * @returns {boolean} True if an alert should be triggered.
     */
    evaluate(reading) {
        if (!reading.validateRange(this.minThreshold, this.maxThreshold)) {
            reading.generateAlert(this.alertMessage);
            return true;
        }
        return false;
    }
}
