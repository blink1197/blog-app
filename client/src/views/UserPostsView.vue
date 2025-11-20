<script setup>
import api from '@/api/api';
import PostCard from '@/components/PostCard.vue';
import { useUserStore } from '@/stores/user';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { isLoggedIn, isAdmin } = userStore;

const posts = reactive({ data: [] });
const user = ref(null);
const isLoading = ref(true); // start loading immediately

async function fetchAll() {
  try {
    const userId = route.params.id;

    const [userRes, postsRes] = await Promise.all([
      api.get(`/users/details/${userId}`),
      api.get(`/posts/user/${userId}`)
    ]);

    console.log(userRes)
    user.value = userRes.data;
    posts.data = postsRes.data.posts;

  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onBeforeMount(() => {
  if (!isLoggedIn || !isAdmin) router.push('/');
});

onMounted(fetchAll);
</script>

<template>
  <div class="container pt-5">
    <!-- Header -->
    <div class="row">
      <div class="col mb-3 text-start">
        <h1 class="py-1">{{ user?.username }}'s Activity</h1>
        <p class="tagline">Manage user activity</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="row g-4 mt-3">
      <div v-for="n in 3" :key="n" class="col-12">
        <div class="card shadow-sm p-3 placeholder-card">
          <div class="placeholder-line w-75 mb-3"></div>
          <div class="placeholder-line w-100 mb-2"></div>
          <div class="placeholder-line w-100 mb-2"></div>
          <div class="placeholder-line w-50"></div>
        </div>
      </div>
    </div>


    <!-- Empty State -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="!isLoading && posts.data.length === 0" class="text-center py-5">
        <img src="/images/empty-box.png" alt="No Posts" width="120" class="mb-3" />
        <h5 class="text-white">No posts available at the moment.</h5>
      </div>

      <!-- Posts Grid -->
      <TransitionGroup v-else name="fade-slide" tag="div" class="row g-4 mt-3 px-2">
        <PostCard v-for="post in posts.data" :key="post._id" :postData="post" />
      </TransitionGroup>
    </Transition>
  </div>
</template>

<style>
.bg-dark {
  background-color: var(--color-background-soft) !important;
}

.card-text,
.card-title {
  color: var(--color-text) !important;
}


/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loading placeholders */
.placeholder-card {
  border-radius: 0.75rem;
  background: var(--color-background-soft);
  min-height: 150px;
  border-color: var(--color-border)
}

.placeholder-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #2b2b2b 25%, #5c5c5c 50%, #636363 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

textarea::placeholder {
  color: #bbb !important;
  opacity: 1 !important;
}

input::placeholder {
  color: #bbb !important;
  opacity: 1 !important;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  /* enough space */
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
