<template>
  <div class="chat-page">
    <AppHeader title="Centro de Mensajes" subtitle="Comunícate con tus productores en tiempo real" />
    <div class="chat-layout">
      <ChatList :conversations="conversations" :active-id="activeConversationId" @select="activeConversationId = $event" />
      <ChatWindow :messages="currentMessages" :order-id="activeOrderId" @send="sendMsg" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../../../shared/presentation/components/app-header.vue';
import ChatList from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';
import { ChatApi } from '../../infrastructure/chat-api.js';

const route = useRoute();
const chatApi = new ChatApi();

// 🌟 FIX: Ahora el Distribuidor es el ID 1, para que coincida con el Productor
const DISTRIBUTOR_ID = 1;

const activeConversationId = ref(null);
const conversations = ref([]);
const allMessages = ref({});

onMounted(async () => {
  try {
    const res = await chatApi.getConversations(DISTRIBUTOR_ID);
    conversations.value = res.data.map(c => ({
      id: c.id,
      orderId: c.orderId,
      name: `Pedido #${c.orderId}`,
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
      from: m.senderId === DISTRIBUTOR_ID ? 'me' : 'dist', // 'dist' acá significa el otro lado (Productor)
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
      senderId: DISTRIBUTOR_ID,
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
.chat-page   { display:flex; flex-direction:column; height:calc(100vh - 80px); overflow:hidden; padding: 32px; background: #E1EBE1; }
.chat-layout { display:grid; grid-template-columns:300px 1fr; flex:1; overflow:hidden; border:1px solid rgba(255, 255, 255, 0.05); border-radius:12px; background: #1e2d22; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>