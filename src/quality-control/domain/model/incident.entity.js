/**
 * Incident entity within the Quality Control bounded context.
 *
 * @class Incident
 */
export class Incident {
    constructor({ id = null, batchId = null, description = '', evidenceUrls = [], status = 'OPEN', createdAt = null, resolvedAt = null } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.description = description;
        this.evidenceUrls = evidenceUrls;
        this.status = status; // OPEN | IN_REVIEW | RESOLVED
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
    }
}
