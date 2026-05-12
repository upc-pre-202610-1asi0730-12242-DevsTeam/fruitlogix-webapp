export class DashboardStats {
    constructor({
        weeklyVolume = [],
        orderStatusStats = { delivered: 0, inTransit: 0, pending: 0 },
        activeOrders = 0,
        productQuality = 0,
        etaAverage = 0
    } = {}) {
        this.weeklyVolume = weeklyVolume;
        this.orderStatusStats = orderStatusStats;
        this.activeOrders = activeOrders;
        this.productQuality = productQuality;
        this.etaAverage = etaAverage;
    }
}
