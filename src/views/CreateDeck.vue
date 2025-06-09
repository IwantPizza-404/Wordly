<template>
    <div class="create-deck">
        <h1>Create New Deck</h1>
        
        <div class="deck-form">
            <div class="form-group">
                <label for="title">Deck Title</label>
                <input 
                    type="text" 
                    id="title" 
                    v-model="deckData.title" 
                    placeholder="Enter deck title"
                    required
                >
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                    id="description" 
                    v-model="deckData.description" 
                    placeholder="Enter deck description"
                    rows="3"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        v-model="deckData.isPublic"
                    >
                    Make this deck public
                </label>
            </div>
        </div>

        <div class="cards-section">
            <h2>Cards</h2>
            <div class="cards-list">
                <div v-for="(card, index) in cards" :key="index" class="card-item">
                    <div class="card-content">
                        <div class="form-group">
                            <label>Question</label>
                            <input 
                                type="text" 
                                v-model="card.question" 
                                placeholder="Enter question"
                            >
                        </div>
                        <div class="form-group">
                            <label>Answer</label>
                            <input 
                                type="text" 
                                v-model="card.answer" 
                                placeholder="Enter answer"
                            >
                        </div>
                    </div>
                    <button class="remove-card" @click="removeCard(index)">×</button>
                </div>
            </div>

            <button class="add-card-btn" @click="addCard">Add Card</button>
        </div>

        <div class="actions">
            <button 
                class="save-btn" 
                @click="saveDeck" 
                :disabled="!isValid || loading"
            >
                {{ loading ? 'Saving...' : 'Save Deck' }}
            </button>
        </div>
    </div>
</template>

<script>
import { useDeckStore } from '@/store/deckStore';
import { createDeck, createCard } from '@/services/deckService';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'CreateDeck',
    
    setup() {
        const deckStore = useDeckStore();
        const router = useRouter();
        
        const deckData = ref({
            title: '',
            description: '',
            isPublic: false
        });

        const cards = ref([{ question: '', answer: '' }]);
        const loading = ref(false);

        const isValid = computed(() => {
            return deckData.value.title.trim() !== '' && 
                   cards.value.length > 0 &&
                   cards.value.every(card => 
                       card.question.trim() !== '' && 
                       card.answer.trim() !== ''
                   );
        });

        const addCard = () => {
            cards.value.push({ question: '', answer: '' });
        };

        const removeCard = (index) => {
            if (cards.value.length > 1) {
                cards.value.splice(index, 1);
            }
        };

        const saveDeck = async () => {
            if (!isValid.value) return;

            loading.value = true;
            try {
                const newDeck = await createDeck(deckData.value);
                
                // Add cards to the deck
                for (const card of cards.value) {
                    await createCard(newDeck.id, card);
                }

                router.push(`/decks/${newDeck.id}`);
            } catch (error) {
                console.error('Error saving deck:', error);
            } finally {
                loading.value = false;
            }
        };

        return {
            deckData,
            cards,
            loading,
            isValid,
            addCard,
            removeCard,
            saveDeck
        };
    }
}
</script>

<style scoped>
.create-deck {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

h2 {
    color: #2c3e50;
    margin: 2rem 0 1rem;
}

.deck-form {
    background: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

input[type="text"]:focus,
textarea:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
}

.cards-section {
    background: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 1rem;
    position: relative;
}

.card-content {
    flex: 1;
    display: flex;
    gap: 1rem;
}

.card-content .form-group {
    flex: 1;
    margin-bottom: 0;
}

.remove-card {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: #dc3545;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
}

.add-card-btn {
    background: #42b983;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    margin-top: 1rem;
}

.add-card-btn:hover {
    background: #3aa876;
}

.actions {
    margin-top: 2rem;
    text-align: center;
}

.save-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    min-width: 200px;
}

.save-btn:hover:not(:disabled) {
    background: #34495e;
}

.save-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}
</style>