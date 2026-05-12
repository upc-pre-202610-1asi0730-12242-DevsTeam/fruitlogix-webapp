import { DashboardStats } from '../domain/model/dashboard-stats.entity.js';

export class DashboardAssembler {
    static toEntity(json) {
        const data = Array.isArray(json) ? json[0] : json;
        if (!data) return new DashboardStats();

        return new DashboardStats({
            weeklyVolume: data.weeklyVolume,
            orderStatusStats: {
                delivered: data.deliveredOrders || 0,
                inTransit: data.inTransitOrders || 0,
                pending: data.pendingOrders || 0
            },
            activeOrders: data.activeOrders,
            productQuality: data.productQuality,
            etaAverage: data.etaAverage
        });
    }
}
