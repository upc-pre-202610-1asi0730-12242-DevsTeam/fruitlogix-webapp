import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const invoicesEndpointPath = import.meta.env.VITE_API_INVOICES;
const transactionsEndpointPath = import.meta.env.VITE_API_PAYMENT_TRANSACTIONS;

export class PaymentManagementApi extends BaseApi {
    #invoicesEndpoint;
    #transactionsEndpoint;

    constructor() {
        super();
        this.#invoicesEndpoint = new BaseEndpoint(this, invoicesEndpointPath);
        this.#transactionsEndpoint = new BaseEndpoint(this, transactionsEndpointPath);
    }

    getInvoices() { return this.#invoicesEndpoint.getAll(); }
    getInvoiceById(id) { return this.#invoicesEndpoint.getById(id); }

    getTransactions() { return this.#transactionsEndpoint.getAll(); }
    createTransaction(resource) { return this.#transactionsEndpoint.create(resource); }
}
