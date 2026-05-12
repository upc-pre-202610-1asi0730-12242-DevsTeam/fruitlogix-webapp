/**
 * Vehicle entity within the Profiles & Vehicles bounded context.
 *
 * @class Vehicle
 */
export class Vehicle {
    constructor({ id = null, plate = '', type = '', capacityKg = 0, hasRefrigeration = false, assignedDriverId = null, lastMaintenanceDate = null } = {}) {
        this.id = id;
        this.plate = plate;
        this.type = type;
        this.capacityKg = capacityKg;
        this.hasRefrigeration = hasRefrigeration;
        this.assignedDriverId = assignedDriverId;
        this.lastMaintenanceDate = lastMaintenanceDate;
    }
}
