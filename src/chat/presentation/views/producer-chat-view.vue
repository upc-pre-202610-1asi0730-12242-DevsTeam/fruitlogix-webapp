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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ChatList from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';
import { ChatApi } from '../../infrastructure/chat-api.js';

const route = useRoute();
const chatApi = new ChatApi();

const PRODUCER_ID = 3;

const activeConversationId = ref(null);
const conversations = ref([]);
const allMessages = ref({});

onMounted(async () => {
  try {
    const res = await chatApi.getConversations(PRODUCER_ID);
    conversations.value = res.data.map(c => ({
      id: c.id,
      orderId: c.orderId,
      preview: 'Ver mensajes...',
      time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) : '',
      unread: 0
    }));

    if (route.query.orderId) {
      const match = conversations.value.find(c => String(c.orderId) === String(route.query.orderId));
      if (match) activeConversationId.value = match.id;
    }

    if (!activeConversationId.value && conversations.value.length > 0) {
      activeConversationId.value = conversations.value[0].id;
    }
  } catch (e) {
    console.error('Error cargando conversaciones:', e);
  }
});

watch(activeConversationId, async (id) => {
  if (!id || allMessages.value[id]) return;
  try {
    const res = await chatApi.getMessages(id);
    allMessages.value[id] = res.data.map(m => ({
      id: m.id,
      from: m.senderId === PRODUCER_ID ? 'me' : 'dist',
      text: m.content,
      time: new Date(m.sentAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    }));
  } catch (e) {
    console.error('Error cargando mensajes:', e);
  }
});

const currentMessages = computed(() => allMessages.value[activeConversationId.value] ?? []);
const activeOrderId = computed(() => {
  const conv = conversations.value.find(c => c.id === activeConversationId.value);
  return conv?.orderId ?? '';
});

async function sendMsg(text) {
  if (!activeConversationId.value) return;
  try {
    const res = await chatApi.sendMessage(activeConversationId.value, {
      senderId: PRODUCER_ID,
      content: text
    });
    if (!allMessages.value[activeConversationId.value]) {
      allMessages.value[activeConversationId.value] = [];
    }
    allMessages.value[activeConversationId.value].push({
      id: res.data.id,
      from: 'me',
      text: res.data.content,
      time: new Date(res.data.sentAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    });
    const conv = conversations.value.find(c => c.id === activeConversationId.value);
    if (conv) { conv.preview = text; conv.time = 'Ahora'; }
  } catch (e) {
    console.error('Error enviando mensaje:', e);
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