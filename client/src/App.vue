<script setup>
import NavbarComponent from './components/layout/NavbarComponent.vue';
</script>

<template>
  <NavbarComponent />
  <main>
    <RouterView />
  </main>

</template>

<style scoped>
main {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
