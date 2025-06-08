<template>
  <div class="topbar">
    <div class="topbar-content">
      <!-- Search Bar Section -->
      <div class="search-bar">
        <div class="search-input">
          <label for="topbar-search" class="search-icon">
            <SearchIcon/>
          </label>
          <input
            type="text"
            name="wordly-search"
            v-model="searchQuery"
            placeholder="Search flashcard sets ..."
            id="topbar-search"
            class="search_input"
            @keydown.enter="handleSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/store/authStore.js';
import { useRouter, useRoute } from 'vue-router';
import { SearchIcon } from '@/components/icons';

// Access the authentication store
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Search state
const searchQuery = ref('');

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    });
  }
};

// Computed properties for authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery;
  }
}, { immediate: true });

</script>

<style scoped>
/* topbar container */
.topbar {
  background-color: var(--bg-secondary);
  border-radius: 28px;
  height: 92px;
  display: flex;
  align-items: center;
  padding: 20px;
  flex-shrink: 0;
}

/* topbar content */
.topbar-content {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.search-input{
  position: relative;
  width: 100%;
}

.search_input {
  width: 100%;
  height: 52px;
  padding: 14px 24px 14px 56px;
  border-radius: 25px;
  font-size: 14px;
  border: none;
  outline: none;
  transition: border-color 0.2s;
}
.search_input::placeholder{
  color: var(--text-color-light);
}

.search-icon{
  position: absolute;
  top: 50%;
  left: 6px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--secondary-color);
  border-radius: 20px;
  transform: translateY(-50%);
  display: flex;
}
</style>