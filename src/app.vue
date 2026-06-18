<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from "./shared/presentation/components/main-layout.vue";

const route = useRoute();
// Detecta si es una ruta pública (Login, Register, etc.)
const isPublicRoute = computed(() => ['login', 'register', 'not-found'].includes(route.name));
</script>

<template>
  <template v-if="isPublicRoute">
    <router-view />
  </template>

  <MainLayout v-else>
    <router-view />
  </MainLayout>
</template>