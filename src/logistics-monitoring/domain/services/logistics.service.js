/**
 * Logistics Domain Service.
 * Contains complex logic that doesn't belong to a single entity,
 * such as route optimization or global ETA recalculations.
 * 
 * @class LogisticsService
 */
export class LogisticsService {
    /**
     * Calculates the ETA for a delivery based on its current route and conditions.
     * @param {import('../model/delivery.entity.js').Delivery} delivery 
     * @param {import('../model/route.entity.js').Route} route 
     * @returns {Date}
     */
    static calculateETA(delivery, route) {
        const hoursToArrival = route.calculateETA();
        const now = new Date();
        now.setHours(now.getHours() + hoursToArrival);
        return now;
    }

    /**
     * Optimizes the path for a collection of routes.
     * @param {import('../model/route.entity.js').Route[]} routes 
     * @returns {import('../model/route.entity.js').Route[]}
     */
    static optimizeMultiplePaths(routes) {
        return routes.map(r => {
            r.optimizePath();
            return r;
        });
    }
}
