<template>
    <aside class="userbar">
        <div class="userbar__header">
            <div class="usercard">
                <div class="user-avatar">
                    <img src="/avatar.png">
                </div>
                <div class="user-info">
                    <span class="user_name">
                        {{ user.fullName || 'Unknown' }}
                    </span>
                    <span class="user_email">
                        {{ user.email || 'user@example.com' }}
                    </span>
                </div>
            </div>
            <div class="userbar-actions">
                <button class="action-btn">
                    <MailIcon/>
                </button>
                <button class="action-btn">
                    <NotificationIcon/>
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { MailIcon, NotificationIcon } from '@/components/icons';

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
</script>

<style scoped>
.userbar {
    position: sticky;
    width: 360px;
    height: fit-content;
    top: 20px;
    background: var(--bg-secondary);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 28px;
    padding: 20px;
}
.userbar__header {
    display: flex;
    gap: 10px;
    justify-content: space-between;
}
.usercard {
    display: flex;
    gap: 14px;
    min-width: 0;
}
.user-avatar {
    display: flex;
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    overflow: hidden;
}
.user-avatar img {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid #fff;
}
.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 0;
}
.user_name {
    font-size: 16px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
}
.user_email {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-color-light);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
}
.userbar-actions {
    display: flex;
    gap: 10px;
}
.action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    background: var(--bg-primary);
    border-radius: 50%;
    width: 52px;
    height: 52px;
}
</style>