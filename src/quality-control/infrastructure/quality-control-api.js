import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const batchesEndpointPath   = import.meta.env.VITE_BATCHES_ENDPOINT_PATH   ?? '/harvest-batches';
const incidentsEndpointPath = import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH ?? '/incidents';
// 👇 1. Agregamos la ruta del nuevo endpoint
const qualityInspectionsEndpointPath = import.meta.env.VITE_QUALITY_INSPECTIONS_ENDPOINT_PATH ?? '/quality-inspections';

export class QualityControlApi extends BaseApi {
    #batchesEndpoint;
    #incidentsEndpoint;
    #qualityInspectionsEndpoint; // 👇 2. Declaramos el endpoint

    constructor() {
        super();
        this.#batchesEndpoint   = new BaseEndpoint(this, batchesEndpointPath);
        this.#incidentsEndpoint = new BaseEndpoint(this, incidentsEndpointPath);
        this.#qualityInspectionsEndpoint = new BaseEndpoint(this, qualityInspectionsEndpointPath); // 👇 3. Lo inicializamos
    }

    getBatches()                  { return this.#batchesEndpoint.getAll(); }
    createBatch(resource)         { return this.#batchesEndpoint.create(resource); }
    updateBatch(id, resource)     { return this.#batchesEndpoint.update(id, resource); }

    getIncidents()                { return this.#incidentsEndpoint.getAll(); }
    createIncident(resource)      { return this.#incidentsEndpoint.create(resource); }
    updateIncident(id, resource)  { return this.#incidentsEndpoint.update(id, resource); }

    // 👇 4. Creamos los métodos para llamar al C#
    createQualityInspection(resource) {
        return this.#qualityInspectionsEndpoint.create(resource);
    }

    getQualityInspectionByBatch(batchId) {
        return this.http.get(`${qualityInspectionsEndpointPath}/batch/${batchId}`);
    }
}