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
    constructor(id, orderRef, issueDate, totalAmount, status) {
        this.id = id;
        this.orderRef = orderRef;
        this.issueDate = issueDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}

/**
 * PaymentTransaction Entity
 */
export class PaymentTransaction {
    constructor(id, amount, timestamp, method, gatewayRef, status, details = {}) {
        this.id = id;
        this.amount = amount;
        this.timestamp = timestamp;
        this.method = method;
        this.gatewayRef = gatewayRef;
        this.status = status;
        this.details = details; // card ending, card brand etc.
    }
}
