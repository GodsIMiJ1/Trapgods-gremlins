
import { useState, useCallback } from 'react';
import { OpenAIService } from '../services/openai';

export const useOpenAIBattle = () => {
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);
  const [bossRoast, setBossRoast] = useState('');

  const initializeOpenAI = useCallback((apiKey: string) => {
    setOpenAIService(new OpenAIService(apiKey));
  }, []);

  const generateRoast = useCallback(async () => {
    if (!openAIService) return;
    
    console.log('Generating new roast...');
    setBossRoast("...");
    
    try {
      const newRoast = await openAIService.generateRoast();
      setBossRoast(newRoast);
      return true;
    } catch (error) {
      console.error('Error generating roast:', error);
      setBossRoast("Your code's so buggy, even console.log gave up!");
      return true;
    }
  }, [openAIService]);

  const evaluateResponse = useCallback(async (response: string) => {
    if (!openAIService || !response.trim()) return;
    return await openAIService.evaluateResponse(response);
  }, [openAIService]);

  return {
    bossRoast,
    openAIService,
    initializeOpenAI,
    generateRoast,
    evaluateResponse
  };
};
