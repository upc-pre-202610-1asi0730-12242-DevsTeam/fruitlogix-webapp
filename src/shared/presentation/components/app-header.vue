<template>
  <div class="app-header">
    <div class="header-content">
      <h2 class="title">{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.header-content {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a3020;
  margin: 0 0 4px 0;
}
.subtitle {
  font-size: 14px;
  color: #4a6b4a;
  margin: 0;
}
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
