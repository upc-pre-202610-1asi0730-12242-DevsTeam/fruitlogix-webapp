/**
 * Producer entity within the Profiles & Vehicles bounded context.
 *
 * Representa a un productor agrícola (finca/empresa) que abastece a la red.
 *
 * @class Producer
 */
export class Producer {
    constructor({
                    id = null,
                    producerType = '',
                    fullName = '',
                    taxId = '',
                    legalName = '',
                    email = '',
                    phone = '',
                    country = '',
                    region = '',
                    city = '',
                    address = '',
                    crop = '',
                    cultivatedHectares = 0,
                    monthlyProduction = '',
                    operationsStartDate = null,
                    rating = 0,
                    certifications = '',
                    photo = ''
                } = {}) {
        this.id = id;
        this.producerType = producerType;
        this.fullName = fullName;
        this.taxId = taxId;
        this.legalName = legalName;
        this.email = email;
        this.phone = phone;
        this.country = country;
        this.region = region;
        this.city = city;
        this.address = address;
        this.crop = crop;
        this.cultivatedHectares = cultivatedHectares;
        this.monthlyProduction = monthlyProduction;
        this.operationsStartDate = operationsStartDate;
        this.rating = rating;
        this.certifications = certifications;
        this.photo = photo;
    }

    /** Devuelve la dirección completa "Ciudad, Región, País" sin huecos. */
    get fullLocation() {
        return [this.city, this.region, this.country].filter(Boolean).join(', ');
    }
}
