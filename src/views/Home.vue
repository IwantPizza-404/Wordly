<template>
  <div class="home-page">
    <div class="container">
      <!-- Popular sets section -->
      <section class="content-section">
        <div class="section-header">
          <div class="section-icon">
            <LightningIcon />
          </div>
          <h2 class="section-title">Popular sets</h2>
        </div>
        <div v-if="loadingPopular && !popularDecks.length">
          <swiper
            :modules="[SwiperPagination, SwiperNavigation, SwiperFreeMode, SwiperMousewheel]"
            :free-mode="true"
            :slides-per-view="'auto'"
            :space-between="16"
            :navigation="false"
            :mousewheel="{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true
            }"
            :touch-ratio="1"
            :touch-angle="45"
            :touch-move-stop-propagation="true"
            :resistance="true"
            :resistance-ratio="0.85"
            :observer="true"
            :observeParents="true"
            class="sets-swiper"
          >
            <swiper-slide v-for="n in 6" :key="`skeleton-${n}`">
              <div class="set-card skeleton">
                <div class="skeleton-content">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-terms"></div>
                  <div class="skeleton-user"></div>
                  <div class="skeleton-actions"></div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div v-else-if="!popularDecks.length" class="empty-state">
          No popular sets found.
        </div>
        <div v-else>
          <swiper
            :modules="[SwiperPagination, SwiperNavigation, SwiperFreeMode, SwiperMousewheel]"
            :free-mode="true"
            :slides-per-view="'auto'"
            :space-between="16"
            :navigation="{
              nextEl: '.sets-swiper-next',
              prevEl: '.sets-swiper-prev'
            }"
            :mousewheel="{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true
            }"
            :touch-ratio="1"
            :touch-angle="45"
            :touch-move-stop-propagation="true"
            :resistance="true"
            :resistance-ratio="0.85"
            :observer="true"
            :observeParents="true"
            class="sets-swiper"
          >
            <swiper-slide v-for="deck in popularDecks" :key="`popular-${deck.id}`">
              <div 
                class="set-card"
                @click="navigateToDeck(deck.id)"
                role="button"
                tabindex="0"
                @keydown.enter="navigateToDeck(deck.id)"
                aria-label="Open set"
              >
                <div class="set-card__content">
                  <h3 class="set-card__title">{{ deck.title }}</h3>
                  <div class="set-card__terms">
                    <FlagIcon class="icon-small" />
                    <span>{{ deck.cardCount || 0 }} terms</span>
                  </div>
                  <div class="set-card__user">
                    <div class="user-avatar-small">
                      <img :src="deck.user?.avatar || '/avatar.png'" alt="User avatar" />
                    </div>
                    <span>{{ deck.user?.userName || 'user2921' }}</span>
                  </div>
                </div>
                <div class="set-card__actions">
                  <button class="play-btn">Play</button>
                  <button class="play-icon-btn">
                    <PlayIcon/>
                  </button>
                </div>
              </div>
            </swiper-slide>
            <div class="sets-swiper-prev">
              <button class="sets-swiper_prev">
                <ArrowLeftIcon/>
              </button>
            </div>
            <div class="sets-swiper-next">
              <button class="sets-swiper_next">
                <ArrowRightIcon/>
              </button>
            </div>
          </swiper>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FlagIcon, PlayIcon, LightningIcon, ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';
import { fetchDecks } from '@/services/deckService';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Swiper
const SwiperPagination = Pagination;
const SwiperNavigation = Navigation;
const SwiperFreeMode = FreeMode;
const SwiperMousewheel = Mousewheel;

// State variables
const router = useRouter();

const popularDecks = ref([]);
const loadingPopular = ref(false);

const loadPopularDecks = async () => {
  if (loadingPopular.value) return;
  
  loadingPopular.value = true;
  
  try {
    const newDecks = await fetchDecks(); 
    
    if (newDecks && newDecks.length > 0) {
      popularDecks.value = newDecks;
    }
  } catch (err) {
    console.error('Error loading popular decks:', err);
  } finally {
    loadingPopular.value = false;
  }
};

const navigateToDeck = (deckId) => {
  router.push(`/deck/${deckId}`);
};

onMounted(async () => {
  loadPopularDecks();
});
</script>

<style scoped>
.home-page {
  background-color: var(--bg-primary);
  min-height: 100vh;
  width: 100%;
  padding: 20px 0;
}

.container {
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
}

.content-section {
  display: flex;
  flex-direction: column;
  padding: 22px 20px 20px 20px;
  background: var(--bg-secondary);
  border-radius: 28px;
  gap: 24px;
  width: 100%;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  display: flex;
}

.section-icon svg {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.section-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-color);
}

.sets-swiper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.sets-swiper-prev, .sets-swiper-next {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  width: 68px;
  z-index: 1;
}
.sets-swiper-prev {
  left: 0;
  background: linear-gradient(to right, var(--bg-secondary), transparent);
}

.sets-swiper-next {
  right: 0;
  justify-content: end;
  background: linear-gradient(to left, var(--bg-secondary), transparent);
}

.sets-swiper_prev, .sets-swiper_next{
  width: 36px;
  height: 36px;
  background: var(--bg-primary);
  border-radius: 18px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sets-swiper-prev.swiper-button-disabled, .sets-swiper-next.swiper-button-disabled {
  visibility: hidden;
}

.swiper-slide {
  width: 230px;
  height: auto;
}

.set-card {
  background: var(--bg-primary);
  border-radius: 24px;
  padding: 22px 20px 18px; 
  display: flex;
  flex-direction: column;
  gap: 18px;
  cursor: pointer;
}

.set-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.set-card__title {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.set-card__terms {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 400;
}

.set-card__terms .icon-small {
  width: 14px;
  height: 14px;
}

.set-card__user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
}

.user-avatar-small {
  width: 24px;
  height: 24px;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar-small img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  object-fit: cover;
}

.set-card__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.play-btn {
  flex-grow: 1;
  padding: 10px 18px;
  height: 40px;
  border: 1px solid var(--text-color);
  border-radius: 20px;
  background-color: transparent;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}

.play-icon-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
}

/* Skeleton styles */
.set-card.skeleton {
  background: var(--bg-secondary);
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  background: var(--skeleton-bg);
  border-radius: 4px;
}

.skeleton-terms {
  width: 50%;
  height: 16px;
  background: var(--skeleton-bg);
  border-radius: 4px;
}

.skeleton-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
}

.skeleton-user::before {
  content: '';
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--skeleton-bg);
}

.skeleton-user-name {
  width: 40%;
  height: 16px;
  background: var(--skeleton-bg);
  border-radius: 4px;
}

.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
  justify-content: space-between;
}

.skeleton-actions::before {
  content: '';
  width: 60%;
  height: 48px;
  background: var(--skeleton-bg);
  border-radius: 10px;
}

.skeleton-actions::after {
  content: '';
  width: 48px;
  height: 48px;
  background: var(--skeleton-bg);
  border-radius: 10px;
}

@keyframes pulse {
  0% {
    background-color: var(--skeleton-bg-start);
  }
  50% {
    background-color: var(--skeleton-bg-end);
  }
  100% {
    background-color: var(--skeleton-bg-start);
  }
}

/* Custom Swiper Navigation Buttons (assuming default swiper navigation is used) */
/* You might need to override default swiper-button-next/prev styles here */
/* .swiper-button-next, .swiper-button-prev {
  color: var(--text-color-light); 
  top: 50%;
  transform: translateY(-50%);
} */

.swiper-button-next:after, .swiper-button-prev:after {
    font-size: 24px; /* Adjust icon size */
}

.empty-state {
  text-align: center;
  color: var(--text-color-light);
  font-size: 18px;
  padding: 50px 0;
}
</style>