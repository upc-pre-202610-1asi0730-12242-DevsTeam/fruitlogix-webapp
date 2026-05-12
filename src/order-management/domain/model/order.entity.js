import { Fruit } from './fruit.entity.js';

/**
 * Order entity within the Order Management bounded context.
 *
 * @class Order
 */
export class Order {
    constructor({
                    id = '',
                    clientName = '',
                    commercialClientId = '',
                    selectedFruits = [],
                    fruitType = '',
                    quantity = '',
                    status = '',
                    statusClass = '',
                    producer = '',
                    producerId = null,
                    product = '',
                    volume = '',
                    totalVolume = 0,
                    totalAmount = 0,
                    deliveryDueDate = null,
                    cancelledAt = null
                } = {}) {
        this.id = id;
        this.clientName = clientName;
        this.commercialClientId = commercialClientId;
        this.selectedFruits = (selectedFruits ?? []).map(f => new Fruit(f));
        this.fruitType = fruitType;
        this.quantity = quantity;
        this.status = status;
        this.statusClass = statusClass;
        this.producer = producer;
        this.producerId = producerId;
        this.product = product;
        this.volume = volume;
        this.totalVolume = totalVolume;
        this.totalAmount = totalAmount;
        this.deliveryDueDate = deliveryDueDate;
        this.cancelledAt = cancelledAt;
    }

    static fromJson(json) {
        return new Order(json);
    }
}
