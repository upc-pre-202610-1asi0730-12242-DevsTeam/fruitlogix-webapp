<template>
  <div class="page-wrapper">
    <nav class="breadcrumb">
      <span>Inicio</span><span class="sep">></span>
      <span>Pedidos</span><span class="sep">></span>
      <span>Crear Pedido</span><span class="sep">></span>
      <span class="active">Seleccionar Frutas</span>
    </nav>
    <h1 class="page-title">Selección de Frutas</h1>
    <p class="page-subtitle">Elige una o más frutas y sus cantidades para incluir en el pedido.</p>

    <div class="main-layout">

      <!-- Productos -->
      <div class="products-section">
        <div class="top-controls">
          <div class="search-bar">
            <i class="pi pi-search search-icon"/>
            <input v-model="searchQuery" class="search-input" placeholder="Buscar frutas, orígenes o variedades..."/>
          </div>
          <div class="filter-tabs">
            <button v-for="cat in categories" :key="cat.value"
                    class="filter-tab" :class="{ active: activeCategory === cat.value }"
                    @click="activeCategory = cat.value">
              {{ cat.label }}
            </button>
          </div>
        </div>

        <div class="fruit-grid">
          <div v-for="fruit in filteredFruits" :key="fruit.id"
               class="fruit-card" :class="{ 'in-basket': isInBasket(fruit.id) }">
            <div class="card-img-wrap">
              <img :src="fruit.image" :alt="fruit.name" class="card-img"/>
              <span class="stock-badge">En Stock: {{ fruit.stock }} kg</span>
              <div v-if="isInBasket(fruit.id)" class="added-badge">
                <i class="pi pi-check"/> Añadido
              </div>
            </div>
            <div class="card-body">
              <div class="fruit-name">{{ fruit.name }}</div>
              <div class="fruit-price">
                S/. <strong>{{ fruit.price.toFixed(2) }}</strong>
                <span class="price-unit">/ kg</span>
              </div>
              <div class="card-actions">
                <div class="qty-stepper">
                  <button class="qty-btn" @click="decQty(fruit.id)">−</button>
                  <span class="qty-val">{{ quantities[fruit.id] || 1 }}</span>
                  <button class="qty-btn" @click="incQty(fruit.id)">+</button>
                </div>
                <button class="add-btn" @click="addToBasket(fruit)">
                  <i class="pi pi-shopping-cart"/> Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cesta -->
      <div class="basket-panel">
        <div class="basket-header">
          <div class="basket-title"><i class="pi pi-shopping-cart"/> Selección</div>
          <span class="basket-kg-badge">{{ totalKg }} kg Total</span>
        </div>

        <div v-if="basket.length === 0" class="basket-empty">
          <i class="pi pi-inbox"/>
          <span>Sin productos añadidos</span>
        </div>

        <div v-else class="basket-items">
          <div v-for="item in basket" :key="item.id" class="basket-item">
            <img :src="item.image" :alt="item.name" class="basket-img"/>
            <div class="basket-info">
              <div class="basket-name">{{ item.name }}</div>
              <div class="basket-detail">{{ item.quantity }} kg × S/. {{ item.price.toFixed(2) }}</div>
            </div>
            <div class="basket-item-price">S/. {{ (item.quantity * item.price).toFixed(2) }}</div>
            <button class="basket-remove" @click="removeFromBasket(item.id)">×</button>
          </div>
        </div>

        <div class="basket-footer">
          <div class="basket-total-row">
            <span class="basket-total-label">Total Estimado</span>
            <span class="basket-total-amount">S/. {{ totalAmount.toFixed(2) }}</span>
          </div>
          <button class="confirm-btn" :disabled="basket.length === 0" @click="confirmSelection">
            <i class="pi pi-check-circle"/> Confirmar Selección
          </button>
          <button class="back-btn" @click="$emit('back')">
            <i class="pi pi-arrow-left"/> Volver al Formulario
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  initialSelection: { type: Array, default: () => [] }
})
const emit = defineEmits(['confirm', 'back'])

const categories = [
  { label: 'Todos',      value: 'todos' },
  { label: 'Frutas',     value: 'frutas' },
  { label: 'Cítricos',   value: 'citricos' },
  { label: 'Tropicales', value: 'tropicales' },
]

const allFruits = [
  { id: 'palta',      name: 'Palta Hass',           category: 'frutas',     price: 6.10, stock: 350,  image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
  { id: 'arandano',   name: 'Arándanos',             category: 'frutas',     price: 8.20, stock: 1200, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80' },
  { id: 'fresa',      name: 'Fresas (Strawberries)', category: 'frutas',     price: 5.30, stock: 800,  image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80' },
  { id: 'uva',        name: 'Uva de Mesa Premium',   category: 'frutas',     price: 4.50, stock: 500,  image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80' },
  { id: 'mango',      name: 'Mango Kent',            category: 'tropicales', price: 4.80, stock: 600,  image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&q=80' },
  { id: 'maracuya',   name: 'Maracuyá',              category: 'tropicales', price: 3.90, stock: 400,  image: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&q=80' },
  { id: 'naranja',    name: 'Naranjas Valencia',      category: 'citricos',   price: 2.80, stock: 2000, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80' },
  { id: 'limon',      name: 'Limón Sutil',           category: 'citricos',   price: 3.10, stock: 450,  image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80' },
  { id: 'mandarina',  name: 'Mandarina',             category: 'citricos',   price: 2.50, stock: 1500, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80' },
]

const searchQuery    = ref('')
const activeCategory = ref('todos')
const quantities     = reactive({})
const basket         = ref([...props.initialSelection])

// Init quantities
allFruits.forEach(f => { quantities[f.id] = 1 })
props.initialSelection.forEach(item => { quantities[item.id] = item.quantity })

const filteredFruits = computed(() =>
    allFruits.filter(f => {
      const matchCat    = activeCategory.value === 'todos' || f.category === activeCategory.value
      const matchSearch = !searchQuery.value || f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCat && matchSearch
    })
)

const isInBasket = (id) => basket.value.some(b => b.id === id)

const incQty = (id) => { quantities[id] = (quantities[id] || 1) + 1 }
const decQty = (id) => { if ((quantities[id] || 1) > 1) quantities[id]-- }

const addToBasket = (fruit) => {
  const qty      = quantities[fruit.id] || 1
  const existing = basket.value.find(b => b.id === fruit.id)
  if (existing) { existing.quantity = qty }
  else          { basket.value.push({ ...fruit, quantity: qty }) }
}

const removeFromBasket = (id) => { basket.value = basket.value.filter(b => b.id !== id) }

const totalKg     = computed(() => basket.value.reduce((s, b) => s + b.quantity, 0))
const totalAmount = computed(() => basket.value.reduce((s, b) => s + b.quantity * b.price, 0))

const confirmSelection = () => emit('confirm', [...basket.value])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');

.page-wrapper {
  padding: 1.5rem 2rem;
  background: #e8f5e4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* Breadcrumb */
.breadcrumb {
  font-size: 0.72rem; color: #6b7a6b; margin-bottom: 0.6rem;
  display: flex; gap: 0.3rem; align-items: center;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.breadcrumb .sep   { color: #a3b8a0; }
.breadcrumb .active{ color: #1a3020; font-weight: 700; }

.page-title    { font-size: 1.8rem; font-weight: 800; color: #1a3020; margin: 0 0 0.3rem; letter-spacing: -0.02em; }
.page-subtitle { font-size: 0.87rem; color: #4a6b4a; margin: 0 0 1.5rem; }

/* Layout */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.25rem;
  align-items: start;
}

/* Top controls */
.top-controls {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  border: 1.5px solid #c8dcc8;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  max-width: 420px;
}
.search-icon  { color: #6b8a6b; font-size: 0.9rem; }
.search-input { border: none; outline: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #1a3020; width: 100%; }
.search-input::placeholder { color: #a3b8a0; }

.filter-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filter-tab  {
  padding: 0.45rem 1.1rem; border-radius: 99px;
  border: 1.5px solid #a3b8a0; background: transparent;
  font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
  color: #4a6b4a; cursor: pointer; transition: all 0.15s;
}
.filter-tab:hover  { border-color: #4a6b4a; }
.filter-tab.active { background: #1a3020; border-color: #1a3020; color: #c8e645; }

/* Fruit grid */
.fruit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.fruit-card {
  background: #1e2d22;
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid transparent;
  transition: border-color 0.2s, transform 0.15s;
}
.fruit-card:hover     { border-color: #3d5c42; transform: translateY(-2px); }
.fruit-card.in-basket { border-color: #c8e645; }

.card-img-wrap { position: relative; height: 160px; overflow: hidden; }
.card-img      { width: 100%; height: 100%; object-fit: cover; display: block; }

.stock-badge {
  position: absolute; top: 10px; left: 10px;
  background: rgba(30,45,34,0.85); color: #c8e645;
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 3px 8px; border-radius: 99px;
  border: 1px solid #c8e645; backdrop-filter: blur(4px);
}

.added-badge {
  position: absolute; top: 10px; right: 10px;
  background: rgba(200,230,69,0.9); color: #1a3020;
  font-size: 0.65rem; font-weight: 800;
  padding: 3px 8px; border-radius: 99px;
  display: flex; align-items: center; gap: 0.3rem;
}

.card-body   { padding: 0.9rem 1rem 1rem; }
.fruit-name  { font-size: 0.9rem; font-weight: 700; color: #e0ead0; margin-bottom: 0.3rem; }
.fruit-price { font-size: 1rem; font-weight: 500; color: #c8e645; margin-bottom: 0.75rem; }
.fruit-price strong { font-weight: 800; }
.price-unit  { font-size: 0.75rem; color: #6b8a6b; font-weight: 400; }

.card-actions { display: flex; align-items: center; gap: 0.5rem; }

.qty-stepper {
  display: flex; align-items: center; gap: 0.4rem;
  background: #2a3d2e; border-radius: 8px; padding: 0.3rem 0.5rem;
  border: 1px solid #3d5c42;
}
.qty-btn {
  width: 22px; height: 22px; border: none; background: transparent;
  color: #8fba8f; font-size: 1.1rem; cursor: pointer; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.1s;
}
.qty-btn:hover { background: #3d5c42; color: #c8e645; }
.qty-val       { font-size: 0.85rem; font-weight: 700; color: #e0ead0; min-width: 24px; text-align: center; }

.add-btn {
  flex: 1; padding: 0.45rem 0.6rem;
  background: #c8e645; border: none; border-radius: 8px;
  color: #1a3020; font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  transition: background 0.15s, transform 0.1s;
}
.add-btn:hover  { background: #d4f06e; transform: translateY(-1px); }
.add-btn:active { transform: translateY(0); }

/* Basket panel */
.basket-panel {
  background: #1e2d22;
  border-radius: 16px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: sticky;
  top: 1.5rem;
}

.basket-header {
  display: flex; align-items: center; justify-content: space-between;
}
.basket-title {
  font-size: 1rem; font-weight: 800; color: #e0ead0;
  display: flex; align-items: center; gap: 0.5rem;
}
.basket-title i { color: #c8e645; }
.basket-kg-badge {
  background: #c8e645; color: #1a3020;
  font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em;
  padding: 3px 10px; border-radius: 99px;
}

.basket-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; padding: 1.5rem 0;
  color: #3d5c42; font-size: 0.85rem;
}
.basket-empty i { font-size: 1.8rem; }

.basket-items { display: flex; flex-direction: column; gap: 0.6rem; max-height: 320px; overflow-y: auto; }
.basket-items::-webkit-scrollbar      { width: 4px; }
.basket-items::-webkit-scrollbar-track{ background: #2a3d2e; border-radius: 2px; }
.basket-items::-webkit-scrollbar-thumb{ background: #3d5c42; border-radius: 2px; }

.basket-item {
  display: flex; align-items: center; gap: 0.6rem;
  background: #2a3d2e; border-radius: 10px; padding: 0.6rem;
}
.basket-img      { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.basket-info     { flex: 1; min-width: 0; }
.basket-name     { font-size: 0.78rem; font-weight: 700; color: #e0ead0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.basket-detail   { font-size: 0.68rem; color: #6b8a6b; }
.basket-item-price { font-size: 0.78rem; font-weight: 700; color: #c8e645; white-space: nowrap; }
.basket-remove   {
  width: 22px; height: 22px; border: none; border-radius: 50%;
  background: #3d5c42; color: #8fba8f; font-size: 1rem; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.1s, color 0.1s;
}
.basket-remove:hover { background: #f87171; color: #fff; }

/* Footer */
.basket-footer { display: flex; flex-direction: column; gap: 0.65rem; }
.basket-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 0.5rem; border-top: 1px solid #2a3d2e;
}
.basket-total-label  { font-size: 0.82rem; color: #c8dcc8; }
.basket-total-amount { font-size: 1.2rem; font-weight: 800; color: #d4f7b4; }

.confirm-btn {
  width: 100%; padding: 0.8rem;
  background: #c8e645; border: none; border-radius: 12px;
  color: #1a3020; font-family: 'DM Sans', sans-serif;
  font-size: 0.93rem; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  transition: background 0.15s, transform 0.1s;
}
.confirm-btn:hover:not(:disabled)  { background: #d4f06e; transform: translateY(-1px); }
.confirm-btn:active:not(:disabled) { transform: translateY(0); }
.confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.back-btn {
  width: 100%; padding: 0.7rem;
  background: transparent; border: 1.5px solid #3d5c42; border-radius: 12px;
  color: #8fba8f; font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  transition: background 0.15s, color 0.15s;
}
.back-btn:hover { background: #2a3d2e; color: #e0ead0; }

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
  .basket-panel { position: static; }
}
@media (max-width: 600px) {
  .page-wrapper { padding: 1rem; }
  .fruit-grid   { grid-template-columns: 1fr 1fr; }
}
</style>
