<template>
  <div class="card mb-3 shadow-sm bg-dark px-0">
    <div class="card-body">
      <!-- Author and date -->
      <div class="d-flex align-ites-center justify-content-between mb-3">
        <small class="card-text">
          Posted by:
          <span :style="{ color: '#' + postData.userId._id.slice(-6) }">{{ postData.userId.username }}</span>

        </small>
        <small class="card-text">{{ timeAgo(postData.createdAt) }}</small>
      </div>

      <!-- Title -->
      <h5 class="card-title fw-bold text-primary">

        {{ postData.title }}
      </h5>

      <!-- Truncated Content -->
      <p class="card-text">
        {{ truncatedContent }}s
      </p>

      <!-- Footer (like Reddit actions space) -->
      <div class="d-flex justify-content-between">
        <p class="card-text m-0">
          Comments ({{ postData.commentCount?.toString() || postData?.comments?.length }})
        </p>
        <router-link :to="{ path: `/posts/${postData._id}` }" class="btn btn-outline-primary btn-sm">
          Read More
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { timeAgo } from '@/utils/date';
import { computed } from 'vue';

const props = defineProps({
  postData: Object,
  maxLength: {
    type: Number,
    default: 150,
  }
});

const truncatedContent = computed(() => {
  if (props.postData.content.length <= props.maxLength) return props.postData.content;
  return props.postData.content.substring(0, props.maxLength) + "...";
});
</script>

<style scoped>
.bg-dark {
  background-color: var(--color-background-soft) !important;
  border-color: var(--color-border) !important;
}

.card-text,
.card-title {
  color: var(--color-text) !important;
}
</style>
