import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const batchesEndpointPath   = import.meta.env.VITE_BATCHES_ENDPOINT_PATH   ?? '/harvest-batches';
const incidentsEndpointPath = import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH ?? '/incidents';

export class QualityControlApi extends BaseApi {
    #batchesEndpoint;
    #incidentsEndpoint;

    constructor() {
        super();
        this.#batchesEndpoint   = new BaseEndpoint(this, batchesEndpointPath);
        this.#incidentsEndpoint = new BaseEndpoint(this, incidentsEndpointPath);
    }

    getBatches()                  { return this.#batchesEndpoint.getAll(); }
    createBatch(resource)         { return this.#batchesEndpoint.create(resource); }
    updateBatch(id, resource)     { return this.#batchesEndpoint.update(id, resource); }

    getIncidents()                { return this.#incidentsEndpoint.getAll(); }
    createIncident(resource)      { return this.#incidentsEndpoint.create(resource); }
    updateIncident(id, resource)  { return this.#incidentsEndpoint.update(id, resource); }
}
