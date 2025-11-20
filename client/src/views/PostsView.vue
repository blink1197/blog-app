<script setup>
import api from '@/api/api';
import PostCard from '@/components/PostCard.vue';
import { onMounted, reactive, ref } from 'vue';

const posts = reactive({ data: [] });
const isLoading = ref(false);

async function fetchAllPosts() {
  try {
    isLoading.value = true;
    const { data } = await api.get('/posts/user');
    posts.data = data.posts
    console.log(posts.data);
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchAllPosts);


</script>

<template>
  <main class="container pt-5">
    <!-- Header -->
    <div class="row">
      <div class="col mb-3 text-start">
        <h1 class="py-1 movies-title">Your Posts</h1>
        <p class="tagline">Manage your posts</p>
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





  </main>
</template>

<style>
.movies-title {
  color: var(--color-heading) !important;
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

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
