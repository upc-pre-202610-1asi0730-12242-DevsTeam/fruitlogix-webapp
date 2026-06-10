<template>
  <div class="chat-page">
    <AppHeader title="Mensajes" subtitle="Conversaciones con tu distribuidor" />
    <div class="chat-layout">
      <ChatList :conversations="conversations" :active-id="activeId" @select="activeId=$event" />
      <ChatWindow :messages="currentMessages" :order-id="activeId" @send="sendMsg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppHeader  from '../../../shared/presentation/components/app-header.vue';
import ChatList   from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';

const activeId = ref('ORD-2025-089');

const conversations = [
  { id:'ORD-2025-089', preview:'El pedido está a 10 minutos...', time:'9:30 AM', unread:2 },
  { id:'ORD-2025-087', preview:'Entregado correctamente',         time:'Ayer',    unread:1 },
  { id:'ORD-2025-085', preview:'Pedido confirmado',                  time:'20 May',  unread:0 },
];

const allMessages = ref<Record<string, any[]>>({
  'ORD-2025-089': [
    { id:1, from:'dist', text:'Hola, tu pedido ya salió del almacén. ETA: 9:45 AM', time:'8:15 AM' },
    { id:2, from:'me',   text:'Perfecto, gracias. ¿Pueden llamar antes de llegar?', time:'8:17 AM' },
    { id:3, from:'dist', text:'Claro, el conductor te llamará 15 minutos antes',    time:'8:18 AM' },
    { id:4, from:'dist', text:'El pedido está a 10 minutos de tu ubicación',     time:'9:30 AM', unread:true },
  ],
  'ORD-2025-087': [
    { id:1, from:'dist', text:'Pedido entregado correctamente', time:'Ayer 10:00 AM' },
  ],
});

const currentMessages = computed(() => allMessages.value[activeId.value] ?? []);

let nextId = 10;
function sendMsg(text: string) {
  if (!allMessages.value[activeId.value]) allMessages.value[activeId.value] = [];
  allMessages.value[activeId.value].push({
    id: nextId++, from:'me', text,
    time: new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'}),
  });
}
</script>

<style scoped>
.chat-page   { display:flex; flex-direction:column; height:calc(100vh - 120px); overflow:hidden; padding: 20px; background: #E1EBE1; }
.chat-layout { display:grid; grid-template-columns:300px 1fr; flex:1; overflow:hidden; border:1px solid rgba(255, 255, 255, 0.05); border-radius:12px; background: #1e2d22; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>
