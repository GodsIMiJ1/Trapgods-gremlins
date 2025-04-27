
import { useState, useCallback, useEffect } from 'react';
import { OpenAIService } from '../services/openai';

export const useOpenAIBattle = () => {
  // Initialize the OpenAIService immediately without requiring an API key
  const [openAIService] = useState<OpenAIService>(new OpenAIService());
  const [bossRoast, setBossRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRoast = useCallback(async () => {
    console.log('Generating new roast...');
    setBossRoast("...");
    setIsLoading(true);

    try {
      const newRoast = await openAIService.generateRoast();
      setBossRoast(newRoast);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error generating roast:', error);
      setBossRoast("Your code's so buggy, even console.log gave up!");
      setIsLoading(false);
      return true;
    }
  }, [openAIService]);

  const evaluateResponse = useCallback(async (response: string) => {
    if (!response.trim()) return;
    setIsLoading(true);

    try {
      const result = await openAIService.evaluateResponse(response);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Error evaluating response:', error);
      setIsLoading(false);
      return 'mid';
    }
  }, [openAIService]);

  // For backward compatibility
  const initializeOpenAI = useCallback(() => {
    // This function is kept for backward compatibility
    // but doesn't need to do anything anymore
    console.log('OpenAI service is already initialized');
  }, []);

  return {
    bossRoast,
    openAIService,
    initializeOpenAI,
    generateRoast,
    evaluateResponse,
    isLoading
  };
};
