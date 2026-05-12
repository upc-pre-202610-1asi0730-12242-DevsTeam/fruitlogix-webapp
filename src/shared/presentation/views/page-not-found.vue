<script setup>
</script>
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/home">Volver al Dashboard</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #1a3020;
}
h1 { font-size: 5rem; margin: 0; }
a { color: #1bb37e; font-weight: 700; margin-top: 1rem; }
</style>
