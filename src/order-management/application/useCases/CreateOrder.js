export class CreateOrder {
    async execute(order) {
        console.log('Creating order:', order);
        return order;
    }
}
