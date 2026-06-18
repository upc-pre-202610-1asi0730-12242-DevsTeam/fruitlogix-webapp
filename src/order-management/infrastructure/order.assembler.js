import { Order } from '../domain/model/order.entity.js';

/**
 * Maps Order resources from/to API payloads.
 * Aísla por completo los cambios del Backend para proteger la UI.
 */
export class OrderAssembler {
    /**
     * VIAJE DE REGRESO: El Backend (Render) nos da datos en su idioma,
     * y nosotros los traducimos al formato exacto que tus vistas JS esperan.
     */
    static toEntity(json) {
        if (!json) return new Order();

        // 1. Solución para el Cliente "??": Creamos un nombre ficticio basado en su ID real
        json.clientName = json.commercialClientId ? `Cliente #${json.commercialClientId}` : 'Sin Cliente';

        // Si el backend devuelve 'items' (C#), lo traducimos a 'selectedFruits' para tu UI
        if (json.items && (!json.selectedFruits || json.selectedFruits.length === 0)) {
            json.selectedFruits = json.items.map(item => ({
                id: item.productId,
                name: item.productName,
                quantity: item.quantityKg,
                pricePerKg: item.unitPrice, // 👈 Vue buscaba 'pricePerKg', no 'unitPrice'
                subtotal: item.unitPrice ? (item.quantityKg * item.unitPrice) : 0
            }));

            // Llenamos variables viejas por retrocompatibilidad con tus tablas
            json.fruitType = json.items[0]?.productName || 'Varios';
            json.totalVolume = json.items.reduce((sum, i) => sum + i.quantityKg, 0);

            // 👈 Vue (Order-list) busca 'quantity' en la raíz para mostrar el total de KG
            json.quantity = json.totalVolume;
        }

        return new Order(json);
    }

    static toEntities(list) {
        return (list ?? []).map(json => OrderAssembler.toEntity(json));
    }

    /**
     * VIAJE DE IDA: Toma tu entidad JS de la pantalla y la empaqueta
     * en el JSON exacto que el Backend de C# necesita para actualizar.
     */
    static toApi(entity) {
        return {
            commercialClientId: Number(entity.commercialClientId || 1),
            deliveryDueDate: entity.deliveryDueDate,
            deliveryAddress: entity.deliveryAddress || "Dirección no especificada",
            totalAmount: Number(entity.totalAmount || 0),
            notes: entity.instructions || "",

            // 👈 ¡AQUÍ ESTÁ LA MAGIA! Ahora sí enviamos el Productor y el Estado a C#
            producerId: entity.producerId ? Number(entity.producerId) : null,
            status: entity.status || "Pending",

            // Traducimos tus frutas seleccionadas a los ítems detallados de C#
            items: (entity.selectedFruits ?? []).map(fruit => ({
                productId: Number(fruit.id || 1),
                productName: fruit.name || "Fruta",
                quantityKg: Number(fruit.quantity || 0),
                unitPrice: Number(fruit.pricePerKg || fruit.unitPrice || 5.0),
                subtotal: Number(fruit.quantity || 0) * Number(fruit.pricePerKg || fruit.unitPrice || 5.0)
            }))
        };
    }
}