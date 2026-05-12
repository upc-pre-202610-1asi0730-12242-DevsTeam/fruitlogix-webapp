/**
 * Invoice entity within the Payment Management bounded context.
 *
 * @class Invoice
 */
export class Invoice {
    constructor({ id = null, orderId = null, clientId = null, amount = 0, currency = 'PEN', status = 'PENDING', issuedAt = null, paidAt = null } = {}) {
        this.id = id;
        this.orderId = orderId;
        this.clientId = clientId;
        this.amount = amount;
        this.currency = currency;
        this.status = status; // PENDING | PAID | FAILED
        this.issuedAt = issuedAt;
        this.paidAt = paidAt;
    }
}
