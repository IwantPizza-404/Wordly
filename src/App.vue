<template>
  <div :class="['app-container', { 'app-container--grid': $route.meta.showUI }]">
    <Sidebar v-if="$route.meta.showUI"/>
    <div class="main-layout">
      <Topbar v-if="$route.meta.showUI"/>
      <div class="main-content">
        <RouterView />
      </div>
    </div>
    <Userbar v-if="$route.meta.showUI"/>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue';
import Topbar from '@/components/layout/Topbar.vue';
import Userbar from './components/layout/Userbar.vue';
</script>

<style>
.app-container {
  padding: 20px;
}

.app-container--grid {
  display: grid;
  grid-template-columns: 260px auto 360px;
  gap: 18px;
}

.main-layout {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>