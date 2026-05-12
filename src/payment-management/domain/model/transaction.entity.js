/**
 * Transaction entity within the Payment Management bounded context.
 *
 * @class Transaction
 */
export class Transaction {
    constructor({ id = null, invoiceId = null, gateway = '', externalId = '', amount = 0, status = 'PENDING', createdAt = null } = {}) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.gateway = gateway; // CULQI | IZIPAY
        this.externalId = externalId;
        this.amount = amount;
        this.status = status; // PENDING | SUCCESS | FAILED
        this.createdAt = createdAt;
    }
}
