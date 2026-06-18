import { Invoice, PaymentTransaction } from '../domain/model/payment.model.js';

export class PaymentAssembler {
    static toInvoiceEntity(raw) {
        return new Invoice(
            raw.id,
            raw.clientId,
            raw.orderId ?? null,
            raw.totalAmount,
            raw.currency,
            raw.dueDate,        // "2024-05-15" (DateOnly from backend)
            raw.status,
            raw.invoiceType,
            raw.issuedAt ?? null,
            raw.paidAt ?? null
        );
    }

    static toTransactionEntity(raw) {
        return new PaymentTransaction(
            raw.id,
            raw.invoiceId,
            raw.amount,
            raw.currency,
            raw.method,
            raw.gateway,
            raw.gatewayRef,
            raw.status,
            raw.cardEnding ?? null,
            raw.cardBrand ?? null,
            raw.processedAt
        );
    }

    static toCreateInvoiceResource(entity) {
        return {
            clientId: entity.clientId,
            orderId: entity.orderId,
            totalAmount: entity.totalAmount,
            currency: entity.currency,
            dueDate: entity.dueDate,
            invoiceType: entity.invoiceType
        };
    }

    static toCreateTransactionResource(data) {
        return {
            invoiceId: data.invoiceId,
            amount: data.amount,
            currency: data.currency,
            method: data.method,
            gateway: data.gateway,
            gatewayRef: data.gatewayRef,
            cardEnding: data.cardEnding ?? null,
            cardBrand: data.cardBrand ?? null
        };
    }
}