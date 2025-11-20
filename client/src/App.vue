<script setup>
import FooterComponent from './components/layout/FooterComponent.vue';
import NavbarComponent from './components/layout/NavbarComponent.vue';
</script>

<template>
  <NavbarComponent />
  <main>
    <RouterView />
  </main>
  <FooterComponent />
</template>

<style scoped>
main {
  min-height: 95vh;
  max-width: 1024px;
  margin: 0 auto;
}
</style>
