import api from '@/api/api';
import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  // Load user from localStorage or initialize empty
  const storedUser = JSON.parse(localStorage.getItem('user')) || {
    token: null,
    userId: null,
    email: null,
    username: null,
    isAdmin: null
  };

  // Reactive state
  const user = reactive(storedUser);

  // Computed state
  const isLoggedIn = computed(() => !!(user.token && user.email));
  const isAdmin = computed(() => user.isAdmin);

  // Fetch user details
  async function getUserDetails(token) {
    if (!token) {
      logout();
      return;
    }

    try {
      const { data } = await api.get('/users/details');
      Object.assign(user, {
        token,
        userId: data._id,
        email: data.email,
        username: data.username,
        isAdmin: data.isAdmin
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    }
  }

  // Login
  async function login(email, password) {
    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data.access) {
        user.token = data.access;
        localStorage.setItem('token', data.access);

        // Get user details
        await getUserDetails(data.access);
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  }

  async function register({ email, password, username }) {
    try {
      const { status, data } = await api.post('/users/register', { email, password, username });

      if (status === 201) {
        return {
          success: true,
          message: data?.message
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Register failed failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  }

  // Logout
  function logout() {
    Object.keys(user).forEach(key => (user[key] = null));
    localStorage.removeItem('token');
    try {
      router.push('/login');
    } catch {
      console.warn('Router not available during logout');
    }
  }


  // Watch for user changes and persist in localStorage
  watch(
    () => user,
    (newVal) => {
      localStorage.setItem('user', JSON.stringify(newVal));
    },
    { deep: true }
  );

  // Rehydrate token from localStorage
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    user.token = savedToken;
    getUserDetails(savedToken);
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    getUserDetails,
    login,
    register,
    logout,
  };
}, {
  persist: false,
});
