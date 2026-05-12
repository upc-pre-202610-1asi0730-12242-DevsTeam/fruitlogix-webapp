<template>
  <div class="lang-switcher">
    <button
        v-for="lang in languages"
        :key="lang.code"
        class="lang-btn"
        :class="{ active: locale === lang.code }"
        @click="setLocale(lang.code)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' }
];

function setLocale(code) {
  locale.value = code;
}
</script>

<style scoped>
.lang-switcher {
  display: flex;
  background: #1e2d22;
  padding: 3px;
  border-radius: 8px;
}
.lang-btn {
  padding: 0.4rem 0.75rem;
  border: none;
  background: transparent;
  color: #8fba8f;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn.active {
  background: #fff;
  color: #1a3020;
}
</style>
