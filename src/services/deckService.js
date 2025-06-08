import api from '@/api/axios';

export const fetchDecks = async () => {
  try {
    const response = await api.get(`/decks`);
    console.log(response)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching decks:', error);
    throw error;
  }
};

export const createDeck = async (deckData) => {
  try {
    const response = await api.post('/decks', deckData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

export const createCard = async (deckId, cardData) => {
  try {
    const response = await api.post(`/decks/${deckId}/cards`, cardData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

export const updateDeck = async (deckId, deckData) => {
  try {
    const response = await api.put(`/decks/${deckId}`, deckData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating deck:', error);
    throw error;
  }
};

export const deleteDeck = async (deckId) => {
  try {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

export const fetchDeck = async (deckId) => {
  try {
    const response = await api.get(`/decks/${deckId}`);
    console.log(response)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deck:', error);
    throw error;
  }
};

export const submitAnswer = async (deckId, cardId, answer) => {
  try {
    const response = await api.post(`/decks/answers/deck/${deckId}/card/${cardId}`, {
      userAnswer: answer
    });
    return response.data.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

export const getCardAnswer = async (deckId, cardId) => {
  try {
    const response = await api.get(`/decks/answers/deck/${deckId}/card/${cardId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching card answer:', error);
    throw error;
  }
}; 