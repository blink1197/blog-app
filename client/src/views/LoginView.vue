<script setup>
import { useUserStore } from '@/stores/user.js';
import { Notyf } from 'notyf';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const userStore = useUserStore()
const { login, isLoggedIn } = userStore

// refs
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// notyf instance
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'bottom' }
})

const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      notyf.success('Login successful! Welcome back.')
      router.push('/');
    } else {
      notyf.error(result.message || 'Login failed. Please try again.')
    }
  } catch (error) {
    console.error(error)
    notyf.error('An unexpected error occurred. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  if (isLoggedIn) router.push('/')
})
</script>


<template>
  <div class="container mx-auto pt-md-5 pb-md-5 mt-5">
    <div class="row align-items-center justify-content-center g-0">
      <div class="col-md-8 col-lg-6 col-sm-12 d-flex align-items-center justify-content-center px-4 py-5 p-md-5">
        <div class="w-100" style="max-width:720px;">
          <div class="">
            <div class="card-body">
              <h2 class="card-title text-center mb-4 fw-bold">Welcome Back!</h2>
              <p class="card-text text-center mb-4">
                Log into your NexTalk account.
              </p>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="emailInput" class="form-label fw-bold">Email address</label>
                  <input type="email" class="form-control py-2" id="emailInput" v-model="email"
                    placeholder="name@example.com" required />
                </div>
                <div class="mb-4">
                  <label for="passwordInput" class="form-label fw-bold">Password</label>
                  <input type="password" class="form-control py-2" id="passwordInput" v-model="password"
                    placeholder="Enter your password" required />
                </div>
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg fw-bold py-2" :disabled="isLoading">
                    <span v-if="!isLoading">Log In</span>
                    <span v-else><i class="fas fa-spinner fa-spin me-2"></i>Logging in .....</span>
                  </button>
                </div>
              </form>
            </div>
            <div class="text-center mt-4">
              <p class="mb-0">
                Don't have an account?
                <RouterLink :to="{ path: '/register' }" class="text-decoration-none fw-bold link-primary">Sign up
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope></style>
