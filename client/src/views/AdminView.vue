<template>
  <div class="container pt-5">
    <h1>Welcome back, {{ adminUser.username }}!</h1>
  </div>


  <div class="container py-4">
    <h1 class="h4 fw-bold">User Management</h1>
    <p>View and manage user's activity</p>

    <!-- Search Bar -->
    <div class="mb-3">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by username or email..." />
    </div>

    <!-- Loading -->
    <div v-if="loading.state" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading users...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredUsers.length === 0" class="text-secondary">No matching users found.</div>

    <!-- Users -->
    <div v-else>
      <div class="">
        <div class="card shadow-sm border-0 bg-dark text-white">
          <div class="card-header fw-semibold fs-6">
            Users List
          </div>
          <div class="table-responsive card-body bg-dark text-white">
            <table class="table align-middle mb-0 bg-dark text-white">
              <thead class="table-dark">
                <tr>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Activity</th>
                  <th scope="col" class="text-end">Action</th>
                </tr>
              </thead>
              <tbody class="table-dark">
                <tr v-for="user in filteredUsers" :key="user._id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        class="rounded-circle border text-primary fw-bold d-flex align-items-center justify-content-center me-2"
                        :src="`https://placehold.co/50x50?text=${user.username.charAt(0).toUpperCase()}`"
                        style="width: 36px; height: 36px;" />
                      <span class="fw-semibold">{{ user.username }}</span>
                    </div>
                  </td>
                  <td class="text-secondary">{{ user.email }}</td>
                  <td>
                    <span class="badge"
                      :class="user.isAdmin ? 'bg-success bg-opacity-25 text-success' : 'bg-secondary bg-opacity-25 text-secondary'">
                      {{ user.isAdmin ? 'Admin' : 'User' }}
                    </span>
                  </td>
                  <td>
                    <router-link class="btn btn-sm btn-outline-primary" :to="{ path: `/posts/user/${user._id}` }"
                      target="_blank">
                      View
                    </router-link>
                  </td>
                  <td class="text-end">
                    <button @click="toggleAdmin(user)"
                      :class="user.isAdmin ? 'btn btn-sm btn-outline-danger' : 'btn btn-sm btn-outline-primary'">
                      {{ user.isAdmin ? 'Demote' : 'Promote' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import api from '@/api/api';
import { useUserStore } from '@/stores/user';
import { Notyf } from 'notyf';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const notyf = new Notyf;
const router = useRouter();
const userStore = useUserStore();
const { user: adminUser, isLoggedIn, isAdmin } = userStore;
const users = reactive({ data: [] });
const loading = reactive({ state: true });
const searchQuery = ref('');

// Fetch all users
onBeforeMount(async () => {
  try {
    const { data } = await api.get('users/all');
    users.data = data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.state = false;
  }
});


// Computed filtered list based on search query
const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return users.data;
  return users.data.filter(user =>
    user.usermme?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  );
});


// Toggle admin status
async function toggleAdmin(user) {
  if (user.email === adminUser.email) {
    notyf.error("You cannot revoke your own admin privileges.");
    return;
  }

  try {
    if (user.isAdmin) {
      await api.patch(`users/${user._id}/revoke-admin`);
    } else {
      await api.patch(`users/${user._id}/set-as-admin`);
    }

    const index = users.data.findIndex(u => u._id === user._id);
    if (index !== -1) {
      users.data[index] = { ...users.data[index], isAdmin: !users.data[index].isAdmin };
    }

    notyf.success("User privileges updated");
  } catch (error) {
    console.error('Failed to toggle admin:', error);
  }
}

onBeforeMount(() => {
  if (!isLoggedIn || !isAdmin) router.push('/');
})
</script>

<style scoped></style>
