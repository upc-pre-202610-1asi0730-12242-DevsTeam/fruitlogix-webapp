import { Invoice, PaymentTransaction } from '../domain/model/payment.model.js';

export class PaymentAssembler {
    static toInvoiceEntity(raw) {
        return new Invoice(
            raw.id,
            raw.orderRef,
            raw.issueDate,
            raw.totalAmount,
            raw.status
        );
    }

    static toTransactionEntity(raw) {
        return new PaymentTransaction(
            raw.id,
            raw.amount,
            raw.timestamp,
            raw.method,
            raw.gatewayRef,
            raw.status,
            raw.details
        );
    }

    static toInvoiceResource(entity) {
        return {
            id: entity.id,
            orderRef: entity.orderRef,
            issueDate: entity.issueDate,
            totalAmount: entity.totalAmount,
            status: entity.status
        };
    }
}
