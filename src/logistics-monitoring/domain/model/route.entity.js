/**
 * Route Value Object.
 * Represents the planned path for a delivery.
 * 
 * @class Route
 */
export class Route {
    /**
     * @param {string} routeId - Unique identifier (UUID).
     * @param {string} origin - Starting point address or coordinates.
     * @param {string} destination - Ending point address or coordinates.
     * @param {number} distanceKm - Total distance in kilometers.
     * @param {string} optimizedPath - Encoded or structured optimized path data.
     */
    constructor(routeId, origin, destination, distanceKm, optimizedPath) {
        this.routeId = routeId;
        this.origin = origin;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.optimizedPath = optimizedPath;
    }

    /**
     * Calculates the Estimated Time of Arrival.
     * @param {number} averageSpeedKmH 
     * @returns {number} Hours to arrival.
     */
    calculateETA(averageSpeedKmH = 60) {
        return this.distanceKm / averageSpeedKmH;
    }

    /**
     * Optimizes the path based on traffic or distance (Stub).
     * @returns {string} The optimized path.
     */
    optimizePath() {
        console.log(`Optimizing path from ${this.origin} to ${this.destination}`);
        return this.optimizedPath; // In a real app, this would call a mapping service
    }
}
