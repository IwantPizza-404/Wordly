<template>
    <div class="deck-container">
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
        
        <div v-else-if="!currentDeck.Cards || currentDeck.Cards.length === 0" class="no-cards">
            <p>This deck has no cards yet</p>
            <router-link :to="`/decks/${currentDeck.id}/edit`" class="edit-link">Add Cards</router-link>
        </div>
        
        <div v-else class="study-session">
            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
                <span class="progress-text">{{ currentCardIndex + 1 }} / {{ currentDeck.Cards.length }}</span>
            </div>

            <!-- Card Display -->
            <div class="card-container" @click="toggleAnswer">
                <div class="card" :class="{ 'flipped': showAnswer }">
                    <div class="card-front">
                        <h2>{{ currentCard?.question }}</h2>
                        <p class="hint">Click to reveal answer</p>
                    </div>
                    <div class="card-back">
                        <h2>{{ currentCard?.answer }}</h2>
                    </div>
                </div>
            </div>

            <!-- Study Controls -->
            <div class="controls">
                <button 
                    class="control-btn"
                    @click="previousCard"
                    :disabled="currentCardIndex === 0"
                >
                    Previous
                </button>
                
                <button 
                    class="control-btn primary"
                    @click="nextCard"
                    :disabled="isLastCard"
                >
                    Next
                </button>
            </div>

            <!-- Study Stats -->
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Correct:</span>
                    <span class="stat-value correct">{{ studyProgress.correct }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Incorrect:</span>
                    <span class="stat-value incorrect">{{ studyProgress.incorrect }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total:</span>
                    <span class="stat-value">{{ studyProgress.total }}</span>
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
const progress = computed(() => deckStore.progress);
const showAnswer = computed(() => deckStore.showAnswer);
const studyProgress = computed(() => deckStore.studyProgress);

// Methods
const toggleAnswer = () => deckStore.toggleAnswer();
const nextCard = () => deckStore.nextCard();
const previousCard = () => deckStore.previousCard();

const retryLoading = async () => {
    const deckId = route.params.id;
    if (deckId) {
        await loadDeck(deckId);
    }
};

const loadDeck = async (deckId) => {
    try {
        await deckStore.fetchDeck(deckId);
    } catch (error) {
        console.error('Error loading deck:', error);
    }
};

// Load deck on component mount
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
.deck-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
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

.study-session {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.progress-container {
    width: 100%;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
}

.progress-text {
    position: absolute;
    right: 0;
    top: -20px;
    font-size: 0.9rem;
    color: #6c757d;
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
    flex-direction: column;
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

.hint {
    color: #6c757d;
    font-size: 0.9rem;
    margin-top: 1rem;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.control-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.control-btn.primary {
    background-color: #007bff;
    color: white;
}

.control-btn.primary:hover:not(:disabled) {
    background-color: #0056b3;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    color: #6c757d;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: bold;
}

.stat-value.correct {
    color: #28a745;
}

.stat-value.incorrect {
    color: #dc3545;
}
</style>