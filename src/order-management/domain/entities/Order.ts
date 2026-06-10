export interface OrderItem {
    productId: number;
    productName: string;
    quantityKg: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: string;
    customerId: number;
    status: string;
    deliveryDate: string;
    deliveryShift: string;
    address: string;
    instructions: string;
    total: number;
    items: OrderItem[];
}
