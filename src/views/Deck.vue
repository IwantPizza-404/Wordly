<template>
  <div class="deck-page">
    <div class="container">
      <section class="deck">
        <h1 class="deck-title">{{ deck?.title }}</h1>
        <p class="deck-description">{{ deck?.description }}</p>
        <div class="deck-content">
          <div v-if="deck?.Cards && deck.Cards.length > 0" class="flashcard-container">
            <div @click="deckStore.toggleAnswer" class="flashcard">
              <h2 class="card-question">{{ deckStore.showAnswer ? deckStore.currentCard.answer : deckStore.currentCard.question }}</h2>
            </div>
          </div>
          <p v-else>No cards available in this deck.</p>
          <!-- <pre>{{ deckStore.currentSession }}</pre> -->
          <div class="deck-actions">
            <button @click="deckStore.updateCardStatus(deckStore.currentCard.id, false)" :disabled="!deckStore.currentCard">❌</button>
            <button @click="deckStore.updateCardStatus(deckStore.currentCard.id, true)" :disabled="!deckStore.currentCard">✔</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDeckStore } from '@/store/deckStore'

const route = useRoute()
const deckStore = useDeckStore()
const deck = computed(() => deckStore.currentDeck)

// react to route param changes
watch(
  () => route.params.id,
  (newDeckId) => {
    if (newDeckId) {
      deckStore.startStudySession(newDeckId);
    }
  },
  { immediate: true }
);
</script>
  
<style scoped>
.deck-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  padding: 20px 0;
}

.container {
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
}

.deck {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.deck-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}
.deck-actions button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}
.deck-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 20px;
  margin-top: 20px;
}
.deck-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.flashcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 24px;
  height: 165px;
  width: 100%;
  padding: 20px;
}
</style>