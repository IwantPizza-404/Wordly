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
  updateCardProgress
} from '@/services/deckService';

export const useDeckStore = defineStore('deck', {
  state: () => ({
    decks: [],                // List of all decks
    currentDeck: null,        // Current deck with progress for studying
    currentCardIndex: 0,      // Index of the current card in study mode
    showAnswer: false,        // Toggle to show card answer
    studyProgress: {          // Progress for the current study session
      correct: 0,
      incorrect: 0,
      total: 0
    },
    loading: false,           // Loading state for API calls
    error: null               // Error message
  }),

  getters: {
    // Get the current card being studied
    currentCard: (state) => {
      if (!state.currentDeck?.progress) return null;
      return state.currentDeck.progress[state.currentCardIndex];
    },

    // Check if the current card is the last one
    isLastCard: (state) => {
      if (!state.currentDeck?.progress) return true;
      return state.currentCardIndex === state.currentDeck.progress.length - 1;
    },

    // Calculate study progress percentage
    progress: (state) => {
      if (!state.currentDeck?.progress) return 0;
      return (state.currentCardIndex / state.currentDeck.progress.length) * 100;
    },

    // Get the deck summary
    summary: (state) => {
      return state.currentDeck?.summary || null;
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
        try {
          const deck = await getDeckById(deckId);
          let progress;
          try {
            progress = await getDeckProgress(deckId);
          } catch (error) {
            // If the API responds 404 (no progress record), build default
            if (error.response?.status === 404) {
              progress = {
                deckId,
                totalCards: deck.cards.length,
                progress: deck.cards.map(card => ({
                  cardId: card.id,
                  status: 'learning',
                  nextReview: null,
                  reviewCount: 0,
                  card: card
                })),
                summary: {
                  totalCards: deck.cards.length,
                  knownCards: 0,
                  learningCards: deck.cards.length,
                  completionPercentage: 0
                }
              };
            } else {
              throw error;
            }
          }
          this.currentDeck = { ...deck, ...progress };
          this.resetStudySession();
        } catch (error) {
          this.error = error.message || 'Failed to load deck';
        } finally {
          this.loading = false;
        }
    },

    // Create a new deck
    async createDeck(deckData) {
      this.loading = true;
      try {
        const newDeck = await createDeck(deckData);
        this.decks.push(newDeck);
        return newDeck;
      } catch (error) {
        this.error = error.message || 'Failed to create deck';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Add a card to a deck
    async addCard(deckId, cardData) {
      this.loading = true;
      try {
        const newCard = await createCard(deckId, cardData);
        if (this.currentDeck && this.currentDeck.id === deckId) {
          await this.fetchDeckWithProgress(deckId); // Refetch to include new card
        }
        return newCard;
      } catch (error) {
        this.error = error.message || 'Failed to add card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update a deck
    async updateDeck(deckId, deckData) {
      this.loading = true;
      try {
        const updatedDeck = await updateDeck(deckId, deckData);
        const index = this.decks.findIndex(d => d.id === deckId);
        if (index !== -1) {
          this.decks[index] = updatedDeck;
        }
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = { ...this.currentDeck, ...updatedDeck };
        }
        return updatedDeck;
      } catch (error) {
        this.error = error.message || 'Failed to update deck';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a deck
    async deleteDeck(deckId) {
      this.loading = true;
      try {
        await deleteDeck(deckId);
        this.decks = this.decks.filter(d => d.id !== deckId);
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = null;
        }
      } catch (error) {
        this.error = error.message || 'Failed to delete deck';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update a card
    async updateCard(deckId, cardId, cardData) {
      this.loading = true;
      try {
        const updatedCard = await updateCard(deckId, cardId, cardData);
        if (this.currentDeck && this.currentDeck.id === deckId) {
          const progressIndex = this.currentDeck.progress.findIndex(p => p.cardId === cardId);
          if (progressIndex !== -1) {
            this.currentDeck.progress[progressIndex].card = updatedCard;
          }
        }
        return updatedCard;
      } catch (error) {
        this.error = error.message || 'Failed to update card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a card
    async deleteCard(deckId, cardId) {
      this.loading = true;
      try {
        await deleteCard(deckId, cardId);
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck.progress = this.currentDeck.progress.filter(p => p.cardId !== cardId);
          if (this.currentCardIndex >= this.currentDeck.progress.length) {
            this.currentCardIndex = this.currentDeck.progress.length - 1;
          }
        }
      } catch (error) {
        this.error = error.message || 'Failed to delete card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update card progress during study
    async updateCardProgress(deckId, cardId, isCorrect) {
      this.loading = true;
      try {
        const updatedProgress = await updateCardProgress(deckId, cardId, isCorrect);
        const progressIndex = this.currentDeck.progress.findIndex(p => p.cardId === cardId);
        if (progressIndex !== -1) {
          this.currentDeck.progress[progressIndex] = updatedProgress;
        } else {
          this.currentDeck.progress.push(updatedProgress);
        }
        if (isCorrect) {
          this.studyProgress.correct++;
        } else {
          this.studyProgress.incorrect++;
        }
        this.studyProgress.total++;
      } catch (error) {
        this.error = error.message || 'Failed to update progress';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Move to the next card
    nextCard() {
      if (!this.currentDeck?.progress) return;
      if (this.currentCardIndex < this.currentDeck.progress.length - 1) {
        this.currentCardIndex++;
        this.showAnswer = false;
      }
    },

    // Move to the previous card
    previousCard() {
      if (!this.currentDeck?.progress) return;
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