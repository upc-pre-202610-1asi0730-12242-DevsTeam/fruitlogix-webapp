import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const dashboardEndpointPath = import.meta.env.VITE_API_DASHBOARD;

/**
 * Infrastructure gateway for the Dashboard bounded context.
 *
 * @class DashboardApi
 * @extends BaseApi
 */
export class DashboardApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #dashboardEndpoint;

    constructor() {
        super();
        this.#dashboardEndpoint = new BaseEndpoint(this, dashboardEndpointPath);
    }

    /**
     * Retrieves dashboard statistics.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getStats() {
        return this.#dashboardEndpoint.getAll();
    }
}
