import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const devicesEndpointPath = import.meta.env.VITE_API_DEVICES;
const readingsEndpointPath = import.meta.env.VITE_API_SENSOR_READINGS;
const rulesEndpointPath    = import.meta.env.VITE_API_ALERT_RULES;

/**
 * IoT Infrastructure API Gateway.
 */
export class IoTInfrastructureApi extends BaseApi {
    #devicesEndpoint;
    #readingsEndpoint;
    #rulesEndpoint;

    constructor() {
        super();
        this.#devicesEndpoint  = new BaseEndpoint(this, devicesEndpointPath);
        this.#readingsEndpoint = new BaseEndpoint(this, readingsEndpointPath);
        this.#rulesEndpoint    = new BaseEndpoint(this, rulesEndpointPath);
    }

    // Devices
    getDevices() { return this.#devicesEndpoint.getAll(); }
    getDeviceById(id) { return this.#devicesEndpoint.getById(id); }
    updateDevice(id, resource) { return this.#devicesEndpoint.update(id, resource); }

    // Readings
    getReadings() { return this.#readingsEndpoint.getAll(); }
    getReadingsByDeviceId(deviceId) { return this.http.get(`${readingsEndpointPath}?deviceId=${deviceId}`); }
    registerReading(resource) { return this.#readingsEndpoint.create(resource); }

    // Rules
    getAlertRules() { return this.#rulesEndpoint.getAll(); }
}
