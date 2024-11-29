import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { quizCreationSchema } from '@/schemas';

type Input = z.infer<typeof quizCreationSchema>;

interface UseCreateQuizReturn {
  createQuiz: (data: Input) => Promise<{ gameId: string }>;
  isLoading: boolean;
}

export function useCreateQuiz(): UseCreateQuizReturn {
  const [isLoading, setIsLoading] = useState(false);

  const createQuiz = async (data: Input) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/game", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createQuiz, isLoading };
} 