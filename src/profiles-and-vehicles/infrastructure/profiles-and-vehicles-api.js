import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

/**
 * Infrastructure gateway for the Producers bounded context.
 *
 * @class ProfilesAndVehiclesApi
 * @extends BaseApi
 */
export class ProfilesAndVehiclesApi extends BaseApi {
    #producersEndpoint;

    constructor() {
        super();
        // 🌟 FORZAMOS LA RUTA A TU BACKEND REAL EN RENDER
        this.#producersEndpoint = new BaseEndpoint(this, '/producers');
    }

    // ─── Producers ──────────────────────────────
    getProducers()                { return this.#producersEndpoint.getAll(); }
    getProducerById(id)           { return this.#producersEndpoint.getById(id); }
    createProducer(resource)      { return this.#producersEndpoint.create(resource); }
    updateProducer(id, resource)  { return this.#producersEndpoint.update(id, resource); }
    deleteProducer(id)            { return this.#producersEndpoint.delete(id); }
}