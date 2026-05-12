/**
 * Validador del formulario de registro de productores.
 *
 * @module producerFormValidator
 */

/**
 * @param {Object} dto
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export function validateProducerForm(dto) {
    const errors = {};

    const producerType = String(dto?.producerType ?? '').trim();
    const fullName     = String(dto?.fullName ?? '').trim();
    const taxId        = String(dto?.taxId ?? '').trim();
    const legalName    = String(dto?.legalName ?? '').trim();
    const email        = String(dto?.email ?? '').trim();
    const phone        = String(dto?.phone ?? '').trim();
    const crop         = String(dto?.crop ?? '').trim();

    if (!producerType) errors.producerType = 'El tipo de productor es obligatorio.';
    if (!fullName)     errors.fullName     = 'El nombre completo es obligatorio.';

    if (!taxId) {
        errors.taxId = 'El RUC es obligatorio.';
    } else if (!/^\d{11}$/.test(taxId)) {
        errors.taxId = 'El RUC debe tener 11 dígitos.';
    }

    if (!legalName) errors.legalName = 'El nombre legal es obligatorio.';

    if (!email) {
        errors.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Ingresa un email válido.';
    }

    if (!phone) {
        errors.phone = 'El teléfono es obligatorio.';
    } else if (!/^[0-9+\-\s()]{6,}$/.test(phone)) {
        errors.phone = 'Ingresa un teléfono válido.';
    }

    if (!crop) errors.crop = 'El cultivo es obligatorio.';

    return { valid: Object.keys(errors).length === 0, errors };
}
