import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const conversationsEndpointPath = import.meta.env.VITE_API_CONVERSATIONS;

export class ChatApi extends BaseApi {
    #conversationsEndpoint;

    constructor() {
        super();
        this.#conversationsEndpoint = new BaseEndpoint(this, conversationsEndpointPath);
    }

    // GET /api/v1/conversations?userId=X
    getConversations(userId = null) {
        const url = userId
            ? `${conversationsEndpointPath}?userId=${userId}`
            : conversationsEndpointPath;
        return this.http.get(url);
    }

    // POST /api/v1/conversations
    createConversation(resource) {
        return this.#conversationsEndpoint.create(resource);
    }

    // GET /api/v1/conversations/{id}/messages
    getMessages(conversationId) {
        return this.http.get(`${conversationsEndpointPath}/${conversationId}/messages`);
    }

    // POST /api/v1/conversations/{id}/messages
    sendMessage(conversationId, resource) {
        return this.http.post(`${conversationsEndpointPath}/${conversationId}/messages`, resource);
    }
}