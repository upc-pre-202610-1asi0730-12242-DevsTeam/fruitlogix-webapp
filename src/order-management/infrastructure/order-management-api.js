import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const ordersEndpointPath    = import.meta.env.VITE_API_ORDERS;
const fruitsEndpointPath    = import.meta.env.VITE_API_FRUITS;
const producersEndpointPath = import.meta.env.VITE_API_PRODUCERS;
const clientsEndpointPath   = import.meta.env.VITE_API_CLIENTS;

/**
 * Infrastructure gateway for the Order Management bounded context.
 * Exposes CRUD operations over orders and read access to supporting
 * resources (fruits, producers, clients) via composed {@link BaseEndpoint}s.
 *
 * @class OrderManagementApi
 * @extends BaseApi
 */
export class OrderManagementApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #ordersEndpoint;
    /** @type {BaseEndpoint} */
    #fruitsEndpoint;
    /** @type {BaseEndpoint} */
    #producersEndpoint;
    /** @type {BaseEndpoint} */
    #clientsEndpoint;

    constructor() {
        super();
        this.#ordersEndpoint    = new BaseEndpoint(this, ordersEndpointPath);
        this.#fruitsEndpoint    = new BaseEndpoint(this, fruitsEndpointPath);
        this.#producersEndpoint = new BaseEndpoint(this, producersEndpointPath);
        this.#clientsEndpoint   = new BaseEndpoint(this, clientsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getOrders()             { return this.#ordersEndpoint.getAll(); }

    /** @param {number|string} id */
    getOrderById(id)        { return this.#ordersEndpoint.getById(id); }

    /** @param {Object} resource */
    createOrder(resource)   { return this.#ordersEndpoint.create(resource); }

    /** @param {number|string} id @param {Object} resource */
    updateOrder(id, resource) { return this.#ordersEndpoint.update(id, resource); }

    /** * Llama al PATCH específico de C# para asignar el productor
     * @param {number|string} id
     * @param {Object} resource
     */
    assignProducer(id, resource) {
        return this.http.patch(`${ordersEndpointPath}/${id}/assign-producer`, resource);
    }
    getOrdersByProducer(producerId) {
        return this.http.get(`${ordersEndpointPath}/producer/${producerId}`);
    }

    /** @param {number|string} id */
    deleteOrder(id) {
        return this.http.delete(`${ordersEndpointPath}/${id}`);
    }
    /** @returns {Promise<import('axios').AxiosResponse>} */
    getFruits()             { return this.#fruitsEndpoint.getAll(); }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getProducers()          { return this.#producersEndpoint.getAll(); }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getClients()            { return this.#clientsEndpoint.getAll(); }
}
