<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <router-link class="header-logo" to="/">
        <Logo/>
      </router-link>
      <button class="minimize-btn">
        <SidebarIcon/>
      </button>
    </div>
    <nav class="sidebar__nav" role="navigation">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav__link"
        :class="{ active: isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <component :is="item.icon" class="nav__icon" />
        <span>{{ item.label }}</span>
      </router-link>
      <router-link
       to="/create-deck"
       class="create-btn"
      >
        <PlusIcon/>
        <span>Create</span>
      </router-link>
    </nav>
    <div class="sidebar__footer">
      <button
        class="footer__link"
      >
        <InfoIcon/>
        <span>Information</span>
      </button>
      <button
        class="footer__link"
      >
        <SettingsIcon/>
        <span>Settings</span>
      </button>
      <button
        @click="handleLogout"
        class="footer__link"
      >
        <LogoutIcon/>
        <span>Log out</span>
      </button>
    </div>
  </aside>

</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/assets/images/logo.vue'
import { 
  PlusIcon, 
  HomeIcon, 
  LibraryIcon, 
  SidebarIcon, 
  InfoIcon,
  SettingsIcon,
  LogoutIcon,
} from '@/components/icons';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/library', label: 'My Library', icon: LibraryIcon },
];

// Handle logout action
const handleLogout = () => {
  authStore.logout();
  router.push('/login')
};
</script>

<style scoped>
.sidebar {
  position: sticky;
  width: 260px;
  top: 20px;
  background: var(--bg-tertiary);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 78px;
  border-radius: 28px;
  height: calc(100vh - 40px);
  padding: 24px 20px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  gap: 12px;
}

.header-logo{
  display: flex;
}

.minimize-btn {
  display: flex;
  background: #323232;
  color: #fff;
  padding: 8px;
  border-radius: 14px;
  width: 28px;
  height: 28px;
}

.sidebar__nav {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav__link, .create-btn{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  height: 48px;
  border-radius: 24px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: background-color 0.2s;
}

.nav__link:hover {
  background-color: #323232;
}

.nav__link.active {
  background-color: #323232;
}
.nav__link.active .nav__icon {
  color: var(--primary-color);
}

.create-btn{
  margin-top: 44px;
  background: var(--primary-color);
  justify-content: center;
  gap: 10px;
}

.sidebar__icon {
  width: 20px;
  height: 20px;
}

.sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer__link {
  display: flex;
  gap: 14px;
  padding: 8px 18px;
  height: 36px;
  font-size: 14px;
  color: #fff;
}
</style>
