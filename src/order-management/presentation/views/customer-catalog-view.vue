<template>
  <div class="catalog-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('catalog.title', 'Catálogo') }}</h1>
        <p class="page-sub">{{ t('catalog.subtitle', 'Productos disponibles') }}</p>
      </div>
      <div class="cart-summary" v-if="cartStore.itemCount > 0">
        <div class="cart-info">
          <span class="cart-icon"><i class="pi pi-shopping-cart"></i></span>
          <span class="cart-count">{{ cartStore.itemCount }} {{ cartStore.itemCount !== 1 ? t('catalog.products_pl', 'productos') : t('catalog.products', 'producto') }}</span>
          <span class="cart-total">S/ {{ cartStore.total.toFixed(2) }}</span>
        </div>
        <button class="btn-primary" @click="continueToOrder">{{ t('catalog.continue', 'Continuar') }}</button>
      </div>
    </div>
    
    <div class="filter-chips">
      <button v-for="cat in categories" :key="cat" :class="['filter-chip', { active: selectedCategory === cat }]" @click="selectedCategory = cat">{{ cat }}</button>
    </div>
    
    <div class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <span class="product-emoji"><i :class="['pi', product.image]"></i></span>
          <span v-if="product.seasonal" class="seasonal-badge">🌿 Temporada</span>
        </div>
        <div class="product-info">
          <div class="product-category">{{ product.category }}</div>
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-footer">
            <div class="product-price">
              <span class="price-amount">S/ {{ product.price.toFixed(2) }}</span>
              <span class="price-unit">/ {{ product.unit }}</span>
            </div>
            <div class="product-stock">Stock: {{ product.stock }}</div>
          </div>
          <div class="cart-control" v-if="getCartQuantity(product.id) > 0">
            <button class="qty-btn" @click="decreaseQty(product)">−</button>
            <span class="qty-value">{{ getCartQuantity(product.id) }}</span>
            <button class="qty-btn" @click="increaseQty(product)">+</button>
          </div>
          <button v-else class="btn-add" @click="addProduct(product)">{{ t('catalog.add', 'Agregar al pedido') }}</button>
        </div>
      </div>
    </div>

    <div class="cart-bar" v-if="cartStore.itemCount > 0">
      <div class="cart-bar-inner">
        <div class="cart-bar-info">
          <span class="cart-bar-icon"><i class="pi pi-shopping-cart"></i></span>
          <div>
            <div class="cart-bar-count">{{ cartStore.itemCount }} {{ cartStore.itemCount !== 1 ? t('catalog.products_pl', 'productos') : t('catalog.products', 'producto') }}</div>
            <div class="cart-bar-items">{{ cartItemNames }}</div>
          </div>
        </div>
        <div class="cart-bar-right">
          <span class="cart-bar-total">S/ {{ cartStore.total.toFixed(2) }}</span>
          <button class="btn-primary" @click="continueToOrder">{{ t('catalog.continue', 'Continuar') }}</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showOrderModal" @click.self="showOrderModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ t('catalog.confirm', 'Confirmar Pedido') }}</h2>
          <button class="modal-close" @click="showOrderModal = false"><i class="pi pi-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="order-items">
            <div v-for="item in cartStore.items" :key="item.product.id" class="order-item">
              <span class="order-item-emoji">{{ item.product.image }}</span>
              <div class="order-item-info">
                <span class="order-item-name">{{ item.product.name }}</span>
                <span class="order-item-qty">{{ item.quantity }} {{ item.product.unit }}</span>
              </div>
              <span class="order-item-price">S/ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-divider"></div>
          <div class="form-group">
            <label class="form-label">{{ t('catalog.address', 'Dirección de Entrega') }}</label>
            <input v-model="deliveryAddress" class="form-input" placeholder="Ej: Av. La Marina 1200, San Miguel" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('catalog.date', 'Fecha de Entrega Deseada') }}</label>
            <input v-model="deliveryDate" type="date" class="form-input" :min="minDate" />
          </div>
          <div class="order-total-row">
            <span>{{ t('catalog.total', 'Total') }}</span>
            <span class="order-total-amount">S/ {{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" @click="showOrderModal = false">{{ t('catalog.cancel', 'Cancelar') }}</button>
          <button class="btn-primary" @click="confirmOrder" :disabled="!deliveryAddress || !deliveryDate">{{ t('catalog.pay', 'Pagar y Confirmar') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../application/cart.store';
import { useI18n } from 'vue-i18n';
import { useOrderManagementStore } from '../../application/order-management.store.js';

const { t } = useI18n();
const cartStore = useCartStore();
const router = useRouter();
const showOrderModal = ref(false);
const deliveryAddress = ref('');
const deliveryDate = ref('');
const orderStore = useOrderManagementStore();

const minDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
});

const products = ref([
  { id: 1, name: 'Mango Kent', description: 'Mango dulce de Piura, sin fibra, jugoso', category: 'Frutas', price: 4.50, stock: 200, unit: 'kg', image: 'pi-star', seasonal: true },
  { id: 2, name: 'Arándanos', description: 'Arándanos frescos de La Libertad, antioxidantes', category: 'Frutas', price: 18.00, stock: 80, unit: 'kg', image: 'pi-star', seasonal: true },
  { id: 3, name: 'Palta Hass', description: 'Palta Hass lista para consumo, textura cremosa', category: 'Frutas', price: 7.50, stock: 150, unit: 'kg', image: 'pi-star', seasonal: false },
  { id: 4, name: 'Espárragos', description: 'Espárragos verdes frescos de Ica', category: 'Verduras', price: 6.00, stock: 120, unit: 'kg', image: 'pi-star', seasonal: true },
  { id: 5, name: 'Uva Red Globe', description: 'Uva roja de mesa, grano grande y dulce', category: 'Frutas', price: 8.00, stock: 90, unit: 'kg', image: 'pi-star', seasonal: false },
  { id: 6, name: 'Pimiento Rojo', description: 'Pimiento rojo fresco, ideal para exportación', category: 'Verduras', price: 5.50, stock: 200, unit: 'kg', image: 'pi-star', seasonal: false },
  { id: 7, name: 'Mandarina', description: 'Mandarina clementina peruana, fácil de pelar', category: 'Frutas', price: 3.50, stock: 300, unit: 'kg', image: 'pi-star', seasonal: true },
  { id: 8, name: 'Brócoli', description: 'Brócoli orgánico de Huancayo, fresco del día', category: 'Verduras', price: 4.00, stock: 100, unit: 'kg', image: 'pi-star', seasonal: false },
]);

const categories = computed(() => ['Todos', ...new Set(products.value.map(p => p.category))]);
const selectedCategory = ref('Todos');
const filteredProducts = computed(() => selectedCategory.value === 'Todos' ? products.value : products.value.filter(p => p.category === selectedCategory.value));
const cartItemNames = computed(() => cartStore.items.slice(0, 3).map(i => i.product.name).join(', ') + (cartStore.items.length > 3 ? ` y ${cartStore.items.length - 3} más` : ''));

function getCartQuantity(productId: number) { return cartStore.items.find(i => i.product.id === productId)?.quantity || 0; }
function addProduct(product: any) { cartStore.addToCart(product, 1); }
function increaseQty(product: any) { cartStore.addToCart(product, 1); }
function decreaseQty(product: any) {
  const qty = getCartQuantity(product.id);
  if (qty <= 1) cartStore.removeFromCart(product.id);
  else cartStore.updateQuantity(product.id, qty - 1);
}
function continueToOrder() { showOrderModal.value = true; }
function confirmOrder() {
  if (!deliveryAddress.value || !deliveryDate.value) return;

  // 1. Lógica local del carrito
  const order = cartStore.placeOrder(deliveryAddress.value, deliveryDate.value);

  // 2. Conexión de simulación global
  orderStore.simulateCustomerCheckout({
    customerName: 'Distribuidora Lima Sur', 
    itemsSummary: cartItemNames.value,      
    total: cartStore.total,                 
    date: deliveryDate.value                
  });

  // 3. Limpieza y redirección
  showOrderModal.value = false;
  deliveryAddress.value = '';
  deliveryDate.value = '';
  router.push({ name: 'customer-payment', params: { orderId: order.id } });
}
</script>

<style scoped>
.catalog-page { padding: 32px; padding-bottom: 120px; min-height: 100vh; background: #E1EBE1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 20px; flex-wrap: wrap; }
.page-title {   font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0;
  letter-spacing: -0.02em;}
.page-sub { color: #4a6b4a; font-size: 14px; margin: 0; }
.cart-summary { display: flex; align-items: center; gap: 16px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 10px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.cart-info { display: flex; align-items: center; gap: 10px; }
.cart-icon { font-size: 20px; }
.cart-count { font-size: 13px; color: #666; }
.cart-total { font-size: 16px; font-weight: 700; color: #1a3020; }

.filter-chips { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-chip { padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: #9ab39d; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
.filter-chip.active { background: #D4E952; color: #121212; border-color: #D4E952; }
.filter-chip:hover:not(.active) { background: rgba(255, 255, 255, 0.1); }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.product-card { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; overflow: hidden; transition: all 0.2s; }
.product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); border-color: rgba(212, 233, 82, 0.5); }
.product-image { background: rgba(0, 0, 0, 0.2); height: 120px; display: flex; align-items: center; justify-content: center; position: relative; }
.product-emoji { font-size: 56px; }
.seasonal-badge { position: absolute; top: 8px; right: 8px; background: #D4E952; color: #121212; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
.product-info { padding: 16px; display: flex; flex-direction: column; }
.product-category { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #D4E952; text-transform: uppercase; margin-bottom: 4px; }
.product-name { font-size: 16px; font-weight: 700; color: #FFFFFF; margin: 0 0 6px 0; }
.product-desc { font-size: 12px; color: #9ab39d; line-height: 1.5; margin: 0 0 12px 0; min-height: 36px; }
.product-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
.product-price { display: flex; align-items: baseline; gap: 2px; }
.price-amount { font-size: 18px; font-weight: 800; color: #FFFFFF; }
.price-unit { font-size: 11px; color: #9ab39d; }
.product-stock { font-size: 11px; color: #9ab39d; }
.btn-add { width: 100%; background: transparent; border: 1px solid rgba(212, 233, 82, 0.5); color: #D4E952; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
.btn-add:hover { background: rgba(212, 233, 82, 0.1); border-color: #D4E952; }
.cart-control { display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 4px; }
.qty-btn { background: #D4E952; color: #121212; border: none; width: 30px; height: 30px; border-radius: 6px; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { background: #e2f57a; }
.qty-value { font-size: 16px; font-weight: 700; color: #FFFFFF; flex: 1; text-align: center; }

.cart-bar { position: fixed; bottom: 0; left: 260px; right: 0; background: #1e2d22; border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 16px 32px; z-index: 50; box-shadow: 0 -4px 20px rgba(0,0,0,0.3); }
.cart-bar-inner { display: flex; align-items: center; justify-content: space-between; }
.cart-bar-info { display: flex; align-items: center; gap: 14px; }
.cart-bar-icon { font-size: 24px; }
.cart-bar-count { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.cart-bar-items { font-size: 12px; color: #9ab39d; margin-top: 2px; }
.cart-bar-right { display: flex; align-items: center; gap: 20px; }
.cart-bar-total { font-size: 22px; font-weight: 800; color: #FFFFFF; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.modal { background: #1e2d22; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 48px rgba(0,0,0,0.4); }
.modal-header { padding: 24px 24px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.modal-header h2 { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0; }
.modal-close { background: rgba(255, 255, 255, 0.05); border: none; color: #FFFFFF; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { background: rgba(255, 255, 255, 0.1); }
.modal-body { padding: 20px 24px; }
.order-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 200px; overflow-y: auto; }
.order-item { display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 10px 14px; border: 1px solid rgba(255, 255, 255, 0.05); }
.order-item-emoji { font-size: 22px; }
.order-item-info { flex: 1; display: flex; flex-direction: column; }
.order-item-name { font-size: 14px; font-weight: 700; color: #FFFFFF; }
.order-item-qty { font-size: 12px; color: #9ab39d; }
.order-item-price { font-size: 14px; font-weight: 800; color: #FFFFFF; }
.order-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 0 0 20px 0; }
.form-group { margin-bottom: 16px; display: flex; flex-direction: column; }
.form-label { font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px; }
.form-input { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; padding: 12px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: all 0.2s; }
.form-input:focus { outline: none; border-color: #D4E952; box-shadow: 0 0 0 3px rgba(212, 233, 82, 0.2); }
.order-total-row { display: flex; justify-content: space-between; align-items: center; background: rgba(212, 233, 82, 0.05); border: 1px solid rgba(212, 233, 82, 0.3); border-radius: 8px; padding: 16px; margin-top: 8px; font-weight: 700; color: #FFFFFF; }
.order-total-amount { font-size: 20px; font-weight: 800; color: #FFFFFF; }
.modal-footer { padding: 16px 24px 24px; display: flex; gap: 12px; justify-content: flex-end; background: #1e2d22; border-top: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0 0 16px 16px; }

.btn-primary { background: #D4E952; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn-primary:hover:not(:disabled) { background: #e2f57a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-ghost { background: transparent; color: #9ab39d; border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.btn-ghost:hover { border-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; background: rgba(255, 255, 255, 0.05); }

@media (max-width: 768px) {
  .cart-bar { left: 0; padding: 16px; }
  .cart-bar-info { display: none; }
  .cart-bar-inner { justify-content: center; }
}
</style>
