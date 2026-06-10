<template>
  <div class="chat-page">
    <AppHeader title="Centro de Mensajes" subtitle="Comunícate con tus productores y flota en tiempo real" />
    <div class="chat-layout">
      <ChatList :conversations="conversations" :active-id="activeId" @select="activeId=$event" />
      <ChatWindow :messages="currentMessages" :order-id="activeId" @send="sendMsg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader  from '../../../shared/presentation/components/app-header.vue';
import ChatList   from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';

const route = useRoute();
const activeId = ref('ORD-2024-003');

// 🟢 ATRAPAMOS EL ID DESDE LA URL SI VENIMOS DE OTRA PANTALLA
onMounted(() => {
  if (route.query.orderId) {
    activeId.value = String(route.query.orderId);
  }
});

// Usamos ref() para que la vista previa se actualice al enviar mensajes
const conversations = ref([
  { id:'ORD-2024-003', preview:'Ya estamos empacando, sale mañana', time:'9:30 AM', unread:2 },
  { id:'ORD-2024-004', preview:'Buenas tardes. Sí, ya estamos...',  time:'Ayer',    unread:0 },
  { id:'ORD-2024-005', preview:'Lote aprobado por Control...',      time:'20 May',  unread:0 },
]);

const allMessages = ref<Record<string, any[]>>({
  'ORD-2024-003': [
    { id:1, from:'me',   text:'Hola Carlos, ¿cómo va el lote de Mango?', time:'8:15 AM' },
    { id:2, from:'prod', text:'Ya estamos empacando, sale mañana',       time:'8:17 AM', unread:true },
  ],
  'ORD-2024-004': [
    { id:1, from:'me',   text:'Carlos, ¿podemos adelantar el empaque de palta?', time:'Ayer 4:15 PM' },
    { id:2, from:'prod', text:'Buenas tardes. Sí, ya estamos en la línea de lavado.', time:'Ayer 4:20 PM' }
  ],
  'ORD-2024-005': [
    { id:1, from:'me',   text:'Lote aprobado por Control de Calidad del almacén central.', time:'20 May 10:00 AM' },
  ],
});

const currentMessages = computed(() => allMessages.value[activeId.value] ?? []);

let nextId = 10;
function sendMsg(text: string) {
  if (!allMessages.value[activeId.value]) allMessages.value[activeId.value] = [];
  
  // Agregar el mensaje al historial
  allMessages.value[activeId.value].push({
    id: nextId++, 
    from:'me', 
    text,
    time: new Date().toLocaleTimeString('es', {hour:'2-digit', minute:'2-digit'}),
  });

  // Actualizar el texto de vista previa en la barra izquierda
  const conv = conversations.value.find(c => c.id === activeId.value);
  if (conv) {
    conv.preview = text;
    conv.time = 'Ahora';
    conv.unread = 0;
  }
}
</script>

<style scoped>
.chat-page   { display:flex; flex-direction:column; height:calc(100vh - 80px); overflow:hidden; padding: 32px; background: #E1EBE1; }
.chat-layout { display:grid; grid-template-columns:300px 1fr; flex:1; overflow:hidden; border:1px solid rgba(255, 255, 255, 0.05); border-radius:12px; background: #1e2d22; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>