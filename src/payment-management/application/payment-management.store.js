import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PaymentManagementApi } from '../infrastructure/payment-management-api.js';
import { PaymentAssembler } from '../infrastructure/payment.assembler.js';

const api = new PaymentManagementApi();

export const usePaymentManagementStore = defineStore('payment-management', () => {
    const invoices = ref([]);
    const transactions = ref([]);
    const isLoading = ref(false);

    async function fetchInvoices() {
        isLoading.value = true;
        try {
            const response = await api.getInvoices();
            invoices.value = response.data.map(i => PaymentAssembler.toInvoiceEntity(i));
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchTransactions() {
        const response = await api.getTransactions();
        transactions.value = response.data.map(t => PaymentAssembler.toTransactionEntity(t));
    }

    async function processPayment(paymentData) {
        isLoading.value = true;
        try {
            const response = await api.createTransaction(paymentData);
            const transaction = PaymentAssembler.toTransactionEntity(response.data);
            transactions.value.push(transaction);
            return transaction;
        } finally {
            isLoading.value = false;
        }
    }

    const billingStats = computed(() => {
        const totalOutstanding = invoices.value
            .filter(i => i.status === 'PENDING')
            .reduce((sum, i) => sum + i.totalAmount, 0);

        const recentPayments = invoices.value
            .filter(i => i.status === 'PAID')
            .reduce((sum, i) => sum + i.totalAmount, 0);

        return { totalOutstanding, recentPayments };
    });

    return {
        invoices,
        transactions,
        isLoading,
        billingStats,
        fetchInvoices,
        fetchTransactions,
        processPayment
    };
});
