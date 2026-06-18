<template>
  <div class="chat-area">
    <div class="chat-top">
      <div class="av">FD</div>
      <div style="flex:1;">
        <div class="chat-top-name">FruitLogix Distribuidor</div>
        <span class="ctx-chip">Pedido #{{ orderId }} · En ruta</span>
      </div>
      <span class="online-dot"></span>
      <span style="font-size:12px;color:#2e7d32;font-weight:600;">En línea</span>
    </div>

    <div class="messages" ref="messagesEl">
      <div class="date-sep"><span>Hoy</span></div>
      <template v-for="msg in messages" :key="msg.id">
        <div v-if="msg.from==='dist'" class="msg-in">
          <div class="av sm">FD</div>
          <div class="bubble-in" :class="{ unread: msg.unread }">
            <div class="msg-text">{{ msg.text }}</div>
            <div class="msg-time">{{ msg.time }}</div>
          </div>
        </div>
        <div v-else class="msg-out">
          <div class="bubble-out">
            <div class="msg-text-out">{{ msg.text }}</div>
            <div class="msg-time-out">{{ msg.time }}</div>
          </div>
          <div class="av sm">RO</div>
        </div>
      </template>
    </div>

    <div class="chat-note">Solo puedes chatear con el distribuidor asignado a tu pedido</div>
    <div class="chat-bottom">
      <button class="attach-btn"><i class="pi pi-paperclip"></i></button>
      <input class="chat-input" v-model="newMsg" @keyup.enter="send" placeholder="Escribe un mensaje..." />
      <button class="chat-send" @click="send"><i class="pi pi-send"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
const props = defineProps({ messages: Array as any, orderId: String });
const emit = defineEmits(['send']);
const newMsg = ref('');
const messagesEl = ref<HTMLElement|null>(null);

function send() {
  if (!newMsg.value.trim()) return;
  emit('send', newMsg.value);
  newMsg.value = '';
  nextTick(() => { if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight; });
}
watch(() => props.messages?.length, () => {
  nextTick(() => { if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight; });
});
</script>

<style scoped>
.chat-area { display:flex; flex-direction:column; overflow:hidden; background:transparent; }
.chat-top  { padding:14px 20px; border-bottom:1px solid rgba(255, 255, 255, 0.05); display:flex; align-items:center; gap:12px; flex-shrink:0; }
.chat-top-name { font-size:14px; font-weight:700; color:#FFFFFF; }
.ctx-chip  { background:rgba(212, 233, 82, 0.05); border:1px solid rgba(255, 255, 255, 0.05); color:#9ab39d; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; display:inline-block; margin-top:3px; }
.av { width:40px; height:40px; border-radius:50%; background:rgba(212, 233, 82, 0.05); border:1px solid rgba(255, 255, 255, 0.05); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#D4E952; flex-shrink:0; }
.av.sm { width:32px; height:32px; font-size:11px; }
.online-dot { width:9px; height:9px; background:#4caf50; border-radius:50%; margin-left:auto; }
.messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; }
.date-sep { text-align:center; font-size:11px; color:#9ab39d; position:relative; }
.date-sep::before { content:''; position:absolute; left:0; right:0; top:50%; height:1px; background:rgba(255, 255, 255, 0.05); }
.date-sep span { background:#151a16; padding:0 12px; position:relative; }
.msg-in  { display:flex; align-items:flex-end; gap:8px; max-width:72%; }
.msg-out { display:flex; align-items:flex-end; gap:8px; max-width:72%; align-self:flex-end; flex-direction:row-reverse; }
.bubble-in  { background:rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius:4px 12px 12px 12px; padding:10px 14px; }
.bubble-in.unread { border:1px solid #D4E952; background: rgba(212, 233, 82, 0.05); }
.bubble-out { background:#D4E952; border-radius:12px 4px 12px 12px; padding:10px 14px; }
.msg-text     { font-size:13px; color:#FFFFFF; line-height:1.5; font-weight:500; }
.msg-text-out { font-size:13px; color:#121212; line-height:1.5; font-weight:600; }
.msg-time     { font-size:10px; color:#9ab39d; margin-top:4px; }
.msg-time-out { font-size:10px; color:rgba(18, 18, 18, 0.6); margin-top:4px; text-align:right; }
.chat-note   { font-size:11px; color:#9ab39d; text-align:center; padding:6px 20px; flex-shrink:0; }
.chat-bottom { padding:12px 20px; border-top:1px solid rgba(255, 255, 255, 0.05); display:flex; align-items:center; gap:10px; flex-shrink:0; background:rgba(0, 0, 0, 0.2); }
.attach-btn  { width:38px; height:38px; background:transparent; border:1px solid rgba(255, 255, 255, 0.05); border-radius:8px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; color:#FFFFFF; }
.chat-input  { flex:1; background:rgba(255, 255, 255, 0.05); border:1px solid rgba(255, 255, 255, 0.1); border-radius:8px; color:#FFFFFF; font-family:inherit; font-size:13px; padding:10px 14px; outline:none; }
.chat-input:focus { border-color:#D4E952; box-shadow: 0 0 0 2px rgba(212,233,82,0.2); }
.chat-input::placeholder { color:#9ab39d; }
.chat-send   { width:38px; height:38px; background:#D4E952; border:none; border-radius:8px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; color: #121212; }
.chat-send:hover { background:#e2f57a; }
</style>
