import { DeviceStatus } from './iot-enums.js';

/**
 * IoTDevice Domain Entity.
 */
export class IoTDevice {
    /**
     * @param {string} deviceId
     * @param {string} deviceType
     * @param {string} location
     * @param {string} status
     * @param {Date} lastReading
     */
    constructor(deviceId, deviceType, location, status, lastReading) {
        this.deviceId = deviceId;
        this.deviceType = deviceType;
        this.location = location;
        this.status = status;
        this.lastReading = lastReading;
    }

    /**
     * Connects the device to the infrastructure.
     */
    connect() {
        this.status = DeviceStatus.ACTIVE;
        console.log(`Device ${this.deviceId} connected.`);
    }

    /**
     * Sends data to the system.
     * @param {Object} data
     */
    sendData(data) {
        this.lastReading = new Date();
        console.log(`Device ${this.deviceId} sent data:`, data);
    }

    /**
     * Calibrates the device sensors.
     */
    calibrate() {
        this.status = DeviceStatus.MAINTENANCE;
        console.log(`Device ${this.deviceId} is being calibrated.`);
    }
}
