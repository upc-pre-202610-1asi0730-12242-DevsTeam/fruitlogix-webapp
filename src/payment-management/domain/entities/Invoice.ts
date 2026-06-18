export interface Invoice {
    id: string;
    orderId: string;
    amount: number;
    status: string;
    dueDate: string;
    paidDate?: string;
}
