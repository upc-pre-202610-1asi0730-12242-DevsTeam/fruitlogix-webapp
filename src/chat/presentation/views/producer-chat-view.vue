<template>
  <div class="chat-page">
    <div class="chat-header-container">
      <h1 class="page-title">Centro de Mensajería</h1>
      <p class="page-sub">Comunícate con los distribuidores asignados a tus lotes de carga</p>
    </div>
    <div class="chat-layout">
      <ChatList :conversations="conversations" :active-id="activeId" @select="activeId=$event" />
      <ChatWindow :messages="currentMessages" :order-id="activeId" @send="sendMsg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChatList   from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';

const route = useRoute();

// Si entramos desde el acceso directo del mini-chat, seleccionará ese pedido automáticamente
const activeId = ref('ORD-2024-003');

onMounted(() => {
  if (route.query.orderId) {
    activeId.value = String(route.query.orderId);
  }
});

// Conversaciones personalizadas con los IDs correlativos del Productor
const conversations = ref([
  { id: 'ORD-2024-003', preview: 'Ya estamos empacando, sale mañana', time: '9:30 AM', unread: 0 },
  { id: 'ORD-2024-004', preview: 'Buenas tardes. Sí, ya estamos en la línea...', time: 'Ayer', unread: 0 },
  { id: 'ORD-2024-005', preview: 'Lote aprobado por Control de Calidad...', time: '20 May', unread: 0 },
]);

// Historial de mensajes mapeados para las cargas del productor
const allMessages = ref<Record<string, any[]>>({
  'ORD-2024-003': [
    { id: 1, from: 'dist', text: 'Hola Carlos, ¿cómo va el lote de Mango?', time: '8:15 AM' },
    { id: 2, from: 'me',   text: 'Ya estamos empacando, sale mañana', time: '8:17 AM' }
  ],
  'ORD-2024-004': [
    { id: 1, from: 'dist', text: 'Carlos, ¿podemos adelantar el empaque de palta?', time: 'Ayer 4:15 PM' },
    { id: 2, from: 'me',   text: 'Buenas tardes. Sí, ya estamos en la línea de lavado.', time: 'Ayer 4:20 PM' }
  ],
  'ORD-2024-005': [
    { id: 1, from: 'dist', text: 'Lote aprobado por Control de Calidad del almacén central.', time: '20 May 10:00 AM' },
  ],
});

const currentMessages = computed(() => allMessages.value[activeId.value] ?? []);

let nextId = 10;
function sendMsg(text: string) {
  if (!allMessages.value[activeId.value]) allMessages.value[activeId.value] = [];
  allMessages.value[activeId.value].push({
    id: nextId++, 
    from: 'me', 
    text,
    time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
  });
  
  // Actualiza el texto de previsualización en la lista izquierda
  const conv = conversations.value.find(c => c.id === activeId.value);
  if (conv) {
    conv.preview = text;
    conv.time = 'Ahora';
  }
}
</script>

<style scoped>
.chat-page { 
  display: flex; 
  flex-direction: column; 
  height: calc(100vh - 80px); 
  overflow: hidden; 
  padding: 32px; 
  background: #E1EBE1; 
  font-family: 'DM Sans', sans-serif;
}
.chat-header-container {
  margin-bottom: 24px;
}
.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}
.page-sub {
  color: #4a6b4a;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
.chat-layout { 
  display: grid; 
  grid-template-columns: 320px 1fr; 
  flex: 1; 
  overflow: hidden; 
  border: 1px solid rgba(255, 255, 255, 0.05); 
  border-radius: 16px; 
  background: #1e2d22; 
  box-shadow: 0 12px 32px rgba(0,0,0,0.15); 
}
</style>