/**
 * Harvest batch entity within the Quality Control bounded context.
 *
 * @class HarvestBatch
 */
export class HarvestBatch {
    constructor({ id = null, producerId = null, fruitType = '', quantityKg = 0, harvestDate = null, status = 'PENDING' } = {}) {
        this.id = id;
        this.producerId = producerId;
        this.fruitType = fruitType;
        this.quantityKg = quantityKg;
        this.harvestDate = harvestDate;
        this.status = status; // PENDING | APPROVED | REJECTED
    }
}
