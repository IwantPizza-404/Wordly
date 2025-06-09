<template>
    <div class="deck-page">
      <div class="container">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>Loading deck...</p>
        </div>
        
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="retryLoading">Retry</button>
        </div>
        
        <div v-else-if="!currentDeck" class="no-deck">
          <p>No deck selected</p>
          <router-link to="/" class="home-link">Go to Home</router-link>
        </div>
        
        <div v-else-if="!currentDeck?.progress || currentDeck.progress?.length === 0" class="no-cards">
          <p>This deck has no cards yet</p>
          <router-link :to="`/decks/${currentDeck.deckId}/edit`" class="edit-link">Add Cards</router-link>
        </div>

        <div v-else-if="summary">
            <p>Completion: {{ summary.completionPercentage }}%</p>
            <p>Known Cards: {{ summary.knownCards }} / {{ summary.totalCards }}</p>
        </div>
        
        <div v-else>
          <!-- Header -->
          <div class="header">
            <h1>{{ currentDeck.title }}</h1>
            <div class="icons">
              <button class="share-btn">Share</button>
              <button class="menu-btn">...</button>
            </div>
          </div>
          
          <!-- Flashcard Section -->
          <div class="flashcard-section">
            <div class="card-container" @click="toggleAnswer">
              <div class="card" :class="{ flipped: showAnswer }">
                <div class="card-front">
                  <p>{{ currentCard.question }}</p>
                </div>
                <div class="card-back">
                  <p>{{ currentCard.answer }}</p>
                </div>
              </div>
            </div>
            
            <div class="controls">
              <button @click="previousCard" :disabled="currentCardIndex === 0">Previous</button>
              <button @click="markIncorrect" class="incorrect-btn">X</button>
              <button @click="markCorrect" class="correct-btn">✓</button>
              <button @click="nextCard" :disabled="isLastCard">Next</button>
            </div>
            
            <div class="progress">
              Card {{ currentCardIndex + 1 }} of {{ currentDeck.totalCards }}
            </div>
          </div>
          
          <!-- Creator Info -->
          <div class="creator-info">
            <img :src="currentDeck.author?.avatarUrl || 'default-avatar.png'" alt="Avatar" class="avatar" />
            <p>Created by {{ currentDeck.author?.userName || 'Unknown' }}</p>
            <p>Created on {{ formatDate(currentDeck.createdAt) }}</p>
          </div>
          
          <!-- Card List -->
          <div class="card-list">
            <h2>Terms in this set ({{ currentDeck.totalCards }})</h2>
            <ul>
              <li v-for="progress in currentDeck.progress" :key="progress.cardId">
                <span>{{ progress.card.question }}</span>
                <span>{{ progress.card.answer }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Study Stats -->
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Correct</span>
              <span class="stat-value correct">{{ studyProgress.correct }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Incorrect</span>
              <span class="stat-value incorrect">{{ studyProgress.incorrect }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total</span>
              <span class="stat-value">{{ studyProgress.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useDeckStore } from '@/store/deckStore';
  
  const route = useRoute();
  const router = useRouter();
  const deckStore = useDeckStore();
  
  // Computed properties from store
  const loading = computed(() => deckStore.loading);
  const error = computed(() => deckStore.error);
  const currentDeck = computed(() => deckStore.currentDeck);
  const currentCard = computed(() => deckStore.currentCard);
  const currentCardIndex = computed(() => deckStore.currentCardIndex);
  const isLastCard = computed(() => deckStore.isLastCard);
  const showAnswer = computed(() => deckStore.showAnswer);
  const studyProgress = computed(() => deckStore.studyProgress);
  const summary = computed(() => deckStore.summary);
  
  // Methods
  const toggleAnswer = () => deckStore.toggleAnswer();
  const nextCard = () => deckStore.nextCard();
  const previousCard = () => deckStore.previousCard();
  
  const markIncorrect = async () => {
    if (!currentCard.value) return;
    await deckStore.updateCardProgress(currentDeck.value.deckId, currentCard.value.id, false);
    if (!isLastCard.value) {
      deckStore.nextCard();
    }
  };
  
  const markCorrect = async () => {
    if (!currentCard.value) return;
    await deckStore.updateCardProgress(currentDeck.value.deckId, currentCard.value.id, true);
    if (!isLastCard.value) {
      deckStore.nextCard();
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const retryLoading = async () => {
    const deckId = route.params.id;
    if (deckId) {
      await loadDeck(deckId);
    }
  };
  
  const loadDeck = async (deckId) => {
    try {
      await deckStore.fetchDeckWithProgress(deckId);
    } catch (error) {
      console.error('Error loading deck progress:', error);
    }
  };
  
  // Load deck progress on component mount
  onMounted(async () => {
    const deckId = route.params.id;
    if (deckId) {
      await loadDeck(deckId);
    } else {
      router.push('/');
    }
  });
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
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .icons {
    display: flex;
    gap: 10px;
  }
  
  .share-btn, .menu-btn {
    padding: 5px 10px;
    border: none;
    background-color: #e9ecef;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .flashcard-section {
    margin-bottom: 20px;
  }
  
  .card-container {
    perspective: 1000px;
    height: 300px;
    cursor: pointer;
  }
  
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card.flipped {
    transform: rotateY(180deg);
  }
  
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: white;
    border-radius: 12px;
    text-align: center;
  }
  
  .card-back {
    transform: rotateY(180deg);
    background-color: #f8f9fa;
  }
  
  .controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
  }
  
  .controls button {
    padding: 10px 20px;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  .incorrect-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .correct-btn {
    background-color: #28a745;
    color: white;
  }
  
  .progress {
    text-align: center;
    margin-top: 10px;
    color: #6c757d;
  }
  
  .creator-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .card-list {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-list ul {
    list-style: none;
    padding: 0;
  }
  
  .card-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .stat-value {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .correct {
    color: #28a745;
  }
  
  .incorrect {
    color: #dc3545;
  }
  
  .loading, .error, .no-deck, .no-cards {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    color: #dc3545;
  }
  
  .retry-btn, .home-link, .edit-link {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .retry-btn:hover, .home-link:hover, .edit-link:hover {
    background-color: #0056b3;
  }
  </style>