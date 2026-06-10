<template>
  <button class="base-button" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style scoped>
.base-button {
  background-color: #D7EC6E;
  color: #1a3020;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.base-button:hover {
  background-color: #c9e265;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(215, 236, 110, 0.4);
}
.base-button:active {
  transform: translateY(0);
}
</style>
