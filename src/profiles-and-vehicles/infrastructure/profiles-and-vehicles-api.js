import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const usersEndpointPath     = import.meta.env.VITE_USERS_ENDPOINT_PATH     ?? '/users';
const driversEndpointPath   = import.meta.env.VITE_DRIVERS_ENDPOINT_PATH   ?? '/drivers';
const vehiclesEndpointPath  = import.meta.env.VITE_VEHICLES_ENDPOINT_PATH  ?? '/vehicles';
const producersEndpointPath = import.meta.env.VITE_API_PRODUCERS;

/**
 * Infrastructure gateway for the Profiles & Vehicles bounded context.
 *
 * @class ProfilesAndVehiclesApi
 * @extends BaseApi
 */
export class ProfilesAndVehiclesApi extends BaseApi {
    #usersEndpoint;
    #driversEndpoint;
    #vehiclesEndpoint;
    #producersEndpoint;

    constructor() {
        super();
        this.#usersEndpoint     = new BaseEndpoint(this, usersEndpointPath);
        this.#driversEndpoint   = new BaseEndpoint(this, driversEndpointPath);
        this.#vehiclesEndpoint  = new BaseEndpoint(this, vehiclesEndpointPath);
        this.#producersEndpoint = new BaseEndpoint(this, producersEndpointPath);
    }

    // ─── Users ──────────────────────────────────
    getUsers()              { return this.#usersEndpoint.getAll(); }
    getUserById(id)         { return this.#usersEndpoint.getById(id); }
    createUser(resource)    { return this.#usersEndpoint.create(resource); }
    updateUser(id, resource){ return this.#usersEndpoint.update(id, resource); }
    deleteUser(id)          { return this.#usersEndpoint.delete(id); }

    // ─── Drivers ────────────────────────────────
    getDrivers()                  { return this.#driversEndpoint.getAll(); }
    getDriverById(id)             { return this.#driversEndpoint.getById(id); }
    createDriver(resource)        { return this.#driversEndpoint.create(resource); }
    updateDriver(id, resource)    { return this.#driversEndpoint.update(id, resource); }
    deleteDriver(id)              { return this.#driversEndpoint.delete(id); }

    // ─── Vehicles ───────────────────────────────
    getVehicles()                 { return this.#vehiclesEndpoint.getAll(); }
    getVehicleById(id)            { return this.#vehiclesEndpoint.getById(id); }
    createVehicle(resource)       { return this.#vehiclesEndpoint.create(resource); }
    updateVehicle(id, resource)   { return this.#vehiclesEndpoint.update(id, resource); }
    deleteVehicle(id)             { return this.#vehiclesEndpoint.delete(id); }

    // ─── Producers ──────────────────────────────
    getProducers()                { return this.#producersEndpoint.getAll(); }
    getProducerById(id)           { return this.#producersEndpoint.getById(id); }
    createProducer(resource)      { return this.#producersEndpoint.create(resource); }
    updateProducer(id, resource)  { return this.#producersEndpoint.update(id, resource); }
    deleteProducer(id)            { return this.#producersEndpoint.delete(id); }
}
