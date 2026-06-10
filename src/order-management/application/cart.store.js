import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    orders: [
      {
        id: 'ORD-2025-089',
        createdAt: new Date().toISOString(),
        status: 'EN_RUTA',
        paymentStatus: 'PAGADO',
        total: 1450.50,
        items: [
          { product: { id: 1, name: 'Mango Kent', price: 4.50, image: '🥭', unit: 'kg' }, quantity: 100 },
          { product: { id: 3, name: 'Palta Hass', price: 7.50, image: '🥑', unit: 'kg' }, quantity: 100 }
        ],
        trackingSteps: [
          { id: 1, label: 'Pedido Confirmado', time: '08:00', status: 'done', actor: 'distributor', description: 'FruitLogix ha confirmado el pedido' },
          { id: 2, label: 'Cosecha y Preparación', time: '09:30', status: 'done', actor: 'producer', description: 'Productores preparando los lotes' },
          { id: 3, label: 'Control de Calidad', time: '11:00', status: 'done', actor: 'distributor', description: 'Inspección de calidad FruitLogix aprobada' },
          { id: 4, label: 'Despacho', time: '14:00', status: 'done', actor: 'distributor', description: 'Cargado en transporte asignado' },
          { id: 5, label: 'En Ruta', time: '', status: 'active', actor: 'distributor', description: 'El conductor está en camino a tu ubicación' }
        ]
      },
      {
        id: 'ORD-2025-087',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'ENTREGADO',
        paymentStatus: 'PAGADO',
        total: 850.00,
        items: [
          { product: { id: 2, name: 'Arándanos', price: 18.00, image: '🫐', unit: 'kg' }, quantity: 20 },
          { product: { id: 4, name: 'Espárragos', price: 6.00, image: '🌿', unit: 'kg' }, quantity: 50 },
          { product: { id: 9, name: 'Fresa', price: 9.00, image: '🍓', unit: 'kg' }, quantity: 20 }
        ],
        trackingSteps: [
          { id: 1, label: 'Pedido Confirmado', time: 'Ayer 08:00', status: 'done', actor: 'distributor', description: 'FruitLogix ha confirmado el pedido' },
          { id: 2, label: 'Cosecha y Preparación', time: 'Ayer 09:30', status: 'done', actor: 'producer', description: 'Productores preparando los lotes' },
          { id: 3, label: 'Control de Calidad', time: 'Ayer 11:00', status: 'done', actor: 'distributor', description: 'Inspección de calidad FruitLogix aprobada' },
          { id: 4, label: 'Despacho', time: 'Ayer 14:00', status: 'done', actor: 'distributor', description: 'Cargado en transporte asignado' },
          { id: 5, label: 'Entregado', time: 'Ayer 16:30', status: 'done', actor: 'distributor', description: 'Pedido recibido conforme' }
        ]
      },
      {
        id: 'ORD-2025-085',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'CONFIRMADO',
        paymentStatus: 'PENDIENTE',
        total: 120.00,
        items: [
          { product: { id: 5, name: 'Uva Red Globe', price: 8.00, image: '🍇', unit: 'kg' }, quantity: 15 }
        ],
        trackingSteps: [
          { id: 1, label: 'Pedido Confirmado', time: 'Hace 2 días 10:00', status: 'done', actor: 'distributor', description: 'FruitLogix ha confirmado el pedido' },
          { id: 2, label: 'Cosecha y Preparación', time: '', status: 'pending', actor: 'producer', description: 'Productores preparando los lotes' },
          { id: 3, label: 'Control de Calidad', time: '', status: 'pending', actor: 'distributor', description: 'Inspección de calidad FruitLogix' },
          { id: 4, label: 'Despacho', time: '', status: 'pending', actor: 'distributor', description: 'Cargado en transporte asignado' },
          { id: 5, label: 'En Ruta', time: '', status: 'pending', actor: 'distributor', description: 'El conductor está en camino' }
        ]
      }
    ]
  }),
  getters: {
    itemCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    total: (state) => state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  },
  actions: {
    addToCart(product, quantity = 1) {
      const existing = this.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
    },
    removeFromCart(productId) {
      this.items = this.items.filter(i => i.product.id !== productId);
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.product.id === productId);
      if (item) item.quantity = quantity;
    },
    clearCart() {
      this.items = [];
    },
    placeOrder(address, date) {
      const newOrder = {
        id: `ORD-2025-${Math.floor(Math.random() * 900 + 100)}`,
        createdAt: new Date().toISOString(),
        status: 'CONFIRMADO',
        paymentStatus: 'PENDIENTE',
        total: this.total,
        address,
        deliveryDate: date,
        items: [...this.items],
        trackingSteps: [
          { id: 1, label: 'Pedido Confirmado', time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }), status: 'done', actor: 'distributor', description: 'FruitLogix ha confirmado el pedido' },
          { id: 2, label: 'Cosecha y Preparación', time: '', status: 'pending', actor: 'producer', description: 'Productores preparando los lotes' },
          { id: 3, label: 'Control de Calidad', time: '', status: 'pending', actor: 'distributor', description: 'Inspección de calidad FruitLogix' },
          { id: 4, label: 'Despacho', time: '', status: 'pending', actor: 'distributor', description: 'Cargado en transporte asignado' },
          { id: 5, label: 'En Ruta', time: '', status: 'pending', actor: 'distributor', description: 'El conductor está en camino' }
        ]
      };
      this.orders.unshift(newOrder);
      this.clearCart();
      return newOrder;
    },
    payOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.paymentStatus = 'PAGADO';
        const prepStep = order.trackingSteps.find(s => s.id === 2);
        if (prepStep && prepStep.status === 'pending') {
          prepStep.status = 'active';
        }
      }
    }
  }
});
