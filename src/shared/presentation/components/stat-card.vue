<template>
  <div class="stat-card">
    <div class="stat-header">
      <span class="stat-title">{{ title }}</span>
      <span class="stat-icon" v-if="icon">{{ icon }}</span>
    </div>
    <div class="stat-body">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-badge" v-if="badge">{{ badge }}</div>
    </div>
    <div class="stat-progress-bg" v-if="barWidth">
      <div class="stat-progress-fill" :style="{ width: barWidth }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  badge: String,
  icon: String,
  barWidth: String
});
</script>

<style scoped>
.stat-card {
  background: #FFFFFF;
  border: 1px solid #d0e0d0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-title {
  font-size: 11px;
  font-weight: 700;
  color: #4a6b4a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-icon {
  font-size: 16px;
}
.stat-body {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1a3020;
}
.stat-badge {
  font-size: 11px;
  font-weight: 600;
  color: #2e7d32;
  background: rgba(76, 175, 80, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}
.stat-progress-bg {
  height: 6px;
  background: #F0F8EC;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}
.stat-progress-fill {
  height: 100%;
  background: #D7EC6E;
  border-radius: 4px;
}
</style>
