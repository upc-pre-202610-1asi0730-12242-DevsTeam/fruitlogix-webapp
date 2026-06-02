<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from "./shared/presentation/components/main-layout.vue";

const route = useRoute();
const isPublicRoute = computed(() => ['login', 'register'].includes(route.name));
</script>

<template>
  <template v-if="isPublicRoute">
    <router-view />
  </template>
  <MainLayout v-else>
    <router-view />
  </MainLayout>
</template>
