import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { fetchUser } from '@/services/userService';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import MyLibrary from '@/views/MyLibrary.vue';
import Search from '@/views/Search.vue';
import CreateDeck from '@/views/CreateDeck.vue';
import Deck from '@/views/Deck.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: Home,
    meta: { showUI: true, requiresAuth: true }
  },
  { 
    path: '/library', 
    name: 'library',
    component: MyLibrary,
    meta: { showUI: true, requiresAuth: true }
  },
  { 
    path: '/create-deck', 
    name: 'create-deck',
    component: CreateDeck,
    meta: { showUI: true, requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'login',
    component: Login,
    meta: { showUI: false }
  },
  { 
    path: '/register',
    name: 'register',
    component: Register,
    meta: { showUI: false }
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: { showUI: true, requiresAuth: true }
  },
  {
    path: '/deck/:id',
    name: 'deck',
    component: Deck,
    meta: { showUI: true, requiresAuth: true }
  },
  {
    path: '/user/:user_id',
    name: 'profile',
    component: Profile,
    meta: { showUI: true, requiresAuth: true }
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound,
    meta: { showUI: true, requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // Handle dynamic deck route

  if (to.params.deck_id && to.path.startsWith('/deck/')) {
    try {
      await fetchDeck(to.params.deck_id);
      next(); // Deck exists, proceed to Deck
    } catch (error) {
      if (error.message === 'Deck not found') {
        next({ name: 'NotFound', params: { pathMatch: to.path.slice(1).split('/') } });
      } else {
        console.error('Error fetching deck:', error);
        next({ name: 'NotFound' });
      }
    }
  }

  if (to.params.user_id && to.path.startsWith('/user/')) {
    try {
      await fetchUser(to.params.user_id);
      next(); // User exists, proceed to User
    } catch (error) {
      if (error.message === 'User not found') {
        next({ name: 'NotFound', params: { pathMatch: to.path.slice(1).split('/') } });
      } else {
        console.error('Error fetching deck:', error);
        next({ name: 'NotFound' });
      }
    }
  }

  // Handle protected routes
  else if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  }
  // Proceed for all other routes
  else {
    next();
  }
});

export default router;