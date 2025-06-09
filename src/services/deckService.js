import api from '@/api/axios';

// Deck Operations
export const getRecentDecks = async (limit = 5) => {
  try {
    const response = await api.get(`/decks/recent?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching recent decks:', error);
    throw error;
  }
};

export const searchDecks = async (query) => {
  try {
    const response = await api.get(`/decks/search?query=${query}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching decks:', error);
    throw error;
  }
};

export const getAllDecks = async () => {
  try {
    const response = await api.get('/decks');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all decks:', error);
    throw error;
  }
};

export const getOwnDecks = async () => {
  try {
    const response = await api.get('/decks/own');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching own decks:', error);
    throw error;
  }
};

export const getUserPublicDecks = async (userId) => {
  try {
    const response = await api.get(`/decks/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user public decks:', error);
    throw error;
  }
};

export const getDeckById = async (deckId) => {
  try {
    const response = await api.get(`/decks/${deckId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deck by ID:', error);
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

// Card Operations
export const getCardsInDeck = async (deckId) => {
  try {
    const response = await api.get(`/decks/${deckId}/cards`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cards in deck:', error);
    throw error;
  }
};

export const getCard = async (deckId, cardId) => {
  try {
    const response = await api.get(`/decks/${deckId}/cards/${cardId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching card:', error);
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

export const updateCard = async (deckId, cardId, cardData) => {
  try {
    const response = await api.put(`/decks/${deckId}/cards/${cardId}`, cardData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCard = async (deckId, cardId) => {
  try {
    const response = await api.delete(`/decks/${deckId}/cards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// Progress Tracking
export const updateCardProgress = async (deckId, cardId, isCorrect) => {
  try {
    const response = await api.post(`/decks/${deckId}/cards/${cardId}/progress`, { isCorrect });
    return response.data.data;
  } catch (error) {
    console.error('Error updating card progress:', error);
    throw error;
  }
};

export const getDeckProgress = async (deckId) => {
  try {
    const response = await api.get(`/decks/${deckId}/progress`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deck progress:', error);
    throw error;
  }
};

// Deck Ratings
export const getDeckRatings = async (deckId) => {
  try {
    const response = await api.get(`/decks/${deckId}/ratings`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deck ratings:', error);
    throw error;
  }
};

export const rateDeck = async (deckId, isLike) => {
  try {
    const response = await api.post(`/decks/${deckId}/ratings`, { isLike });
    return response.data.data;
  } catch (error) {
    console.error('Error rating deck:', error);
    throw error;
  }
};

export const deleteRating = async (deckId) => {
  try {
    const response = await api.delete(`/decks/${deckId}/ratings`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};