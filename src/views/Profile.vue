<template>
    <div v-if="loading">
        <!-- loader -->
    </div>
    <div v-else-if="profile" class="profile-page">
        <div class="container">
            <section class="profile__header">
                <div class="user-card">
                    <div class="user-avatar">
                        <img :src="profile?.avatarUrl || '/avatar.png'" alt="User">
                    </div>
                    <div class="user-info">
                        <span class="user_username">
                            {{ profile?.userName || 'Unknown' }}
                        </span>
                        <span class="user_name">
                            {{ profile?.fullName || 'John Doe' }}
                        </span>
                    </div>
                </div>
                <button class="action-btn">
                    <MoreIcon/>
                </button>
            </section>
            <section class="profile__content">
                {{ decks }}
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchUser } from '@/services/userService';
import { getUserPublicDecks } from '@/services/deckService';
import { useAuthStore } from '@/store/authStore';
import { MoreIcon } from '@/components/icons';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const router = useRouter();
const route = useRoute();

const profile = ref([]);
const decks = ref(null);

const loading = ref(true);
const error = ref(null);

const loadProfile = async (user_id) => {
  loading.value = true;
  error.value = null;

  try {
    profile.value = await fetchUser(user_id);
    decks.value = await getUserPublicDecks(user_id);
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load data';
  } finally {
    loading.value = false;
  }
};

// react to route param changes
watch(
  () => route.params.user_id,
  (newUserId) => {
    if (newUserId) {
        loadProfile(newUserId);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    width: 100%;
    padding: 20px 0;
}

.container {
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
}

.profile__header {
    display: flex;
    gap: 16px;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
    border-radius: 28px;
}

.user-avatar {
    width: 64px;
    height: 64px;
    overflow: hidden;
    flex-shrink: 0;
}
.user-avatar img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    object-fit: cover;
}

.user-card {
    display: flex;
    gap: 14px;
    min-width: 0;
}

.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 0;
}
.user_username {
    font-size: 24px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
}
.user_name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color-light);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
}

.action-btn{
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>