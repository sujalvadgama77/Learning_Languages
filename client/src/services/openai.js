import { API_ENDPOINTS } from '../config/openai';

export const generateAIResponse = async (message, languageCode, messageHistory = []) => {
  try {
    const response = await fetch(API_ENDPOINTS[languageCode], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Flask API:', error);
    throw error;
  }
}; 