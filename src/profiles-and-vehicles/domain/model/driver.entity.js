/**
 * Driver entity within the Profiles & Vehicles bounded context.
 *
 * @class Driver
 */
export class Driver {
    constructor({ id = null, userId = null, licenseNumber = '', licenseExpiryDate = null, yearsOfExperience = 0 } = {}) {
        this.id = id;
        this.userId = userId;
        this.licenseNumber = licenseNumber;
        this.licenseExpiryDate = licenseExpiryDate;
        this.yearsOfExperience = yearsOfExperience;
    }
}
