import { Producer } from '../domain/model/producer.entity.js';

/**
 * Mapea recursos de productor entre API JSON y entidad de dominio.
 *
 * @class ProducerAssembler
 */
export class ProducerAssembler {
    /** @param {Object} json @returns {Producer} */
    static toEntity(json) {
        return new Producer(json);
    }

    /** @param {Object[]} list @returns {Producer[]} */
    static toEntities(list) {
        return (list ?? []).map(json => new Producer(json));
    }

    /** @param {Producer} entity @returns {Object} */
    static toApi(entity) {
        return {
            id: entity.id,
            producerType: entity.producerType,
            fullName: entity.fullName,
            taxId: entity.taxId,
            legalName: entity.legalName,
            email: entity.email,
            phone: entity.phone,
            country: entity.country,
            region: entity.region,
            city: entity.city,
            address: entity.address,
            crop: entity.crop,
            cultivatedHectares: entity.cultivatedHectares,
            monthlyProduction: entity.monthlyProduction,
            operationsStartDate: entity.operationsStartDate,
            rating: entity.rating,
            certifications: entity.certifications,
            photo: entity.photo
        };
    }
}
