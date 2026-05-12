/**
 * Validador del formulario de registro de pedidos.
 * Pertenece a la capa de aplicación: valida DTOs antes de ejecutar el caso de uso.
 *
 * @module orderFormValidator
 */

/**
 * Valida un DTO de creación de pedido.
 *
 * @param {Object} dto                       - Datos del formulario.
 * @param {Array}  [dto.selectedFruits=[]]   - Frutas elegidas.
 * @param {?Date|string} [dto.deliveryDueDate=null] - Fecha de entrega.
 * @param {string} [dto.commercialClientId=''] - ID o nombre del cliente comercial.
 * @param {?string|number} [dto.producerId=null]   - Productor asignado (opcional en esta fase).
 * @param {Object} [options]
 * @param {boolean} [options.requireProducer=false] - Si se exige productor en el momento del registro.
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export function validateOrderForm(dto, { requireProducer = false } = {}) {
    const errors = {};

    const selectedFruits     = dto?.selectedFruits ?? [];
    const deliveryDueDate    = dto?.deliveryDueDate ?? null;
    const commercialClientId = String(dto?.commercialClientId ?? '');
    const producerId         = dto?.producerId ?? null;

    if (!Array.isArray(selectedFruits) || selectedFruits.length === 0) {
        errors.selectedFruits = 'Debes seleccionar al menos una fruta.';
    } else {
        const invalidItem = selectedFruits.find(
            f => !f || typeof f.quantity !== 'number' || f.quantity <= 0
        );
        if (invalidItem) {
            errors.selectedFruits = 'Cada fruta debe tener una cantidad mayor a 0.';
        }
    }

    if (!deliveryDueDate) {
        errors.deliveryDueDate = 'La fecha de entrega es obligatoria.';
    } else if (isBeforeToday(deliveryDueDate)) {
        errors.deliveryDueDate = 'La fecha de entrega no puede ser anterior a hoy.';
    }

    if (!commercialClientId.trim()) {
        errors.commercialClientId = 'El cliente es obligatorio.';
    } else if (commercialClientId.trim().length < 3) {
        errors.commercialClientId = 'El nombre del cliente debe tener al menos 3 caracteres.';
    }

    if (requireProducer && !producerId) {
        errors.producerId = 'Selecciona un productor.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Valida un item individual del pedido (fruta + cantidad + precio).
 *
 * @param {Object} item
 * @returns {Record<string,string>} Errores del item.
 */
export function validateOrderItem(item) {
    const errors = {};
    if (!item?.name && !item?.fruitType) errors.name = 'El tipo de fruta es requerido.';
    if (typeof item?.quantity !== 'number' || item.quantity <= 0) {
        errors.quantity = 'La cantidad debe ser mayor a 0.';
    }
    if (item?.price !== undefined && (typeof item.price !== 'number' || item.price <= 0)) {
        errors.price = 'El precio debe ser mayor a 0.';
    }
    return errors;
}

/**
 * @param {Date|string} date
 * @returns {boolean}
 */
function isBeforeToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
}
