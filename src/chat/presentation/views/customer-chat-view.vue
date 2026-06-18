<template>
  <div class="chat-page">
    <AppHeader title="Mensajes" subtitle="Conversaciones con tu distribuidor" />
    <div class="chat-layout">
      <ChatList
          :conversations="conversations"
          :active-id="String(activeConversationId)"
          @select="activeConversationId = $event"
      />
      <ChatWindow
          :messages="currentMessages"
          :order-id="String(activeOrderId)"
          @send="sendMsg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '../../../shared/presentation/components/app-header.vue';
import ChatList from '../components/chat-list.vue';
import ChatWindow from '../components/chat-window.vue';
import { ChatApi } from '../../infrastructure/chat-api.js';

const chatApi = new ChatApi();

const CLIENT_ID = 1; // hardcodeado por ahora
const DISTRIBUTOR_ID = 2;

const activeConversationId = ref(null);
const conversations = ref([]);
const allMessages = ref({});

onMounted(async () => {
  try {
    const res = await chatApi.getConversations(CLIENT_ID);
    conversations.value = res.data.map(c => ({
      id: c.id,
      orderId: c.orderId,
      preview: 'Ver mensajes...',
      time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) : '',
      unread: 0
    }));
    if (conversations.value.length > 0) {
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
      from: m.senderId === CLIENT_ID ? 'me' : 'dist',
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
      senderId: CLIENT_ID,
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

    // Actualizar preview
    const conv = conversations.value.find(c => c.id === activeConversationId.value);
    if (conv) { conv.preview = text; conv.time = 'Ahora'; }
  } catch (e) {
    console.error('Error enviando mensaje:', e);
  }
}
</script>

<style scoped>
.chat-page   { display:flex; flex-direction:column; height:calc(100vh - 120px); overflow:hidden; padding: 20px; background: #E1EBE1; }
.chat-layout { display:grid; grid-template-columns:300px 1fr; flex:1; overflow:hidden; border:1px solid rgba(255, 255, 255, 0.05); border-radius:12px; background: #1e2d22; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>
