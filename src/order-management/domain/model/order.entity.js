import { Fruit } from './fruit.entity.js';

/**
 * Order entity within the Order Management bounded context.
 * Mantenida igual para no romper las vistas de la UI.
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
                    driver = '',
                    vehicle = '',
                    product = '',
                    volume = '',
                    totalVolume = 0,
                    totalAmount = 0,
                    deliveryDueDate = null,
                    cancelledAt = null,
                    deliveryAddress = '' // <-- ÚNICO CAMBIO: Agregamos esto de forma segura
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
        this.driver = driver;
        this.vehicle = vehicle;
        this.product = product;
        this.volume = volume;
        this.totalVolume = totalVolume;
        this.totalAmount = totalAmount;
        this.deliveryDueDate = deliveryDueDate;
        this.cancelledAt = cancelledAt;
        this.deliveryAddress = deliveryAddress; // Asignación de la dirección
    }

    static fromJson(json) {
        return new Order(json);
    }
}