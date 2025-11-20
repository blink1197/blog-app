<template>
  <div class="container py-4">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- POST FOUND -->
    <div v-else-if="post">

      <!-- Post Card -->
      <div class="card shadow-sm bg-dark mb-4">
        <div class="card-body">

          <!-- Author + Date -->
          <div class="d-flex justify-content-between mb-4 card-text">
            <small>
              Posted by:
              <span :style="{ color: '#' + post.userId._id.slice(-6) }">
                {{ post.userId.username }}
              </span>
            </small>
            <small>
              {{ timeAgo(post.createdAt) }}
            </small>
          </div>

          <h3 class="fw-bold card-title">{{ post.title }}</h3>
          <p class="mt-3 card-text">{{ post.content }}</p>

        </div>
      </div>

      <!-- Comments Section -->
      <div class="card shadow-sm bg-dark">
        <div class="card-body">

          <h5 class="fw-bold mb-3">
            Comments ({{ post.comments.length }})
          </h5>

          <!-- Comment Form -->
          <div v-if="isLoggedIn" class="mb-3">
            <textarea v-model="newComment" class="form-control bg-transparent text-white border" rows="3"
              placeholder="Write a comment..."></textarea>

            <button class="btn btn-primary btn-sm mt-2" @click="submitComment" :disabled="commentLoading">
              <span v-if="commentLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Post Comment</span>
            </button>
          </div>

          <p v-else class="card-text">
            Login to write a comment.
          </p>

          <hr>

          <!-- Comments List -->
          <div v-if="post.comments.length > 0">
            <div v-for="c in post.comments" :key="c._id" class="mb-3 pb-2 border-bottom">
              <strong class="card-text">
                <span :style="{ color: '#' + c.userId._id.slice(-6) }">
                  {{ c.userId.username }}
                </span>
              </strong>
              <small class="card-text ms-2">{{ timeAgo(c.createdAt) }}</small>

              <!-- Truncated Content -->
              <p class="mt-1 card-text">
                {{ truncatedComment(c._id, c.comment) }}
                <span v-if="c.comment.length > maxCommentLength" class="text-primary cursor-pointer"
                  @click="toggleComment(c._id)">
                  {{ expandedComments[c._id] ? ' Show less' : ' Read more' }}
                </span>
              </p>
            </div>
          </div>

          <p v-else class="card-text">No comments yet.</p>

        </div>
      </div>

    </div>

    <!-- POST NOT FOUND -->
    <div v-else class="text-center text-danger">
      Post not found.
    </div>

  </div>
</template>

<script setup>
import api from "@/api/api";
import { useUserStore } from "@/stores/user";
import { timeAgo } from "@/utils/date";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Pinia store
const { isLoggedIn } = useUserStore();

const route = useRoute();

const post = ref(null);
const loading = ref(true);

const newComment = ref("");
const commentLoading = ref(false);


const maxCommentLength = 100; // max characters before truncating

// Track which comments are expanded
const expandedComments = ref({});

// Return truncated comment if not expanded
function truncatedComment(id, comment) {
  if (expandedComments.value[id]) return comment;
  if (comment.length <= maxCommentLength) return comment;
  return comment.slice(0, maxCommentLength) + "...";
}

// Toggle comment expansion
function toggleComment(id) {
  expandedComments.value[id] = !expandedComments.value[id];
}

// Fetch single post
async function fetchPost() {
  try {
    loading.value = true;
    const { data } = await api.get(`/posts/${route.params.id}`);
    post.value = data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Add comment
async function submitComment() {
  if (!newComment.value.trim()) return;

  try {
    commentLoading.value = true;

    const { data } = await api.post(`/posts/${route.params.id}/comments`, {
      comment: newComment.value
    });

    // Update post
    post.value = data.updatedPost;

    newComment.value = "";
  } catch (err) {
    console.error(err);
  } finally {
    commentLoading.value = false;
  }
}

onMounted(fetchPost);
</script>

<style scoped>
.bg-dark {
  background-color: var(--color-background-soft) !important;
}

.card-text,
.card-title {
  color: var(--color-text) !important;
}

textarea::placeholder {
  color: #bbb;
  opacity: 1;
}

.border-bottom {
  border-color: var(--color-border) !important;
}

.cursor-pointer {
  cursor: pointer;
  user-select: none;
}

.text-primary {
  color: var(--bs-primary) !important;
}
</style>
