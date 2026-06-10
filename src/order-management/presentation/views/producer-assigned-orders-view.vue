<template>
  <div class="orders-container">
    <div class="orders-master">
      <div class="tabs">
        <div class="tab active">
          <span>Todos</span>
          <span class="count">(3)</span>
        </div>
        <div class="tab">
          <span>Prep.<br>Pendiente</span>
          <span class="count">(1)</span>
        </div>
        <div class="tab">
          <span>En<br>Preparación</span>
          <span class="count">(1)</span>
        </div>
        <div class="tab">
          <span>Despacho<br>Listo</span>
          <span class="count">(1)</span>
        </div>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input type="text" placeholder="Buscar ID, distribuidor..." />
        </div>
        <button class="filter-btn">
          <i class="pi pi-sliders-h"></i>
        </button>
      </div>

      <div class="order-list">
        <div v-for="card in visualOrders" 
             :key="card.id" 
             :class="['order-card', { active: selectedOrderId === card.id }]"
             @click="selectedOrderId = card.id">
          
          <div class="card-header">
            <span class="order-id">#{{ card.id }}</span>
            <span :class="['badge', getStoreStatus(card.id).clazz]">{{ getStoreStatus(card.id).text }}</span>
          </div>
          <h3 class="client-name">{{ card.client }}</h3>
          <p class="products-desc">{{ card.productsDesc }}</p>
          <div class="date-info">
            <i class="pi pi-calendar"></i> {{ card.date }}
          </div>

          <div class="mini-stepper" v-if="card.id === 'ORD-2024-003'">
            <div class="step completed">
              <div class="dot"></div>
              <span>Asignado</span>
            </div>
            <div class="step line"></div>
            <div class="step pending">
              <div class="dot"></div>
              <span>En Prep</span>
            </div>
            <div class="step line"></div>
            <div class="step pending">
              <div class="dot"></div>
              <span>Listo</span>
            </div>
            <div class="step line"></div>
            <div class="step pending">
              <div class="dot"></div>
              <span>Enviado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="order-detail" v-if="selectedOrder">
      <div class="detail-scroll">
        <div class="detail-header">
          <div>
            <h2>Detalle del Pedido #{{ selectedOrder.id }}</h2>
            <span :class="['badge', selectedOrder.badgeClass]">{{ selectedOrder.status }}</span>
          </div>
          <div class="header-actions-group">
            <button class="menu-btn" @click="goToFullDetail" title="Ver pantalla completa">
              <i class="pi pi-external-link"></i>
            </button>
            <button class="menu-btn">
              <i class="pi pi-ellipsis-v"></i>
            </button>
          </div>
        </div>

        <div class="info-grid-card">
          <div class="info-item">
            <span class="label">DISTRIBUIDOR</span>
            <span class="value">{{ selectedOrder.client }}</span>
          </div>
          <div class="info-item">
            <span class="label">FECHA ENTREGA</span>
            <span class="value">{{ selectedOrder.date }}</span>
          </div>
          <div class="info-item">
            <span class="label">PRODUCTOS</span>
            <span class="value">{{ selectedOrder.productsList }}</span>
          </div>
          <div class="info-item">
            <span class="label">CANTIDAD TOTAL</span>
            <span class="value">{{ selectedOrder.totalQty }}</span>
          </div>
        </div>

        <div class="detail-columns">
          <div class="detail-col">
            <section class="section">
              <h3 class="section-title">Lotes Asignados</h3>
              <div class="lotes-grid">
                <div v-for="lote in selectedOrder.lotes" :key="lote.id" class="lote-card">
                  <div class="lote-header">
                    <span class="lote-id">{{ lote.id }}</span>
                    <span :class="['badge', lote.badge]">{{ lote.calibre }}</span>
                  </div>
                  <p class="lote-product">
                    <i class="pi pi-tag" style="font-size: 0.8rem; margin-right: 4px; color: #D4E952;"></i>
                    {{ lote.product }}
                  </p>
                  <p class="lote-qty">{{ lote.qty }}</p>
                  <div class="lote-footer">
                    <span :class="['status', lote.statusClass]">
                      <i :class="lote.statusClass === 'status-ok' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
                      {{ lote.status }}
                    </span>
                    <a href="#" class="link">Ver lote <i class="pi pi-arrow-right" style="font-size: 0.7rem;"></i></a>
                  </div>
                </div>
              </div>
            </section>

            <section class="section">
              <h3 class="section-title">Historial de Estados</h3>
              <div class="timeline">
                <div class="timeline-item completed">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="title">Pedido recibido</p>
                    <p class="time">1 jun 10:00 <i class="pi pi-check" style="font-size: 0.7rem;"></i></p>
                  </div>
                </div>
                <div class="timeline-item completed">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="title">Asignado al productor</p>
                    <p class="time">1 jun 11:30 <i class="pi pi-check" style="font-size: 0.7rem;"></i></p>
                  </div>
                </div>
                <div :class="['timeline-item', selectedOrder.rawStatus !== 'PENDING' && selectedOrder.rawStatus !== 'ASSIGNED' && selectedOrder.rawStatus !== 'Pendiente' ? 'completed' : 'pending']">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="title">En preparación</p>
                    <p class="time" v-if="selectedOrder.rawStatus !== 'PENDING' && selectedOrder.rawStatus !== 'ASSIGNED' && selectedOrder.rawStatus !== 'Pendiente'">En progreso</p>
                  </div>
                </div>
                <div :class="['timeline-item', selectedOrder.rawStatus === 'READY' || selectedOrder.rawStatus === 'Listo Despacho' ? 'completed' : 'pending']">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="title">Listo para despacho</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="detail-col">
            <section class="section chat-section">
              <h3 class="section-title chat-title" style="display: flex; justify-content: space-between; align-items: center;">
                  <span><i class="pi pi-comments" style="margin-right: 6px;"></i> Comunicación Interna</span>
                  <button @click="goToFullChat" class="menu-btn" style="width: 28px; height: 28px; background: rgba(255,255,255,0.05); border: none; color: #FFF; border-radius: 4px; cursor: pointer;" title="Expandir al Centro de Mensajes">
                    <i class="pi pi-external-link" style="font-size: 0.8rem;"></i>
                  </button>
              </h3>
              <div class="chat-box">
                <div v-for="(msg, idx) in selectedOrder.chat" :key="idx" :class="['chat-bubble', msg.class]">
                  <span class="sender">{{ msg.sender }}</span>
                  <p>{{ msg.text }}</p>
                </div>
                
                <div class="chat-input-area">
                  <input 
                    type="text" 
                    v-model="newMessage" 
                    @keyup.enter="sendMessage" 
                    placeholder="Escribe un mensaje..." 
                  />
                  <button class="send-btn" @click="sendMessage">
                    <i class="pi pi-send"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn-primary-large" @click="handleActionClick">
          {{ selectedOrder.btnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderManagementStore } from '../../application/order-management.store.js';

const router = useRouter();
const orderStore = useOrderManagementStore();

const selectedOrderId = ref('ORD-2024-003');
const newMessage = ref(''); // 🟢 VARIABLE REACTIVA DEL MENSAJE NUEVO

// 🟢 FUNCIÓN PARA IR AL CHAT GRANDE Y ENVIARLE EL ID DEL PEDIDO
const goToFullChat = () => {
  if (selectedOrder.value && selectedOrder.value.id) {
    router.push({ 
      name: 'producer-chat', 
      query: { orderId: selectedOrder.value.id } // Enviamos el ID original (ej: ORD-2024-003)
    });
  }
};

// 🟢 FUNCIÓN PARA ENVIAR MENSAJES DENTRO DEL MINI-CHAT
const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedOrder.value) return;

  const order = visualOrders.value.find(o => o.id === selectedOrderId.value);
  if (order) {
    order.chat.push({
      sender: 'Tú',
      text: newMessage.value.trim(),
      class: 'sent'
    });
  }
  
  newMessage.value = ''; // Limpiamos el input
};

// Sincronización e Inyección reactiva al montar la vista
onMounted(async () => {
  if (!orderStore.ordersLoaded) {
    await orderStore.fetchOrders();
  }
  
  const mockOrdersToInject = [
    { id: '089', client: 'Distribuidora Lima Sur', products: 'Mango Kent — 120 kg • Uva Red Globe — 50 kg', total: 170, status: 'ASSIGNED' },
    { id: '085', client: 'AgroExport S.A.', products: 'Palta Hass — 200 kg', total: 200, status: 'IN_PREPARATION' },
    { id: '082', client: 'EcoFrutas', products: 'Espárrago — 150 kg', total: 150, status: 'READY' }
  ];

  mockOrdersToInject.forEach(mock => {
    if (!orderStore.getOrderById(mock.id)) {
      orderStore.orders.push({
        id: mock.id,
        customerName: mock.client,
        client: mock.client,
        products: mock.products,
        summary: mock.products,
        totalAmount: mock.total,
        deliveryDate: '5 jun. 2025',
        status: mock.status,
        driver: 'Carlos Ávila',
        vehicle: 'ABC-123'
      });
    }
  });
});

const visualOrders = ref([
  {
    id: 'ORD-2024-003',
    client: 'Distribuidora Lima Sur',
    productsDesc: 'Mango Kent — 120 kg • Uva Red Globe — 50 kg',
    date: '5 jun. 2025',
    totalQty: '170 kg',
    productsList: 'Mango Kent, Uva Red Globe',
    lotes: [
      { id: 'Lote #205', calibre: 'Calibre A', badge: 'badge-light-green', product: 'Mango Kent', qty: '120 kg', status: 'Aprobado', statusClass: 'status-ok' },
      { id: 'Lote #206', calibre: 'Calibre B', badge: 'badge-light-orange', product: 'Uva Red Globe', qty: '50 kg', status: 'Pendiente QC', statusClass: 'status-warn' }
    ],
    chat: [
      { sender: 'Distribuidor', text: 'Hola Carlos, ¿cómo va el lote de Mango?', class: 'received' },
      { sender: 'Tú', text: 'Ya estamos empacando, sale mañana', class: 'sent' }
    ]
  },
  {
    id: 'ORD-2024-004',
    client: 'AgroExport S.A.',
    productsDesc: 'Palta Hass — 200 kg',
    date: '6 jun. 2025',
    totalQty: '200 kg',
    productsList: 'Palta Hass',
    lotes: [
      { id: 'Lote #194', calibre: 'Calibre A', badge: 'badge-light-green', product: 'Palta Hass', qty: '200 kg', status: 'Aprobado', statusClass: 'status-ok' }
    ],
    chat: [
      { sender: 'Distribuidor', text: 'Carlos, ¿podemos adelantar el empaque de palta?', class: 'received' },
      { sender: 'Tú', text: 'Buenas tardes. Sí, ya estamos en la línea de lavado.', class: 'sent' }
    ]
  },
  {
    id: 'ORD-2024-005',
    client: 'EcoFrutas',
    productsDesc: 'Espárrago — 150 kg',
    date: '4 jun. 2025',
    totalQty: '150 kg',
    productsList: 'Espárrago Verde Exportación',
    lotes: [
      { id: 'Lote #181', calibre: 'Calibre Premium', badge: 'badge-light-green', product: 'Espárragos', qty: '150 kg', status: 'Aprobado', statusClass: 'status-ok' }
    ],
    chat: [
      { sender: 'Distribuidor', text: 'Lote aprobado por Control de Calidad del almacén central.', class: 'received' }
    ]
  }
]);

const getStoreStatus = (id) => {
  let storeId = id;
  if (id === 'ORD-2024-003') storeId = '089';
  if (id === 'ORD-2024-004') storeId = '085';
  if (id === 'ORD-2024-005') storeId = '082';

  const storeOrder = orderStore.getOrderById(storeId);
  if (!storeOrder) return { text: 'Pendiente Preparación', clazz: 'badge-warning' };
  
  if (storeOrder.status === 'ASSIGNED' || storeOrder.status === 'Pendiente') {
    return { text: 'Pendiente Preparación', clazz: 'badge-warning' };
  }
  if (storeOrder.status === 'IN_PREPARATION' || storeOrder.status === 'En Preparación') {
    return { text: 'En Preparación', clazz: 'badge-blue' };
  }
  if (storeOrder.status === 'READY' || storeOrder.status === 'Listo Despacho') {
    return { text: 'Listo Despacho', clazz: 'badge-green' };
  }
  return { text: storeOrder.status, clazz: 'badge-light-green' };
};

const selectedOrder = computed(() => {
  const spec = visualOrders.value.find(o => o.id === selectedOrderId.value);
  if (!spec) return null;

  let storeId = selectedOrderId.value;
  if (selectedOrderId.value === 'ORD-2024-003') storeId = '089';
  if (selectedOrderId.value === 'ORD-2024-004') storeId = '085';
  if (selectedOrderId.value === 'ORD-2024-005') storeId = '082';

  const storeOrder = orderStore.getOrderById(storeId) || { status: 'ASSIGNED' };
  const statusMeta = getStoreStatus(selectedOrderId.value);
  
  let btnText = 'Marcar Como En Preparación';
  if (storeOrder.status === 'IN_PREPARATION' || storeOrder.status === 'En Preparación') {
    btnText = 'Marcar Como Listo para Despacho';
  } else if (storeOrder.status === 'READY' || storeOrder.status === 'Listo Despacho') {
    btnText = 'Pedido Terminado';
  }

  return {
    ...spec,
    status: statusMeta.text,
    badgeClass: statusMeta.clazz,
    btnText: btnText,
    rawStatus: storeOrder.status,
    realStoreId: storeId
  };
});

const goToFullDetail = () => {
  if (selectedOrder.value && selectedOrder.value.realStoreId) {
    router.push({ 
      name: 'producer-mis-pedidos-detalle', 
      params: { id: selectedOrder.value.realStoreId } 
    });
  }
};

const handleActionClick = () => {
  if (!selectedOrder.value) return;
  
  const currentStatus = selectedOrder.value.rawStatus;
  const targetId = selectedOrder.value.realStoreId;
  
  if (currentStatus === 'ASSIGNED' || currentStatus === 'Pendiente') {
    orderStore.simulateProducerUpdateStatus(targetId, 'En Preparación', 'status-processing');
  } else if (currentStatus === 'IN_PREPARATION' || currentStatus === 'En Preparación') {
    orderStore.simulateProducerUpdateStatus(targetId, 'Listo Despacho', 'status-success');
  } else {
    alert('Este lote ya se encuentra procesado.');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.orders-container {
  display: flex;
  height: calc(100vh - 80px); 
  font-family: 'DM Sans', sans-serif;
  background-color: #E1EBE1; 
}

.orders-master {
  width: 420px;
  min-width: 420px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4a6b4a;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
}

.tab.active {
  color: #1a3020;
  border-bottom-color: #1a3020; 
}

.tab .count {
  margin-top: 0.2rem;
  font-weight: 500;
}

.search-bar {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.6rem;
}

.search-icon {
  color: #9ab39d;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.search-input-wrapper input {
  border: none;
  outline: none;
  width: 100%;
  font-family: inherit;
  font-size: 0.85rem;
  color: #1a3020;
  background: transparent;
}

.filter-btn {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a6b4a;
}

.order-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: #1e2d22; 
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 233, 82, 0.3);
}

.order-card.active {
  border-left: 4px solid #D4E952; 
  background: #253629;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.order-id {
  font-weight: 800;
  font-size: 0.9rem;
  color: #FFFFFF;
}

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.badge-warning { background-color: rgba(255, 193, 7, 0.15); color: #ffca2c; }
.badge-blue { background-color: rgba(13, 110, 253, 0.15); color: #6ea8fe; }
.badge-green { background-color: rgba(25, 135, 84, 0.15); color: #75b798; }

.client-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFFFFF;
}

.products-desc {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  color: #9ab39d;
}

.date-info {
  font-size: 0.8rem;
  color: #9ab39d;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.mini-stepper {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.step span {
  font-size: 0.65rem;
  color: #9ab39d;
}

.step .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #9ab39d;
}

.step.completed .dot {
  background: #D4E952;
  border-color: #D4E952;
}

.step.completed span { color: #FFFFFF; }

.step.line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.8rem;
}

.order-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  position: relative;
}

.detail-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 3rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.detail-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  letter-spacing: -0.02em;
}

.header-actions-group {
  display: flex;
  gap: 8px;
}

.menu-btn {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a3020;
  transition: background 0.2s;
}

.menu-btn:hover {
  background: #f1f5f1;
}

.info-grid-card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-item .label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #D4E952;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item .value {
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
}

.detail-columns {
  display: flex;
  gap: 2rem;
}

.detail-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a3020;
}

.lotes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.lote-card {
  background: #1e2d22;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.2rem;
}

.lote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.lote-id {
  font-weight: 800;
  font-size: 0.9rem;
  color: #FFFFFF;
}

.badge-light-green { background-color: rgba(212, 233, 82, 0.15); color: #D4E952; }
.badge-light-orange { background-color: rgba(253, 126, 20, 0.15); color: #fd9843; }

.lote-product {
  margin: 0;
  font-size: 0.9rem;
  color: #9ab39d;
  display: flex;
  align-items: center;
}

.lote-qty {
  margin: 0.2rem 0 1rem 0;
  font-size: 0.85rem;
  color: #9ab39d;
}

.lote-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.status {
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-ok { color: #75b798; }
.status-warn { color: #fd9843; }
.link { color: #D4E952; text-decoration: none; }

.timeline {
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 15px;
  bottom: -5px;
  width: 2px;
  background-color: rgba(26, 48, 32, 0.1);
}

.timeline-item:last-child::before { display: none; }

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(26, 48, 32, 0.2);
  position: relative;
  z-index: 1;
  margin-top: 3px;
}

.timeline-item.completed .timeline-dot {
  background: #D4E952;
  border-color: #D4E952;
}

.timeline-item.completed::before { background-color: #D4E952; }
.timeline-content p { margin: 0; }
.timeline-content .title { font-size: 0.95rem; font-weight: 700; color: #1a3020; }
.timeline-item.pending .timeline-content .title { color: #4a6b4a; }
.timeline-content .time { font-size: 0.8rem; color: #4a6b4a; margin-top: 0.2rem; display: flex; align-items: center; gap: 4px; }

.chat-title {
  background: #1e2d22;
  margin: 0;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px 12px 0 0;
  font-size: 0.95rem;
  color: #FFFFFF;
}

.chat-box {
  background: #253629;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0 0 12px 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-bubble {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  max-width: 85%;
  font-size: 0.9rem;
}

.chat-bubble .sender {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: rgba(255, 255, 255, 0.6);
}

.chat-bubble p { margin: 0; color: #FFFFFF; }
.chat-bubble.received { background-color: rgba(255, 255, 255, 0.05); align-self: flex-start; border-radius: 12px 12px 12px 0; }
.chat-bubble.sent { background-color: #D4E952; align-self: flex-end; border-radius: 12px 12px 0 12px; }
.chat-bubble.sent p { color: #121212; }
.chat-bubble.sent .sender { text-align: right; color: rgba(0, 0, 0, 0.5); }

.chat-input-area { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.chat-input-area input {
  flex: 1; padding: 0.8rem 1rem; background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: #FFFFFF;
}
.send-btn { background-color: #D4E952; border: none; border-radius: 8px; width: 44px; display: flex; align-items: center; justify-content: center; color: #121212; font-weight: 800; cursor: pointer; }

.detail-actions { background: transparent; padding: 1.5rem 3rem; position: sticky; bottom: 0; }
.btn-primary-large {
  width: 100%; background-color: #D4E952; color: #121212; border: none; padding: 1.2rem;
  border-radius: 12px; font-size: 1.1rem; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 12px rgba(212, 233, 82, 0.2); transition: all 0.2s;
}
.btn-primary-large:hover { background-color: #e2f57a; transform: translateY(-2px); }
</style>