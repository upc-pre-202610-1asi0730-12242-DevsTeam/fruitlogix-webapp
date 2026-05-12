import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const deliveriesEndpointPath   = import.meta.env.VITE_API_DELIVERIES;
const alertsEndpointPath       = import.meta.env.VITE_ALERTS_ENDPOINT_PATH     ?? '/alerts';
const trackingLogsEndpointPath = import.meta.env.VITE_API_TRACKING_LOGS;

/**
 * Logistics Monitoring API Gateway.
 * 
 * @class LogisticsMonitoringApi
 * @extends BaseApi
 */
export class LogisticsMonitoringApi extends BaseApi {
    #deliveriesEndpoint;
    #alertsEndpoint;
    #trackingLogsEndpoint;

    constructor() {
        super();
        this.#deliveriesEndpoint   = new BaseEndpoint(this, deliveriesEndpointPath);
        this.#alertsEndpoint       = new BaseEndpoint(this, alertsEndpointPath);
        this.#trackingLogsEndpoint = new BaseEndpoint(this, trackingLogsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getDeliveries()                { return this.#deliveriesEndpoint.getAll(); }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createDelivery(resource)       { return this.#deliveriesEndpoint.create(resource); }

    /** @param {string} id @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    updateDelivery(id, resource)   { return this.#deliveriesEndpoint.update(id, resource); }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getAlerts()                    { return this.#alertsEndpoint.getAll(); }

    /** 
     * Fetches tracking logs for a delivery.
     * @param {string} deliveryId 
     * @returns {Promise<import('axios').AxiosResponse>} 
     */
    getTrackingLogs(deliveryId) {
        return this.http.get(`${trackingLogsEndpointPath}?deliveryId=${deliveryId}`);
    }
}
