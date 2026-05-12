/**
 * User entity within the Profiles & Vehicles bounded context.
 *
 * @class User
 */
export class User {
    /**
     * @param {Object} params
     * @param {?number} [params.id=null]
     * @param {string} [params.fullName='']
     * @param {string} [params.email='']
     * @param {string} [params.role=''] - PRODUCER | DISTRIBUTOR | CLIENT | DRIVER | INSPECTOR
     * @param {string} [params.phone='']
     */
    constructor({ id = null, fullName = '', email = '', role = '', phone = '' } = {}) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.phone = phone;
    }
}
