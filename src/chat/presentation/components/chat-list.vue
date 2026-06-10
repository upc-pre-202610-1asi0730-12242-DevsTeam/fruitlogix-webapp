<template>
  <div class="conv-list">
    <div class="list-hdr">
      <span class="list-title">Conversaciones</span>
      <span class="unread-badge">3 sin leer</span>
    </div>
    <div v-for="c in conversations" :key="c.id"
         class="conv-item" :class="{ active: activeId===c.id }"
         @click="$emit('select', c.id)">
      <div class="av">FD</div>
      <div class="conv-body">
        <div class="conv-name">FruitLogix · #{{ c.id }}</div>
        <div class="conv-preview">{{ c.preview }}</div>
      </div>
      <div class="conv-meta">
        <span class="conv-time">{{ c.time }}</span>
        <span v-if="c.unread" class="msg-badge">{{ c.unread }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ conversations: Array as any, activeId: String });
defineEmits(['select']);
</script>

<style scoped>
.conv-list { background:rgba(0, 0, 0, 0.2); border-right:1px solid rgba(255, 255, 255, 0.05); display:flex; flex-direction:column; overflow-y:auto; }
.list-hdr  { padding:16px 18px; border-bottom:1px solid rgba(255, 255, 255, 0.05); display:flex; align-items:center; justify-content:space-between; }
.list-title{ font-size:14px; font-weight:600; color: #FFFFFF; }
.unread-badge { background:#D4E952; color:#121212; font-size:10px; font-weight:700; padding:3px 8px; border-radius:20px; }
.conv-item { display:flex; align-items:flex-start; gap:12px; padding:14px 18px; cursor:pointer; border-bottom:1px solid rgba(255, 255, 255, 0.05); border-left:3px solid transparent; transition:all .15s; }
.conv-item:hover { background:rgba(255, 255, 255, 0.05); }
.conv-item.active { background:rgba(255, 255, 255, 0.05); border-left:3px solid #D4E952; }
.av { width:40px; height:40px; border-radius:50%; background:rgba(212, 233, 82, 0.05); border:1px solid rgba(255, 255, 255, 0.05); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#D4E952; flex-shrink:0; }
.conv-body   { flex:1; min-width:0; }
.conv-name   { font-size:13px; font-weight:600; color:#FFFFFF; }
.conv-preview{ font-size:12px; color:#9ab39d; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.conv-meta   { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.conv-time   { font-size:11px; color:#9ab39d; }
.msg-badge   { background:#D4E952; color:#121212; font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px; }
</style>
