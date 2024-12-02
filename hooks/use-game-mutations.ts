import axios from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import { checkAnswerSchema, endGameSchema } from '@/schemas';

type CheckAnswerResponse = {
  percentageSimilar?: number;
  isCorrect?: boolean;
};

type APIError = {
  message: string;
  status: number;
};

export function useGameMutations() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAnswer = async (payload: z.infer<typeof checkAnswerSchema>, 
    options?: { 
      onSuccess?: (data: CheckAnswerResponse) => void, 
      onError?: (error: APIError) => void 
    }
  ) => {
    try {
      setIsChecking(true);
      const response = await axios.post('/api/check-answer', payload);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const apiError: APIError = {
        message: error instanceof Error ? error.message : 'An error occurred',
        status: axios.isAxiosError(error) ? error.response?.status ?? 500 : 500
      };
      options?.onError?.(apiError);
      throw error;
    } finally {
      setIsChecking(false);
    }
  };

  const endGame = async (payload: z.infer<typeof endGameSchema>) => {
    try {
      const response = await axios.post('/api/end-game', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    checkAnswer,
    endGame,
    isChecking
  };
} 