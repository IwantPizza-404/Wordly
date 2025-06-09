import { defineStore } from 'pinia';
import { 
  getAllDecks, 
  getDeckProgress,
  getDeckById,
  createDeck, 
  createCard, 
  updateDeck, 
  deleteDeck,
  updateCard,
  deleteCard,
  startStudySession,
  updateCardStatus,
  endStudySession,
  getCurrentSession
} from '@/services/deckService';

export const useDeckStore = defineStore('deck', {
  state: () => ({
    decks: [],
    currentDeck: null,
    currentSession: null,
    currentCardIndex: 0,
    showAnswer: false,
    studyProgress: {
      correct: 0,
      incorrect: 0,
      total: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    // Get the current card being studied
    currentCard: (state) => {
      if (!state.currentDeck?.Cards) return null;
      return state.currentDeck.Cards[state.currentCardIndex];
    },

    // Check if the current card is the last one
    isLastCard: (state) => {
      if (!state.currentDeck?.Cards) return true;
      return state.currentCardIndex === state.currentDeck.Cards.length - 1;
    },

    // Calculate study progress percentage
    progress: (state) => {
      if (!state.currentSession) return 0;
      return state.currentSession.sessionProgress || 0;
    },

    // Get the deck summary
    summary: (state) => {
      return state.currentDeck?.deckProgress || null;
    }
  },

  actions: {
    // Fetch all decks
    async fetchDecks() {
      this.loading = true;
      try {
        this.decks = await getAllDecks();
      } catch (error) {
        this.error = error.message || 'Failed to fetch decks';
      } finally {
        this.loading = false;
      }
    },

    // Fetch deck with progress data
    async fetchDeckWithProgress(deckId) {
      this.loading = true;
      try {
        const deck = await getDeckById(deckId);
        const progress = await getDeckProgress(deckId);
        this.currentDeck = { ...deck, deckProgress: progress };
        await this.getCurrentStudySession(deckId);
      } catch (error) {
        this.error = error.message || 'Failed to load deck';
      } finally {
        this.loading = false;
      }
    },

    // Start a new study session
    async startStudySession(deckId) {
      this.loading = true;
      try {
        const response = await startStudySession(deckId);
        this.currentSession = response.data.session;
        this.currentDeck = await getDeckById(deckId);
        this.resetStudySession();
      } catch (error) {
        this.error = error.message || 'Failed to start study session';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update card status in current session
    async updateCardStatus(cardId, isCorrect) {
      if (!this.currentSession) return;
      this.loading = true;
      try {
        const response = await updateCardStatus(this.currentSession.id, cardId, isCorrect);
        this.currentSession = response.data.session;
        this.currentDeck = { ...this.currentDeck, deckProgress: response.deckProgress };
        if (isCorrect) {
          this.studyProgress.correct++;
        } else {
          this.studyProgress.incorrect++;
        }
        this.studyProgress.total++;
      } catch (error) {
        this.error = error.message || 'Failed to update card status';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // End current study session
    async endStudySession() {
      if (!this.currentSession) return;
      this.loading = true;
      try {
        const response = await endStudySession(this.currentSession.id);
        this.currentSession = null;
        // deckProgress is inside sessionStats.deckProgress
        this.currentDeck = { ...this.currentDeck, deckProgress: response.sessionStats.deckProgress };
        this.resetStudySession();
      } catch (error) {
        this.error = error.message || 'Failed to end study session';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get current study session
    async getCurrentStudySession(deckId) {
      this.loading = true;
      try {
        const session = await getCurrentSession(deckId);
        this.currentSession = session;
      } catch (error) {
        if (error.response?.status !== 404) {
          this.error = error.message || 'Failed to get current session';
        }
      } finally {
        this.loading = false;
      }
    },

    // Move to the next card
    nextCard() {
      if (!this.currentDeck?.Cards) return;
      if (this.currentCardIndex < this.currentDeck.Cards.length - 1) {
        this.currentCardIndex++;
        this.showAnswer = false;
      }
    },

    // Move to the previous card
    previousCard() {
      if (!this.currentDeck?.Cards) return;
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.showAnswer = false;
      }
    },

    // Toggle answer visibility
    toggleAnswer() {
      this.showAnswer = !this.showAnswer;
    },

    // Reset the study session
    resetStudySession() {
      this.currentCardIndex = 0;
      this.showAnswer = false;
      this.studyProgress = { correct: 0, incorrect: 0, total: 0 };
    },

    // Clear any error messages
    clearError() {
      this.error = null;
    }
  }
});