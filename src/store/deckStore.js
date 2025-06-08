import { defineStore } from 'pinia';
import { 
    fetchDecks, 
    createDeck, 
    createCard, 
    updateDeck, 
    deleteDeck,
    fetchDeck,
    submitAnswer,
    getCardAnswer
} from '@/services/deckService';

export const useDeckStore = defineStore('deck', {
  state: () => ({
    decks: [],
    currentDeck: null,
    loading: false,
    error: null,
    currentCardIndex: 0,
    userAnswers: {},
    showAnswer: false,
    studyProgress: {
      correct: 0,
      incorrect: 0,
      total: 0
    }
  }),

  getters: {
    currentCard: (state) => {
      if (!state.currentDeck?.Cards) return null;
      return state.currentDeck.Cards[state.currentCardIndex];
    },
    
    isLastCard: (state) => {
      if (!state.currentDeck?.Cards) return true;
      return state.currentCardIndex === state.currentDeck.Cards.length - 1;
    },

    progress: (state) => {
      if (!state.currentDeck?.Cards) return 0;
      return (state.currentCardIndex / state.currentDeck.Cards.length) * 100;
    }
  },

  actions: {
    async fetchDecks() {
      this.loading = true;
      try {
        this.decks = await fetchDecks();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createDeck(deckData) {
      this.loading = true;
      try {
        const newDeck = await createDeck(deckData);
        this.decks.push(newDeck);
        return newDeck;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addCard(deckId, cardData) {
      this.loading = true;
      try {
        const newCard = await createCard(deckId, cardData);
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck.Cards = this.currentDeck.Cards || [];
          this.currentDeck.Cards.push(newCard);
        }
        return newCard;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDeck(deckId, deckData) {
      this.loading = true;
      try {
        const updatedDeck = await updateDeck(deckId, deckData);
        const index = this.decks.findIndex(d => d.id === deckId);
        if (index !== -1) {
          this.decks[index] = updatedDeck;
        }
        return updatedDeck;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDeck(deckId) {
      this.loading = true;
      try {
        await deleteDeck(deckId);
        this.decks = this.decks.filter(d => d.id !== deckId);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchDeck(deckId) {
      this.loading = true;
      try {
        const deck = await fetchDeck(deckId);
        this.currentDeck = deck;
        this.resetStudySession();
        return deck;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitAnswer(answer) {
      if (!this.currentCard) return;
      
      this.loading = true;
      try {
        const result = await submitAnswer(
          this.currentDeck.id,
          this.currentCard.id,
          answer
        );
        
        this.userAnswers[this.currentCard.id] = {
          answer,
          isCorrect: result.isCorrect
        };

        if (result.isCorrect) {
          this.studyProgress.correct++;
        } else {
          this.studyProgress.incorrect++;
        }
        this.studyProgress.total++;

        return result;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    nextCard() {
      if (!this.currentDeck?.Cards) return;
      if (this.currentCardIndex < this.currentDeck.Cards.length - 1) {
        this.currentCardIndex++;
        this.showAnswer = false;
      }
    },

    previousCard() {
      if (!this.currentDeck?.Cards) return;
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.showAnswer = false;
      }
    },

    toggleAnswer() {
      this.showAnswer = !this.showAnswer;
    },

    resetStudySession() {
      this.currentCardIndex = 0;
      this.userAnswers = {};
      this.showAnswer = false;
      this.studyProgress = {
        correct: 0,
        incorrect: 0,
        total: 0
      };
    },

    setCurrentDeck(deck) {
      this.currentDeck = deck;
    },

    clearError() {
      this.error = null;
    }
  }
});
