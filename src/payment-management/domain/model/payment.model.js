/**
 * PaymentStatus Enum
 */
export const PaymentStatus = {
    PAID: 'PAID',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

/**
 * PaymentMethod Enum
 */
export const PaymentMethod = {
    CREDIT_CARD: 'CREDIT_CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    DIGITAL_WALLET: 'DIGITAL_WALLET'
};

/**
 * Invoice Entity
 */
export class Invoice {
    constructor(id, clientId, orderId, totalAmount, currency, dueDate, status, invoiceType, issuedAt, paidAt) {
        this.id = id;
        this.clientId = clientId;
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.dueDate = dueDate;         // DateOnly: "2024-05-15"
        this.status = status;           // "PENDING" | "PAID" | "OVERDUE" | "FAILED" | "REFUNDED"
        this.invoiceType = invoiceType; // "RECEIVABLE" | "PAYABLE"
        this.issuedAt = issuedAt;
        this.paidAt = paidAt;
    }
}

export class PaymentTransaction {
    constructor(id, invoiceId, amount, currency, method, gateway, gatewayRef, status, cardEnding, cardBrand, processedAt) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.currency = currency;
        this.method = method;
        this.gateway = gateway;
        this.gatewayRef = gatewayRef;
        this.status = status;
        this.cardEnding = cardEnding;
        this.cardBrand = cardBrand;
        this.processedAt = processedAt;
    }
}
