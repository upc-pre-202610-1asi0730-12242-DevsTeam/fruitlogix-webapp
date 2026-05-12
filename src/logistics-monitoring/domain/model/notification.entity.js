/**
 * Notification Type Enumeration.
 * 
 * @enum {string}
 */
export const NotificationType = {
    STATUS_CHANGE: 'STATUS_CHANGE',
    QUALITY_ALERT: 'QUALITY_ALERT',
    DELIVERY_DELAY: 'DELIVERY_DELAY',
    ORDER_CONFIRMATION: 'ORDER_CONFIRMATION'
};

/**
 * Notification Domain Entity.
 * 
 * @class Notification
 */
export class Notification {
    /**
     * @param {string} notificationId 
     * @param {string} userId 
     * @param {string} message 
     * @param {NotificationType} type 
     * @param {boolean} isRead 
     */
    constructor(notificationId, userId, message, type, isRead = false) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
    }

    /**
     * Dispatches the notification.
     */
    send() {
        console.log(`Notification sent to User ${this.userId}: ${this.message}`);
    }

    /**
     * Marks the notification as read.
     */
    markAsRead() {
        this.isRead = true;
    }
}
