<template>
  <div class="container pt-5">
    <h1>Welcome back, {{ user.username }}!</h1>
  </div>


  <div class="container py-4">
    <h1 class="h4 fw-bold mb-4">User Management</h1>

  </div>

</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { user, isLoggedIn, isAdmin } = userStore;

onBeforeMount(() => {
  if (!isLoggedIn || !isAdmin) router.push('/');
})
</script>
